let common = {
    all:{
        methods: {
            action_checkIp(ip){
                var rep = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                if(!rep.test(ip)){
                    return false;
                }else{
                    return true;
                }
            }
        }
    }
};
export default common;