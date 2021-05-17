import { Toast } from 'vant';
class Utils {
    validForm(o){
        for(let key in o){
            if(!o[key].reg.test(o[key].value)){
                Toast({
                    message: o[key].errorMsg,
                    duration: 3000,
                    forbidClick: true
                });
                return false;
            }
        }
        return true;
    }
}

export const utils = new Utils();