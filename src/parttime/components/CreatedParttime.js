import {Card, Descriptions, List} from "antd";
import BigTitle from "./BigTitle";
import Fetchable from "../tools/Fetchable";
import {ParttimeRequest} from "../tools/ParttimeRequest";
import React from "react";
import StatusBadge from "./StatusBadge";
import ListedParttime from "./ListedParttime";

export default class CreatedParttime extends ListedParttime{
    //PROPS
    //id
    //dataSource

    render() {
        const json = this.state;
        return json.error ? null : (
            <List.Item key={this.props.id}>
                <Card size={"small"} loading={json.isLoading}>
                    <BigTitle fontSize={'1.3em'} title={json.title} disableMargin />
                    <Descriptions size={"small"} style={{marginLeft: 16, marginRight: 16}} layout={"horizontal"} column={{sm: 2, xs: 1}}>
                        <Descriptions.Item label={'开始时间'}>{json.timestart}</Descriptions.Item>
                        <Descriptions.Item label={'结束时间'}>{json.timeend}</Descriptions.Item>
                        <Descriptions.Item label={'报名人数'}>{json.currentsigners}{json.limited===0?'':'/'+json.limited}</Descriptions.Item>
                        <Descriptions.Item label={'活动状态'}><StatusBadge disableMargin status={json.status} /></Descriptions.Item>
                    </Descriptions>
                </Card>
            </List.Item>
        );
    }
}