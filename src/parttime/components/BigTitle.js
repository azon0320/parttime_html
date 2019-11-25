import React from 'react';
import {Col, Row} from "antd";

class BigTitle extends React.Component{
    //PROPS
    //title : string
    //rightExtras : []
    //fontSize : int(2)
    render(){
        return (
            <div>
                <Row style={{margin: 16}} type={'flex'} justify={'space-between'} align={'middle'}>
                    <Col>
                        <h2 style={typeof this.props.fontSize !== "undefined" ? {fontSize: this.props.fontSize} : {}} className={'large_title'}>{this.props.title}</h2>
                    </Col>
                    {typeof this.props.rightExtras === 'object' ? this.props.rightExtras.map((jsxNode) => (
                        <Col key={'unused'}>{jsxNode}</Col>
                    )) : null}
                </Row>
            </div>
        );
    }
}

export default BigTitle;