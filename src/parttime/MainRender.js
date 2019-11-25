import React from 'react';
import ParttimeView from "./ParttimeView";
import ParttimeUserView from './ParttimeUserView';

import Layout from 'antd/lib/layout';

import {Button} from "antd";

import 'antd/dist/antd.css';

const {Header, Footer, Content} = Layout;

const VIEWS = {
    hello : 'hello_view',
    parttimes : 'parttimes_view',
    user : 'user_view',
};

export default class MainRender extends React.Component{
    views = new Map();
    constructor(props){
        super(props);
        this.state = {
            defaultView: VIEWS.hello,
            currentView: VIEWS.hello,
        };
        this.loadView.bind(this);
        this.renderView.bind(this);
    }

    loadView(viewName){
        let view = this.views.get(viewName);
        if (view != null) return;
        switch (viewName) {
            case VIEWS.hello:view = (<div><h1 style={{textAlign: 'center'}}>欢迎使用Parttimes活动平台</h1></div>);break;
            case VIEWS.parttimes: view = <ParttimeView />;break;
            case VIEWS.user: view = <ParttimeUserView />;break;
            default:break;
        }
        if (view != null) this.views.set(viewName, view);
    }

    renderView(viewName){
        return this.views.get(viewName);
    }

    componentDidMount() {
        this.loadView(this.state.defaultView);
    }

    render() {
        this.loadView(this.state.currentView);
        return (
            <div>
                <Header style={{backgroundColor: 'rgba(137,150,255,0.56)', textAlign: "center"}}>
                    <Button.Group size={"large"}>
                        <Button onClick={()=>this.setState({currentView: VIEWS.hello})}>欢迎使用</Button>
                        <Button onClick={()=>this.setState({currentView: VIEWS.parttimes})}>活动列表</Button>
                        <Button onClick={()=>this.setState({currentView: VIEWS.user})}>个人信息</Button>
                    </Button.Group>
                </Header>
                <Content style={{marginBottom: 32}}>
                    {this.renderView(this.state.currentView)}
                </Content>
                <Footer style={{textAlign: "center"}}>
                    <h4 style={{fontWeight: "lighter"}}>设计: dormao<span style={{marginLeft: 16}}>工具: Ant Design</span></h4>
                    <h4 style={{fontWeight: "lighter"}}>2019 Dormao Network</h4>
                </Footer>
            </div>
        );
    }
}
