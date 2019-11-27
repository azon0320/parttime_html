import React from 'react';
import {Button, Input, Tabs, Form, Checkbox} from "antd";
import Fetchable from "../tools/Fetchable";
import {ParttimeRequest} from "../tools/ParttimeRequest";

const AuthOperation = {
    LOGIN_WITH_CODE : 'with_code',
    LOGIN_WITH_PASSWD : 'with_passwd',
    REGISTER_WITH_CODE : 'register'
};

const DataResultType  = {
    TYPE_LOGIN : 'login',
    TYPE_REGISTER : 'register',
    TYPE_ERROR : 0,
};

export default class AuthPanel extends Fetchable{
    //PROPS
    //onResult(actionType : <'login', 'register'> , code200 : bool , resultData : obj)

    timerId = -1;

    constructor(props){
        super(props);
        this.state = {
            fetching: false,
            currentTab: AuthOperation.LOGIN_WITH_CODE,
            phone: '',
            password: '',
            code: '',
            accept_license: false,
            error_string : '',
            code_cooldown : 0,
            //TODO
            accepted_code : '',
        };
        this.setState.bind(this);
        this.doSubmit.bind(this);
    }

    doSubmit(operation){
        if (this.state.fetching) return;
        let req = this.state;
        switch (operation) {
            case AuthOperation.LOGIN_WITH_CODE:
                ParttimeRequest.user.loginWithCode(
                    req.phone, req.code,
                        json => this.onDataResult(DataResultType.TYPE_LOGIN, json),
                    reason => this.onDataResult(DataResultType.TYPE_ERROR, reason));
                break;
            case AuthOperation.LOGIN_WITH_PASSWD:
                ParttimeRequest.user.loginWithPassword(
                    req.phone, req.password,
                    json => this.onDataResult(DataResultType.TYPE_LOGIN, json),
                    reason => this.onDataResult(DataResultType.TYPE_ERROR, reason));
                break;
            case AuthOperation.REGISTER_WITH_CODE:
                ParttimeRequest.user.register(
                    req.phone,req.password,req.code,
                    json => this.onDataResult(DataResultType.TYPE_LOGIN, json),
                    reason => this.onDataResult(DataResultType.TYPE_ERROR, reason));
                break;
            default:return;
        }
        this.setState({fetching: true});
    }

    onDataResult(type, json){
        if(!this.mounted) return;
        if (type !== DataResultType.TYPE_ERROR && typeof this.props.onResult === "function"){
            this.props.onResult(type, true, json);
        }else {
            const state = {fetching: false};
            if (type === DataResultType.TYPE_ERROR){
                state.error_string = '用户名或密码错误';
            }
            this.setState(state);
        }
    }

    //TODO DELETE
    doSendCode(){
        const phone = this.state.phone;
        if (phone === '') return;
        ParttimeRequest.code.allocate(phone,
            this.onCodeReceive.bind(this),
            (reason)=>console.log(reason));
        this.setState({
            fetching: true,
            code_cooldown: 60,
        });
        const timerFunc = () => {
            const code_CD = this.state.code_cooldown;
            if (code_CD > 0 && this.mounted) {
                this.timerId = setTimeout(timerFunc.bind(this), 1000);
                 this.setState({code_cooldown : code_CD - 1});
            }else{
                this.timerId = -1;
            }
        };
        this.timerId = setTimeout(timerFunc.bind(this), 1000);
    }

    onCodeReceive(code){
        if(!this.mounted) return;
        this.setState({
            error_string: '',
            accepted_code : code === '0' ? '' : code,
            fetching: false});
    }

    render(){

        const FormItemPassword = (
            <Form.Item label={'密码'}>
                <Input.Password
                    value={this.state.password}
                    onChange={event => this.setState({password: event.target.value})} />
            </Form.Item>
        );
        const FormItemPhone = (
            <Form.Item label={'手机号'}>
                <Input value={this.state.phone} onChange={event => this.setState({phone: event.target.value})}/>
            </Form.Item>
        );
        const FormItemVerifiedCode = (
            <Form.Item label={'验证码'}
                       validateStatus={this.state.error_string !== '' ? 'error' : undefined}
                       help={
                           this.state.error_string !== '' ? this.state.error_string :
                               (!!this.state.accepted_code ? '模拟发送的验证码:' + this.state.accepted_code : '')
                           /* TODO */
                       }
            >
                <Input.Password value={this.state.code} maxLength={4} onChange={event => this.setState({code: event.target.value})} />
                <Button
                    disabled={this.state.fetching || this.state.code_cooldown > 0}
                    onClick={this.doSendCode.bind(this)}>{
                        this.state.code_cooldown > 0 ?
                            '(%)秒后再次发送'.replace('%', this.state.code_cooldown) :
                            '发送验证码'
                }</Button>
            </Form.Item>
        );

        return (<div className={'auth_panel'}>
            <Tabs
                size={"large"} tabBarGutter={8} animated={true}
                activeKey={this.state.currentTab}
                onChange={activeKey => !this.state.fetching && this.setState({currentTab: activeKey})}
            >
                <Tabs.TabPane key={AuthOperation.LOGIN_WITH_CODE} tab={'验证码登录'}>
                    <Form style={{margin: '0 16px'}} labelCol={{offset: 0, span:4}} wrapperCol={{span: 20}}>
                        {FormItemPhone}
                        {FormItemVerifiedCode}
                        <Form.Item wrapperCol={{sm:{offset: 4}}}>
                            <Button size={"large"} type={'primary'} loading={this.state.fetching}
                                    onClick={() => this.doSubmit(AuthOperation.LOGIN_WITH_CODE)}
                            >登录</Button>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
                <Tabs.TabPane key={AuthOperation.LOGIN_WITH_PASSWD} tab={'密码登录'}>
                    <Form style={{margin: '0 16px'}} labelCol={{offset: 0, span:4}} wrapperCol={{span: 20}}>
                        {FormItemPhone}
                        <Form.Item label={'密码'}
                                   validateStatus={this.state.error_string !== '' ? 'error' : undefined}
                                   help={this.state.error_string}
                        >
                            <Input.Password value={this.state.password} onChange={event => this.setState({password: event.target.value})} />
                        </Form.Item>
                        <Form.Item wrapperCol={{sm:{offset: 4}}}>
                            <Button size={"large"} type={'primary'} loading={this.state.fetching}
                                    onClick={() => this.doSubmit(AuthOperation.LOGIN_WITH_PASSWD)}
                            >登录</Button>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
                <Tabs.TabPane key={AuthOperation.REGISTER_WITH_CODE} tab={'注册'}>
                    <Form style={{margin: '0 16px'}} labelCol={{offset: 0, span:4}} wrapperCol={{span: 20}}>
                        {FormItemPhone}
                        {FormItemPassword}
                        {FormItemVerifiedCode}
                        <Form.Item wrapperCol={{sm:{offset: 4}}}>
                            <Checkbox
                                defaultChecked={false} disabled={this.state.fetching}
                                onChange={e => this.setState({accept_license:e.target.checked})}
                            >请阅读Parttimes平台的<a href={"#"}>隐私条款</a></Checkbox>
                        </Form.Item>
                        <Form.Item wrapperCol={{sm:{offset: 4}}}>
                            <Button size={"large"} type={'default'} loading={this.state.fetching}
                                    disabled={!this.state.accept_license}
                                    onClick={() => this.doSubmit(AuthOperation.REGISTER_WITH_CODE)}
                            >注册</Button>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
            </Tabs>
        </div>);
    }
}





