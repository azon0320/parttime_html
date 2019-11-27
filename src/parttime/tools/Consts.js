
export const ParttimeConst = {
    PARTTIME_ENDED : 1,
    PARTTIME_CANCELLED : 2,
    PARTTIME_STARTING : 3,
    PARTTIME_OUTSIGN : 4,
    PARTTIME_SIGNING : 5,
};

export const ParttimeRecordConst = {
    RECORD_UNSIGN : 0,
    RECORD_CANCELLED : 1,
    RECORD_CHECKED : 2,
    RECORD_SIGNED : 3,
};

export function getParttimeStatusString(id){
    switch (id) {
        case ParttimeConst.PARTTIME_ENDED:return '已结束';
        case ParttimeConst.PARTTIME_CANCELLED:return '已取消';
        case ParttimeConst.PARTTIME_OUTSIGN:return '已截止';
        case ParttimeConst.PARTTIME_SIGNING: return '报名中';
        case ParttimeConst.PARTTIME_STARTING: return '进行中';
        default: return '未知';
    }
}

export function getParttimeStatusColorTheme(id){
    switch (id) {
        case ParttimeConst.PARTTIME_ENDED:return '#a5a5a5';
        case ParttimeConst.PARTTIME_CANCELLED:return '#e20007';
        case ParttimeConst.PARTTIME_STARTING:return '#6a94ff';
        case ParttimeConst.PARTTIME_OUTSIGN:return 'rgba(77,198,0,0.51)';
        case ParttimeConst.PARTTIME_SIGNING:return '#4dc600';
        default: return '';
    }
}

export function getParttimeRecordActionString(id){
    switch(id){
        case ParttimeRecordConst.RECORD_UNSIGN: return '报名';
        case ParttimeRecordConst.RECORD_CANCELLED: return '报名已撤回';
        case ParttimeRecordConst.RECORD_CHECKED: return '已签到';
        case ParttimeRecordConst.RECORD_SIGNED: return '签到';
        default: return '未知';
    }
}
