import React from 'react';
import BigTitle from "./components/BigTitle";
import SelfViewPanel from "./components/SelfViewPanel";
import AuthPanel from "./components/AuthPanel";
import {UserStore, saveCookies, clearCookies} from "./tools/UserStore";

import {save, load, remove} from 'react-cookies';

class ParttimeUserView extends React.Component{

    constructor(props){
        super(props);
        const token = load('ptoken');
        UserStore.token = typeof token === 'undefined' ? '' : token;
        this.state = {
            token: UserStore.token
        };
        this.onLogin.bind(this);
        this.setState.bind(this);
    };

    checkLogin(){
        return this.state.token !== '';
    }


    //登录
    onLogin(type, code200, json){
        UserStore.token = json.token;
        saveCookies();
        this.setState({token : UserStore.token});
    }

    onLogout(){
        remove('ptoken');
        UserStore.token = '';
        clearCookies();
        this.setState({token : UserStore.token});
    }

    render() {
        return (<div>
            <BigTitle
                title={'个人信息'}
            />
            {this.checkLogin() ?
                (<SelfViewPanel
                    token={this.state.token}
                    enableRefresh={true}
                    onLogout={this.onLogout.bind(this)}
                />) :
                (<AuthPanel onResult={this.onLogin.bind(this)}/>)
            }
        </div>);
    }
}

export default ParttimeUserView;