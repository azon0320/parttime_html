import Fetchable from "../tools/Fetchable";
import {Button, Card, Col, Descriptions, Divider, Icon, List, Row} from "antd";
import React from "react";
import {ParttimeConst, ParttimeRecordConst} from "../tools/Consts";
import StatusBadge from "./StatusBadge";
import {ParttimeRequest} from "../tools/ParttimeRequest";

const {PARTTIME_ENDED,PARTTIME_SIGNING,PARTTIME_OUTSIGN,PARTTIME_STARTING,PARTTIME_CANCELLED} = ParttimeConst;
const {RECORD_SIGNED,RECORD_CHECKED,RECORD_CANCELLED,RECORD_UNSIGN} = ParttimeRecordConst;

export default class ListedParttime extends Fetchable{
    //PROPS
    //id
    //dataSource

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            error: false,
            id: 0, title: '',
            timestart: '', timeend: '',
            location: '', location_str: '',
            deadline: '',
            detail: '',
            img_count: 0,
            cancelled: false,
            currentsigners: 0, limited: 0,
            creator_uid: 0, created_at: '',
            status: ParttimeConst.PARTTIME_ENDED,
            record: {status: ParttimeRecordConst.RECORD_UNSIGN}
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.dataSource) {
            ParttimeRequest.parttimes.info(
                this.props.id,
                (obj) => {
                    obj.isLoading = false;
                    obj.error = false;
                    this.setState(obj);
                },
                (reason) => {
                    this.setState({
                        isLoading: false,
                        error: true
                    })
                }
            );
        }else {
            const data = this.props.dataSource;
            data.isLoading = false;
            data.error = false;
            this.setState(data);
        }
    }

    render(){
        const jsonOne = this.state, STATUS = jsonOne.status, RECORD_STATUS = jsonOne.record.status;
        const ActionButtonProps = {
            disabled: STATUS !== PARTTIME_SIGNING || RECORD_STATUS === RECORD_CANCELLED,
            type: (STATUS === PARTTIME_SIGNING ? 'primary' :
                (RECORD_STATUS === RECORD_CHECKED ? 'success' : 'default')),
            title:
                RECORD_STATUS === RECORD_UNSIGN ? '报名' :
                    (RECORD_STATUS === RECORD_CANCELLED ? '已取消报名' :
                        (RECORD_STATUS === RECORD_CHECKED ? "已签到" : '取消报名'))
        };
        return (
            <List.Item key={jsonOne.id}>
                <Card size={"small"}
                      title={<Row className={'pointer'} type={'flex'} justify={'start'} align={'middle'}><h2 className={'nomargin'}>{jsonOne.title}</h2><StatusBadge status={jsonOne.status} /></Row>}
                      extra={<Button {...ActionButtonProps}>{ActionButtonProps.title}</Button>}
                >
                    <Row gutter={[8,8]} type={'flex'} justify={'space-around'} style={{marginBottom: 2}}>
                        {generateListedParttimeImages(jsonOne.id, jsonOne.img_count)}
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
            </List.Item>
        );
    }
}

export function generateListedParttimeImages(parttimeId, imgCount) {
    let elements = [];
    for (let i = 0; i < imgCount; i++) {
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
}