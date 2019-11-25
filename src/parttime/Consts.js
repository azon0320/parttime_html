
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
