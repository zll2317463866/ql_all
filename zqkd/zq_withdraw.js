/*
中青看点
赞赏:邀请码 60555415
技术交流群，212796668、681030097
教程地址：http://cxgc.top
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#中青看点提现
15 10 * * * https://github.com/JDWXX/ql_all/blob/master/zqkd/zq_withdraw.js, tag=中青看点提现, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jxcfd.png, enabled=true

================Loon==============
[Script]
cron "15 10 * * *" script-path=https://github.com/JDWXX/ql_all/blob/master/qsk/zq_withdraw.js,tag=中青看点提现

===============Surge=================
中青看点提现 = type=cron,cronexp="15 10 * * *",wake-system=1,timeout=3600,script-path=https://github.com/JDWXX/ql_all/blob/master/qsk/zq_withdraw.js

============小火箭=========
中青看点提现 = type=cron,script-path=https://github.com/JDWXX/ql_all/blob/master/qsk/zq_withdraw.js, cronexpr="15 10 * * *", timeout=3600, enable=true
*/
const $ = new Env("中青看点提现");
const notify = $.isNode() ? require('./sendNotify') : '';
message = ""
let zq_withdraw= $.isNode() ? (process.env.zqWithdraw ? process.env.zqWithdraw : "") : ($.getdata('zqWithdraw') ? $.getdata('zqWithdraw') : "")
let zq_withdrawArr = []
let zq_withdraws = ""
let zq_cash = $.isNode() ? (process.env.zqCash ? process.env.zqCash : "30") : ($.getdata('zqCash') ? $.getdata('zqCash') : "30")
let zq_cookie= $.isNode() ? (process.env.zqkdCookie ? process.env.zqkdCookie : "") : ($.getdata('zqkdCookie') ? $.getdata('zqkdCookie') : "")
let zq_cookieArr = []
let zq_cookies = ""
let nowmoney;


var time1 = Date.parse(new Date()).toString();
time1 = time1.substr(0, 10);
if (zq_withdraw) {
    if (zq_withdraw.indexOf("@") == -1 && zq_withdraw.indexOf("@") == -1) {
        zq_withdrawArr.push(zq_withdraw)
    } else if (zq_withdraw.indexOf("@") > -1) {
        zq_withdraws = zq_withdraw.split("@")
    } else if (process.env.zq_withdraw && process.env.zq_withdraw.indexOf('@') > -1) {
        zq_withdrawArr = process.env.zq_withdraw.split('@');
        console.log(`您选择的是用"@"隔开\n`)
    }
};
Object.keys(zq_withdraws).forEach((item) => {
    if (zq_withdraws[item] && !zq_withdraws[item].startsWith("#")) {
        zq_withdrawArr.push(zq_withdraws[item])
    }
})

if (zq_cookie) {
    if (zq_cookie.indexOf("@") == -1 && zq_cookie.indexOf("@") == -1) {
        zq_cookieArr.push(zq_cookie)
    } else if (zq_cookie.indexOf("@") > -1) {
        zq_cookies = zq_cookie.split("@")
    } else if (process.env.zq_cookie && process.env.zq_cookie.indexOf('@') > -1) {
        zq_cookieArr = process.env.zq_cookie.split('@');
        console.log(`您选择的是用"@"隔开\n`)
    }
} else if($.isNode()){
    var fs = require("fs");
    zq_cookie = fs.readFileSync("zq_cookie.txt", "utf8");
    if (zq_cookie !== `undefined`) {
        zq_cookies = zq_cookie.split("\n");
    } else {
        $.msg($.name, '【提示】进入点击右下角"任务图标"，再跑一次脚本', '不知道说啥好', {
            "open-url": "给您劈个叉吧"
        });
        $.done()
    }
}
Object.keys(zq_cookies).forEach((item) => {
    if (zq_cookies[item] && !zq_cookies[item].startsWith("#")) {
        zq_cookieArr.push(zq_cookies[item])
    }
})

