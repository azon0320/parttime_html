import React from "react";

import {getParttimeStatusString, getParttimeStatusColorTheme} from '../tools/Consts';
import {Badge} from "antd";

export default class StatusBadge extends React.Component{
    render() {
        const statusString = typeof this.props.status === "number" ? getParttimeStatusString(this.props.status) : this.props.status ;
        const style = {
            background: typeof this.props.background === 'undefined' ?
                getParttimeStatusColorTheme(this.props.status) : this.props.background,
        };
        if (!this.props.disableMargin) style.margin = '0 16px';
        return (<Badge
            count={statusString}
            style={style}
        />);
    }
}