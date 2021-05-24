const CHANGE_ACCOUNT = 'CHANGE_ACCOUNT';
const CHANGE_TOKEN = 'CHANGE_TOKEN';
const CHANGE_SKUID = 'CHANGE_SKUID';
const CHANGE_QRCODEURL = 'CHANGE_QRCODEURL';

import { addCookie } from "@/utils/cookie";

export default {

    [CHANGE_ACCOUNT](state, account = '') {
        if (account) {
            state._account = account;
        } else {
            state._account = '';
        }
    },
    [CHANGE_TOKEN](state, token = '') {
        if (token) {
            state._token = token;
        } else {
            state._token = '';
        }
    },
    [CHANGE_SKUID](state, skuId = '') {
        if (skuId) {
            state._skuId = skuId;
        } else {
            state._skuId = '';
        }
    },
    [CHANGE_QRCODEURL](state, url = '') {
        if (url) {
            state._QRcodeUrl = url;
        } else {
            state._QRcodeUrl = '';
        }
    }
}