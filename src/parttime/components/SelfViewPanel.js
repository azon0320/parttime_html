import React from 'react';

import {Avatar, Card, Descriptions, Divider, List} from 'antd';
import BigTitle from "./BigTitle";

import {ParttimeConst, getParttimeStatusString} from "../Consts";

export default class SelfViewPanel extends React.Component{
    mounted = false;

    componentDidMount() {
        this.mounted = true;
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    doGetSelfViewResult(){
        this.setState({isLoading: true, errorOccur: false});
        fetch('api/user/self', {method: 'post'}).then(value => value.json())
            .then(jsonObj => {
                if (this.mounted) this.onSelfDataReceive(jsonObj);
            }).catch(reason => {
                console.log(reason);
                this.onSelfDataReceive();
        });
    }

    onSelfDataReceive(jsonORundefined){
        const modifiedStates = {isLoading: false};
        if (typeof jsonORundefined === 'undefined'){
            modifiedStates.errorOccur = true;
        }else {
            modifiedStates.errorOccur = false;
            modifiedStates.phone = jsonORundefined.phone;
            modifiedStates.uid = jsonORundefined.uid;
            modifiedStates.credit = jsonORundefined.credit;
            modifiedStates.nickname = jsonORundefined.nickname;
            modifiedStates.parttimes = jsonORundefined.parttimes;
        }
        this.setState(modifiedStates);
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
        }
    }

    renderCreatedParttimes(created){
        return (<List.Item key={created.id}>
            <Card size={"small"}>
                <BigTitle fontSize={'1.3em'} title={created.title} />
                <Descriptions size={"small"} style={{marginLeft: 16, marginRight: 16}} layout={"horizontal"} column={{sm: 2, xs: 1}}>
                    <Descriptions.Item label={'开始时间'}>{created.timestart}</Descriptions.Item>
                    <Descriptions.Item label={'结束时间'}>{created.timeend}</Descriptions.Item>
                    <Descriptions.Item label={'报名人数'}>{created.currentsigners}{created.limited===0?'':'/'+created.limited}</Descriptions.Item>
                    <Descriptions.Item label={'活动状态'}>{getParttimeStatusString(created.status)}</Descriptions.Item>
                </Descriptions>
            </Card>
        </List.Item>);
    }

    render() {
        return (
            <div style={{margin: '0 8px'}}>
                <Avatar src={"/avatar/" + this.state.uid} size={64}/>
                <Divider orientation={"center"} />
                <BigTitle
                    title={'已创建的活动'}
                    fontSize={'1.5em'}
                />
                <List
                    grid={{column: 1, lg: 2}}
                    loading={this.state.isLoading}
                    itemLayout={"horizontal"}
                    style={{margin: '0 8px'}}
                >
                    {CREATED_SAMPLE.map((value) => this.renderCreatedParttimes(value))}
                </List>
            </div>
        );
    }
}

const CREATED_SAMPLE = [
    {
        id : 2,
        location : "2,3",
        limited : 30,
        timestart : '2019-11-01 23:32',
        timeend : '2019-11-04 23:32',
        currentsigners : 14,
        title : "代拿快递",
        status : ParttimeConst.PARTTIME_STARTING,
    },
    {
        id : 3,
        location : "2,3",
        limited : 30,
        timestart : '2019-11-01 23:32',
        timeend : '2019-11-04 23:32',
        currentsigners : 14,
        title : "代拿快递2",
        status : ParttimeConst.PARTTIME_SIGNING,
    },
    {
        id : 4,
        location : "2,3",
        limited : 30,
        timestart : '2019-11-01 23:32',
        timeend : '2019-11-04 23:32',
        currentsigners : 14,
        title : "代拿快递4",
        status : ParttimeConst.PARTTIME_OUTSIGN,
    },
    {
        id : 5,
        location : "2,3",
        limited : 30,
        timestart : '2019-11-01 23:32',
        timeend : '2019-11-04 23:32',
        currentsigners : 14,
        title : "代拿快递5",
        status : ParttimeConst.PARTTIME_CANCELLED,
    },
    {
        id : 6,
        location : "2,3",
        limited : 30,
        timestart : '2019-11-01 23:32',
        timeend : '2019-11-04 23:32',
        currentsigners : 14,
        title : "代拿快递6",
        status : ParttimeConst.PARTTIME_ENDED,
    },
];