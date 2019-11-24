import React from 'react';
import ParttimeView from "./ParttimeView";

//import "antd/lib/layout/style/css";

import Layout from 'antd/lib/layout';

import {Button} from "antd";

const {Header, Footer, Content} = Layout;

export default class MainRender extends React.Component{
    views = new Map();
    constructor(props){
        super(props);
        this.state = {
            defaultView: 'hello_view',
            currentView: 'hello_view',
        };
        this.loadView.bind(this);
        this.renderView.bind(this);
    }

    loadView(viewName){
        let view = this.views.get(viewName);
        if (view != null) return;
        switch (viewName) {
            case 'hello_view':view = (<Layout>Hello View</Layout>);break;
            case 'parttimes_view': view = <ParttimeView />;break;
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
                <Header style={{background: '#f1f1f1'}}>
                    <Button.Group>
                        <Button onClick={()=>this.setState({currentView: 'hello_view'})}>显示HelloView</Button>
                        <Button onClick={()=>this.setState({currentView: 'parttimes_view'})}>显示ParttimeView</Button>
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