!(async () => {
     if (typeof $request !== "undefined") {
    getbody()
     $.done()
 }else {
         console.log(`共${zq_cookieArr.length}个cookie`)
         for (let k = 0; k < zq_cookieArr.length; k++) {
             $.message = ""
             bodyVal = zq_cookieArr[k].split('&uid=')[0];
             cookie = bodyVal.replace(/zqkey=/, "cookie=")
             cookie_id = cookie.replace(/zqkey_id=/, "cookie_id=")
             zq_cookie1 = cookie_id + '&' + bodyVal
             //待处理cookie
             console.log(`--------第 ${k + 1} 个账号收益查询中--------\n`)
             zq_withdraw1 = zq_withdrawArr[k]
             await today_score(zq_cookie1)


             if ($.message.length != 0) {
                 message += "账号" + (k + 1) + "：  " + $.message + " \n"
             }
             await $.wait(4000);
             console.log("\n\n")
         }


         if (message.length != 0) {
             await notify ? notify.sendNotify("中青看点提现", `${message}\n\n shaolin-kongfu`) :
                 $.msg($.name, "中青看点提现", `${message}\n\n shaolin-kongfu`);
         } else if ($.isNode()) {
             await notify.sendNotify("中青看点提现", `${message}\n\nshaolin-kongfu`);
         }
     }
     })()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())



function withdraw(zq_withdraw1,timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url : 'https://kandian.wkandian.com/v5/wechat/withdraw2.json',
            headers : {
            'request_time': time1,
            'device-platform': 'android' ,
            'app-version': '8.1.2',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': zq_withdraw1.length.toString(),
            'Host': 'kandian.wkandian.com',
            'Connection': 'Keep-Alive',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'okhttp/3.12.2'
            },
            body : zq_withdraw1,}
        $.post(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)
            if (result.error_code == 0) {
               console.log(result)
                console.log(`【自动提现】提现${zq_cash}元成功\n`)
                $.message = `【自动提现】提现${zq_cash}元成功\n`
                //$.msg($.name,$.sub,$.desc)
            } else {
                console.log(result)
            }
            } catch (e) {
            } finally {
                resolve()
            }
            },timeout)
    })
}


function getbody() {
    if ($request.url.match(/\/kandian.wkandian.com\/v5\/wechat\/withdraw2.json/)) {
          bodyVal=$request.body
            console.log(bodyVal)
        if (zq_withdraw) {
            if (zq_withdraw.indexOf(bodyVal) > -1) {
                $.log("此提现请求已存在，本次跳过")
            } else if (zq_withdraw.indexOf(bodyVal) == -1) {
                zq_withdraws = zq_withdraw + "@" + bodyVal;
                $.setdata(zq_withdraws,'zq_withdraw');
                $.log(`${$.name}获取提现: 成功, zq_withdraws: ${bodyVal}`);
                bodys = zq_withdraws.split("@")
                 $.msg($.name, "获取第" + bodys.length + "个提现请求: 成功🎉", ``)
            }
        } else {
            $.setdata($request.body,'zq_withdraw');
            $.log(`${$.name}获取提现: 成功, zq_withdraws: ${bodyVal}`);
            $.msg($.name, `获取第一个提现请求: 成功🎉`, ``)
        }
    }
}


function today_score(zq_cookie1,timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url : 'https://kandian.wkandian.com/wap/user/balance?'+ zq_cookie1,
            headers : {
    'Host': 'kandian.wkandian.com'
},
            }
        $.get(url, async (err, resp, data) => {
            try {

                const result = JSON.parse(data)
                if(result.status == 0){

                    console.log('\n当前金币总数:'+result.user.score)
                    console.log('\n折合人民币总数:'+result.user.money)
                    nowmoney = result.user.money
                    if(nowmoney >= zq_cash){
                        await $.wait(3000);
                        await withdraw(zq_withdraw1)
                    }
                    $.message = `当前金币总数:${result.user.score} \n 折合人民币总数:${result.user.money}元`
                    //$.msg($.name, "", `当前金币总数:${result.user.score} \n 折合人民币总数:${result.user.money}元`);
                }else{
                     console.log(result)
                }
            } catch (e) {
            } finally {
                resolve()
            }
            },timeout)
    })
}

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}


