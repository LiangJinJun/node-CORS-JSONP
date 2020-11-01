function jsonp(url){
    return new Promise((resolve,reject)=>{
        const random = 'frankJSONPCallbackName'+Math.random()  /* 0到1的小数 */
        console.log(random);
        /* 比如 window[0.1111]=等于一个函数 */
        window[random]=(data)=>{
            // console.log(data)
            resolve(data)  /* 成功了就调用resolve */
        };
        const script = document.createElement('script')
        script.src=`${url}?callback=${random}`
        script.onload=()=> {
            script.remove()
        };
        script.onerror=()=>{
            reject();  /* 失败 */
        }
        document.body.appendChild(script)
    });
}

jsonp('http://qq.com:8888/friends.js')
    .then((data)=>{
        console.log(data);
    })