import React from 'react';
import BigTitle from "./components/BigTitle";
import SelfViewPanel from "./components/SelfViewPanel";
import AuthPanel from "./components/AuthPanel";

class ParttimeUserView extends React.Component{

    constructor(props){
        super(props);
        this.state = {token: '123'}
    };

    checkLogin(){
        return this.state.token !== '';
    }


    //登录
    onLogin(token){
        if (this.checkLogin()){
            //TODO 已登录
        }else {
            //TODO 处理登录
            this.setState({token : token});
        }
    }

    render() {
        return (<div>
            <BigTitle title={'个人信息'} />
            {this.checkLogin() ?
                (<SelfViewPanel
                    token={this.state.token}
                    enableRefresh={true}
                    enableLogout={true}
                />) :
                (<AuthPanel
                    loginTarget={'api/user/login'}
                    registerTarget={'api/user/register'}
                    onResult={(acitonType='loginORregister', code200, resultData) => {
                        if (code200 && resultData.succ){
                            const TOKEN = resultData.token;
                            this.onLogin(TOKEN);
                        }
                    }}
                />)
            }
        </div>);
    }
}

export default ParttimeUserView;