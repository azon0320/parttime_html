import React from 'react';

import {Icon, Avatar, Card, Descriptions, Divider, List, Empty, Button, Row} from 'antd';
import BigTitle from "./BigTitle";

import {ParttimeConst, getParttimeStatusString} from "../tools/Consts";
import {StaticImages} from '../imgs/StaticImages';
import {ParttimeRequest} from "../tools/ParttimeRequest";
import CreatedParttime from "./CreatedParttime";

export default class SelfViewPanel extends React.Component{

    mounted = false;
    fetchTask = null;

    componentDidMount() {
        this.mounted = true;
        this.doGetSelfViewResult();
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    refresh(){
        if (this.fetchTask == null) this.doGetSelfViewResult();
    }

    logout(){
        const logoutCallback = this.props.onLogout;
        if (typeof logoutCallback !== "undefined"){logoutCallback();}
    }

    doGetSelfViewResult(){
        this.setState({isLoading: true, errorOccur: false});
        this.fetchTask = ParttimeRequest.user.self(
            this.props.token,
            (jsonObj) => {if (this.mounted) this.onSelfDataReceive(jsonObj)},
            (reason) => this.onSelfDataReceive()
        );
    }

    onSelfDataReceive(jsonORundefined){
        const modifiedStates = {isLoading: false};
        if (typeof jsonORundefined === 'undefined'){
            modifiedStates.errorOccur = true;
        }else {
            modifiedStates.errorOccur = false;
            jsonORundefined = jsonORundefined.data;
            modifiedStates.phone = jsonORundefined.phone;
            modifiedStates.uid = jsonORundefined.uid;
            modifiedStates.credit = jsonORundefined.credit;
            modifiedStates.nickname = jsonORundefined.nickname;
            modifiedStates.createds = jsonORundefined.createds;
            modifiedStates.signeds = jsonORundefined.signeds;
        }
        this.setState(modifiedStates);
        this.fetchTask = null;
    }

    //PROPS
    //token
    //enableRefresh : bool
    //enableLogout : bool
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            errorOccur: false,
            phone: '',
            uid: '',
            credit: 500,
            nickname: '',
            createds: [],
            signeds: [],
        };
        this.doGetSelfViewResult.bind(this);
        this.onSelfDataReceive.bind(this);
        this.refresh.bind(this);
    }

    renderCreatedParttimes(created){
        return <CreatedParttime key={created.id} id={created.id} />;
    }

    render() {
        return (
            <div style={{margin: '0 8px'}}>{
                this.state.errorOccur ? (
                    <Empty
                        image={<img src={StaticImages.error} alt={'ERROR'}/>}
                        description={<div>出错了！
                            <Button size={"small"} onClick={()=>this.refresh()}>要不刷新试试</Button>
                            {!!this.props.enableLogout || typeof this.props.onLogout === 'function' ? (
                                <span>或者
                                    <Button size={"small"} onClick={()=>this.logout()}>直接登出</Button></span>
                            ) : " null"}
                        </div>}
                    />) : (
                    <div>
                        <Card bordered={true} loading={this.state.isLoading}
                              title={<h2 className={'nomargin'}>{this.state.nickname}</h2>}
                              extra={<Row justify={'start'} align={'top'} type={'flex'}>
                                  <Button onClick={()=>this.refresh()}>刷新</Button>
                                  {!!this.props.enableLogout || typeof this.props.onLogout === 'function' ?
                                      <Button style={{marginLeft: 8}} onClick={()=>{this.logout()}}>登出</Button> : null}
                              </Row>}
                        >
                            <Card.Meta avatar={<Avatar
                                    icon={this.state.errorOccur || this.state.uid === '' ? <Icon type={'user'} /> : null}
                                    src={this.state.errorOccur || this.state.uid === '' ? '' : "/avatar/" + this.state.uid}
                                    size={128} shape={"square"}/>}
                                       description={
                                           <Descriptions size={"small"} layout={"horizontal"} column={{xs: 1, sm:2}}>
                                               <Descriptions.Item label={'昵称'}>{this.state.nickname}</Descriptions.Item>
                                               <Descriptions.Item label={'手机号'}>{this.state.phone}</Descriptions.Item>
                                               <Descriptions.Item label={'UID'}>{this.state.uid}</Descriptions.Item>
                                               <Descriptions.Item label={'信用分'}>{this.state.credit}</Descriptions.Item>
                                           </Descriptions>
                                       }
                            />
                        </Card>
                        <Divider orientation={"center"} />
                        <BigTitle style={{margin: 8}} title={'已创建的活动'} fontSize={'1.5em'}/>
                        <List
                            grid={{column: 1, lg: 2}}
                            loading={this.state.isLoading}
                            itemLayout={"horizontal"}
                            style={{margin: '0 8px'}}
                        >
                            {this.state.createds.map((value, index) => this.renderCreatedParttimes(value))}
                        </List>
                    </div>)
            }
            </div>
        );
    }
}