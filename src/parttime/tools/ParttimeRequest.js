export const ParttimeRequest = {
    parttimes: {
        view : (limit, page, succFunc, catchFunc) => {
            return packTimeout(fetch('/api/parttime/view?limit='+limit+'&page=' + (page),
                {method: 'post'}))
                .then(response => {
                    if (!response.ok) throw new Error("");
                    return response.json();
                })
                .then(obj => succFunc(obj)).catch(reason => catchFunc(reason));
        },
        info : (parttime_id, succFunc, catchFunc) => {
            return packTimeout(fetch('/api/parttime/info/' + (parttime_id),
                {method: 'get'}))
                .then(response => {
                    if (!response.ok) throw new Error("");
                    return response.json();
                })
                .then(obj => succFunc(obj)).catch(reason => catchFunc(reason));
        },
        //TODO create cancel delete sign check unsign
    },
    user : {
        view : (uid, succFunc, catchFunc) => {
            return packTimeout(fetch('/api/user/view?uid=' + (uid),
                {method: 'get'}))
                .then(response => {
                    if (!response.ok) throw new Error("");
                    return response.json();
                }).then(obj => succFunc(obj)).catch(reason => catchFunc(reason));
        },
        self : (token, succFunc, catchFunc) => {
            const Form = new FormData();Form.append('token', token);
            return packTimeout(fetch('/api/user/self',
                {method: 'post', body: Form}))
                .then(response => {
                    if (!response.ok) throw new Error("");
                    return response.json();
                }).then(obj => succFunc(obj)).catch(reason => catchFunc(reason));
        },
        createds : (token, succFunc, catchFunc) => {
            const Form = new FormData();Form.append('token', token);
            return packTimeout(fetch('/api/user/created',
                {method: 'post', body: Form}))
                .then(response => {
                    if (!response.ok) throw new Error("");
                    return response.json();
                }).then(obj => succFunc(obj)).catch(reason => catchFunc(reason));
        },
        signeds : (token, succFunc, catchFunc) => {
            const Form = new FormData();Form.append('token', token);
            return packTimeout(fetch('/api/user/signed',
                {method: 'post', body: Form}))
                .then(response => {
                    if (!response.ok) throw new Error("");
                    return response.json();
                }).then(obj => succFunc(obj)).catch(reason => catchFunc(reason));
        },
        loginWithCode : (phone, code, succFunc, catchFunc) => {
            const Form = new FormData();
            Form.append('phone', phone);Form.append('verified_code', code);
            return packTimeout(fetch('/api/user/login', {
                method: 'post', body: Form}))
                .then(response => {
                    if (!response.ok) throw new Error("");
                    return response.json();
                }).then(obj => succFunc(obj)).catch(reason => catchFunc(reason));
        },
        loginWithPassword : (phone, password, succFunc, catchFunc) => {
            const Form = new FormData();
            //TODO 加密密码
            Form.append('phone', phone);Form.append('password', password);
            return packTimeout(fetch('/api/user/login', {
                method: 'post', body: Form}))
                .then(response => {
                    if (!response.ok) throw new Error("");
                    return response.json();
                }).then(obj => succFunc(obj)).catch(reason => catchFunc(reason));
        },
        register : (phone, password, code, succFunc, catchFunc) => {
            const Form = new FormData();
            Form.append('phone', phone);Form.append('password', password);Form.append('verified_code', code);
            return packTimeout(fetch('/api/user/register', {
                method: 'post', body: Form}))
                .then(response => {
                    if (!response.ok) throw new Error("");
                    return response.json();
                }).then(obj => succFunc(obj)).catch(reason => catchFunc(reason));
        }
        //TODO config register login
    },
    code : {
        allocate : (phone, succFunc, catchFunc) => {
            return packTimeout(fetch('/api/code/allocate?phone=' + (phone), {
                method: 'get'}))
                .then(response => {
                    if (!response.ok) throw new Error("");
                    return response.json();
                }).then(obj => succFunc(obj)).catch(reason => catchFunc(reason));
        }
    }
};

export function packTimeout(fetch, second){
    if (!second) second = 5;
    return Promise.race([
        fetch,
        new Promise((resolve, reject) =>
            setTimeout(()=>reject(new Error('Fetch timeout')), second * 1000)
        )
    ]);
}