import React from 'react';

import {
    Icon, Button, Card, List, Descriptions,
    Divider, Row, Col, Badge, Empty
} from "antd";



import './style/general.css';
import BigTitle from "./components/BigTitle";

import {ParttimeConst, ParttimeRecordConst} from "./tools/Consts";

import {ParttimeRequest} from "./tools/ParttimeRequest";
import ListedParttime from "./components/ListedParttime";

const {PARTTIME_ENDED, PARTTIME_CANCELLED,PARTTIME_OUTSIGN,PARTTIME_SIGNING,PARTTIME_STARTING } = ParttimeConst;

const {RECORD_UNSIGN, RECORD_CANCELLED, RECORD_CHECKED} = ParttimeRecordConst;

const ITEMS_PER_FETCH = 3;

export default class extends React.Component{

    mounted = false;

    constructor(props){
        super(props);
        this.state = {
            isLoading : false,
            datas : [],
            pageViews : 0,
            reachBottom : false
        };
    }

    refresh(loadMoreOnce){
        this.setState({
            isLoading : true,
            datas : [],
            pageViews : 0,
            reachBottom : false
        });
        setTimeout(() => {
            ParttimeRequest.parttimes.view(
                ITEMS_PER_FETCH, 1,
                obj => this.onParttimeDataReceive.bind(this)(obj),
                reason => this.setState.bind(this)({datas:[], isLoading: false})
            );
        }, 1000);
    }

    componentDidMount() {
        this.mounted = true;
        this.loadMore();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    loadMore(){
        this.setState({isLoading: true});
        let pageViews = this.state.pageViews;
        pageViews++;
        //TODO 删除
        console.log("正在加载：第$pageViews页".replace("$pageViews", pageViews));
        ParttimeRequest.parttimes.view(
            ITEMS_PER_FETCH, pageViews,
            obj => this.onParttimeDataReceive.bind(this)(obj),
            reason => this.setState.bind(this)({datas:[], isLoading: false})
        );
    }

    onParttimeDataReceive(jsondata){
        if (!this.mounted) return;
        let pageViews = this.state.pageViews;
        let data = this.state.datas;
        try{
            jsondata.forEach(one => data.push(one));
        }catch (e) {
            console.log(e, jsondata);
            return;
        }
        this.setState({
            datas: data, isLoading: false,
            pageViews: jsondata.length > 0 ? ++pageViews : pageViews,
            reachBottom : jsondata.length === 0
        });
        this.fetchTask = null;
        return data;
    }

    renderParttimeListItems(singleJsonGenerator){
        const data = this.state.datas;
        if (data.length === 0){
            return (<Empty description={"暂无活动信息"} />)
        }else {
            return data.map(value => singleJsonGenerator(value));
        }
    }

    renderSingleParttimeItem(jsonOne){
        return (<ListedParttime key={jsonOne.id} dataSource={jsonOne} />);
    };

    render() {

        /* 百度地图搜地名
        let point = new BMap.Point(116.331398,39.897445);
        let gc = new BMap.Geocoder();
        gc.getLocation(point, function(rs){
            let addComp = rs.addressComponents;
            alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        });
         */

        return (
            <div>
                <BigTitle title={"活动列表"} rightExtras={[
                    <Button type={"default"} disabled={this.state.isLoading} onClick={() => this.refresh.bind(this)(true)}>刷新</Button>
                ]} />
                <List
                    itemLayout={"horizontal"}
                    grid={{column: 1, lg: 2, gutter: 8}}
                    style={{margin: '0 8px'}}
                    loading={this.state.isLoading}
                >
                    {this.renderParttimeListItems.bind(this)(this.renderSingleParttimeItem.bind(this))}
                    {this.state.reachBottom ? (
                            <Divider orientation={"center"} children={<span style={{color: 'rgba(0,0,0,.5)'}}>到底啦</span>} />) :
                        (<Button
                            onClick={this.loadMore.bind(this)}
                            disabled={this.state.isLoading || this.state.reachBottom}
                            style={{width: '100%'}}
                            size={"large"}>查看更多</Button>)}
                </List>
            </div>
        );
    }
}

