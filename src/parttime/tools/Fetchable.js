import React from "react";

export default class Fetchable extends React.Component{
    mounted = false;
    fetchTask = null;
    componentDidMount() {
        this.mounted = true;
    }
    componentWillUnmount() {
        this.mounted = false;
    }
}