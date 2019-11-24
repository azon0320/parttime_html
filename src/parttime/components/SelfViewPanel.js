import React from 'react';

export default class SelfViewPanel extends React.Component{
    mounted = false;

    componentDidMount() {
        this.mounted = true;
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    doGetSelfViewResult(){
        if (this.mounted) return;
        this.setState({isLoading: true});
        fetch('api/user/self', {method: 'post'}).then(value => value.json())
            .then(jsonObj => {
                if (this.mounted) this.onSelfDataReceive(jsonObj)
            }).catch()
    }

    onSelfDataReceive(jsonORundefined){

    }

    //PROPS
    //token
    //enableRefresh : bool
    //enableLogout : bool
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            phone: '',
            uid: '',
            credit: 500,
            nickname: '',
            parttimes: []
        }
    }

    render() {
        //TODO
    }
}