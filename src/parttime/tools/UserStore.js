import {save,load,remove} from 'react-cookies';

export const UserStore = {
    token : ''
};

export function saveCookies(){
    if (UserStore.token !== '') save('ptoken', UserStore.token);
}

export function clearCookies(){
    remove('ptoken');
}

export function loadFromCookie(){
    UserStore.token = ParttimeCookie.read('ptoken');
}

export const ParttimeCookie = {
    read : function(key, defaultValue){
        const value = load(key);
        return typeof value === "undefined" ? defaultValue : value;
    }
};