import React from 'react';

import {
    Icon, Button, Card, List, Descriptions,
    Divider, Row, Col, Badge, Empty
} from "antd";

import 'antd/dist/antd.css';

import './style/general.css';

const PARTTIME_ENDED = 1;
const PARTTIME_CANCELLED = 2;
const PARTTIME_STARTING = 3;
const PARTTIME_OUTSIGN = 4;
const PARTTIME_SIGNING = 5;

const RECORD_UNSIGN = 0;
const RECORD_CANCELLED = 1;
const RECORD_CHECKED = 2;
const RECORD_SIGNED = 3;

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
            fetch('/api/parttime/view?limit='+ITEMS_PER_FETCH+'&page=' + (1),
                {method: 'post'})
                .then(response => response.json())
                .then(obj => this.onParttimeDataReceive.bind(this)(obj));
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
        this.fetchTask = fetch('/api/parttime/view?limit='+ITEMS_PER_FETCH+'&page=' + (pageViews),
            {method: 'post'})
            .then(response => response.json())
            .then(obj => this.onParttimeDataReceive.bind(this)(obj));
    }

    onParttimeDataReceive(jsondata){
        if (!this.mounted) return;
        let pageViews = this.state.pageViews;
        let data = this.state.datas;jsondata.forEach(one => data.push(one));
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
        const IMG_GENERATOR = this.renderParttimeImage.bind(this);
        const STATUS = jsonOne.status, RECORD_STATUS = jsonOne.record.status;
        let BADGE = null;
        const ActionButtonProps = {
            disabled: STATUS !== PARTTIME_SIGNING || RECORD_STATUS === RECORD_CANCELLED,
            type: (STATUS === PARTTIME_SIGNING ? 'primary' :
                (RECORD_STATUS === RECORD_CHECKED ? 'success' : 'default')),
            title:
                RECORD_STATUS === RECORD_UNSIGN ? '报名' :
                    (RECORD_STATUS === RECORD_CANCELLED ? '已取消报名' :
                        (RECORD_STATUS === RECORD_CHECKED ? "已签到" : '取消报名'))
        };
        switch (STATUS) {
            case PARTTIME_ENDED: //已结束
                BADGE = (<Badge count={"已结束"} style={{background: '#a5a5a5', margin: '0 16px'}} />);
                break;
            case PARTTIME_CANCELLED: //已取消
                BADGE = (<Badge count={"已取消"} style={{background: '#e20007', margin: '0 16px'}} />);
                break;
            case PARTTIME_STARTING: //进行中
                BADGE = (<Badge count={"进行中"} style={{background: '#6a94ff', margin: '0 16px'}} />);
                break;
            case PARTTIME_OUTSIGN: //已截止
                BADGE = (<Badge count={"已截止"} style={{background: 'rgba(77,198,0,0.51)', margin: '0 16px'}} />);
                break;
            case PARTTIME_SIGNING: //报名中
                BADGE = (<Badge count={"报名中"} style={{background: '#4dc600', margin: '0 16px'}} />);
                break;
            default:break;
        }
        return (<List.Item key={jsonOne.id}>
            <Card size={"small"}
                  title={<Row className={'pointer'} type={'flex'} justify={'start'} align={'middle'}><h2 className={'nomargin'}>{jsonOne.title}</h2>{BADGE}</Row>}
                  extra={<Button {...ActionButtonProps}>{ActionButtonProps.title}</Button>}
            >
                <Row gutter={[8,8]} type={'flex'} justify={'space-around'} style={{marginBottom: 2}}>
                    {IMG_GENERATOR(jsonOne.id, jsonOne.img_count)}
                </Row>
                <Descriptions column={2} size={"small"} bordered={true}>
                    <Descriptions.Item span={2} label={'开始时间'}>{jsonOne.timestart}</Descriptions.Item>
                    <Descriptions.Item span={2} label={'结束时间'}>{jsonOne.timeend}</Descriptions.Item>
                    <Descriptions.Item span={2} label={'截止报名'}>{jsonOne.deadline}</Descriptions.Item>
                    <Descriptions.Item span={2} label={'活动主导'}>{"%CREATOR 发布于 %TIME".replace("%CREATOR", jsonOne.creator).replace("%TIME", jsonOne.created_at)}</Descriptions.Item>
                    {jsonOne.content !== '' ? (<Descriptions.Item span={2} label={'活动描述'}>{jsonOne.detail}</Descriptions.Item>) : null}
                </Descriptions>
                <Divider style={{margin: '8px 0 4px 0'}} orientation={"center"}/>
                <Icon type={'environment'}/><span style={{marginLeft: '.5em'}}>{jsonOne.location_str}</span>
            </Card>
        </List.Item>);
    };

    renderParttimeImage(parttimeId, imgCount){
        let elements = [];
        for(let i = 0;i < imgCount; i++){
            elements.push(
                <Col span={imgCount === 3 ? 8 : 12} key={i}>
                    <img
                        className={'responsitive'}
                        alt={'banner_' + i}
                        src={'/imgs/$pid/$index'
                            .replace('$pid', parttimeId)
                            .replace('$index', i.toString())
                        }
                    />
                </Col>
            );
        }
        return elements;
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
            <List
                itemLayout={"horizontal"}
                grid={{column: 1, lg: 2, gutter: 8}}
                style={{margin: '0 8px'}}
                loading={this.state.isLoading}
                header={
                    <Row style={{margin: 8}} type={'flex'} justify={'space-between'} align={'middle'}>
                        <Col><h2 className={'large_title'}>活动列表</h2></Col>
                        <Col><Button type={"default"} disabled={this.state.isLoading} onClick={() => this.refresh.bind(this)(true)}>刷新</Button></Col>
                    </Row>
                }
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
        );
    }
}

