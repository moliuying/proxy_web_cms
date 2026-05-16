<template>
    <div class="login-wrap">
        <div class="ms-login" >
            <div  class="ms-title">测试页面关闭上传时长</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return {
                isOnIOS: null
            }
        },
        mounted(){
//             document.title = "init";
//             function getHiddenProp() {
//                 var prefixes = ['webkit', 'moz', 'ms', 'o'];
//
//                 // if 'hidden' is natively supported just return it
//                 if ('hidden' in document) return 'hidden';
//
//                 // otherwise loop over all the known prefixes until we find one
//                 for (var i = 0; i < prefixes.length; i++) {
//                     if ((prefixes[i] + 'Hidden') in document)
//                         return prefixes[i] + 'Hidden';
//                 }
//
//                 // otherwise it's not supported
//                 return null;
//             }
//             function getVisibilityState() {
//                 var prefixes = ['webkit', 'moz', 'ms', 'o'];
//                 if ('visibilityState' in document) return 'visibilityState';
//                 for (var i = 0; i < prefixes.length; i++) {
//                     if ((prefixes[i] + 'VisibilityState') in document)
//                         return prefixes[i] + 'VisibilityState';
//                 }
//                 // otherwise it's not supported
//                 return null;
//             }
//
//             function isHidden() {
//                 var prop = getHiddenProp();
//                 if (!prop) return false;
//
//                 return document[prop];
//             }
//
// // use the property name to generate the prefixed event name
//             var visProp = getHiddenProp();
//             if (visProp) {
//                 var evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
//                 document.addEventListener(evtname, function () {
//                     console.log(document[getVisibilityState()])
//                     if(document[getVisibilityState()] == 'hidden'){
//                         console.log("页面进入后台")
//                         document.title = "1-用户离开了";
//                     } else{
//                         console.log("页面进入前台")
//                         document.title = "2-用户回来了";
//                     }
//                 },false);
//             }


            // window.addEventListener( 'blur', function() { alert( 'blur' );  document.title = "blur-用户离开了"; } );
            var hidden, visibilityChange
            if (typeof document.hidden !== 'undefined') {
                hidden = 'hidden'
                visibilityChange = 'visibilitychange'
            } else if (typeof document.mozHidden !== 'undefined') {
                hidden = 'mozHidden'
                visibilityChange = 'mozvisibilitychange'
            } else if (typeof document.msHidden !== 'undefined') {
                hidden = 'msHidden'
                visibilityChange = 'msvisibilitychange'
            } else if (typeof document.webkitHidden !== 'undefined') {
                hidden = 'webkitHidden'
                visibilityChange = 'webkitvisibilitychange'
            }
            // console.log("visibilityChange",visibilityChange)
            // window.addEventListener('pagehide',()=>{
            //     document.title = "用户离开了1";
            // })
            // document.addEventListener('pagehide',
            //     (e) => {
            //         document.title = "用户离开了1";
            //     },false)
            // document.addEventListener('hidden',
            //     (e) => {
            //         document.title = "用户离开了1";
            //     },false)

            // // 添加监听器
            // document.addEventListener('pagehide',
            //     (e) => {
            //         document.title = document.hidden ? "用户离开了" : "用户回来了";
            //     },false)
            // document.addEventListener('beforeunload',
            //     (e) => {
            //         document.title = document.hidden ? "用户离开了" : "用户回来了";
            //     },false)
            // document.addEventListener('unload',
            //     (e) => {
            //         document.title = document.hidden ? "用户离开了" : "用户回来了";
            //     },false)
            // 添加监听器
            document.addEventListener(
                visibilityChange,
                (event) => {
                    document.title = document.hidden ? "123-用户离开了" : "321-用户回来了";
                    if (document[hidden]) {
                        this.updateTime()
                    }

                    // Cancel the event as stated by the standard.
                    event.preventDefault();
                    // Chrome requires returnValue to be set.
                    event.returnValue = '';
                },
                false
            )

            // //这个是ios操作系统
            // window.addEventListener('pagehide', function () {
            //     document.title = "1111-用户离开了";
            // });
            // document.addEventListener("beforeunload", function (event) {
            //     document.title = "用户离开了123";
            //     // Cancel the event as stated by the standard.
            //     event.preventDefault();
            //     // Chrome requires returnValue to be set.
            //     event.returnValue = '';
            // });
        },
        methods: {
            updateTime() {
                var blob = new Blob([`room_id=123`], {type : 'application/x-www-form-urlencoded'});
                navigator.sendBeacon('http://114.116.245.61:3000/index/test', blob);
            }
        }
    }
</script>
<style scoped>
</style>
