var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请输入指定端口。如：\nnode server.js 8888')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    /******** main start ************/

    console.log('有小可爱访问服务器。路径（带查询参数）为：' + pathWithQuery)

    if (path === '/index.html') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(fs.readFileSync(`./public/index.html`))
        response.end()
    } else if (path === '/qq.js') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.write(fs.readFileSync('./public/qq.js'))
        response.end()
    } else if (path === '/friends.json') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/json;charset=utf-8')
        console.log(request.headers['referer'])
        response.setHeader('Access-Control-Allow-Origin','http://frank.com:9999')
        response.write(fs.readFileSync('./public/friends.json'))
        response.end()
    } else if(path==='/friends.js'){
        if(request.headers['referer'].indexOf("http://frank.com:9999")===0){
            response.statusCode = 200
            // console.log(query.functionName);
            response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
            const string = `window['{{xxx}}'] ( {{data}} )`
            const data = fs.readFileSync('./public/friends.json').toString()
            const string2 = string.replace("{{data}}",data).replace('{{xxx}}',query.callback)
            /* 把{{xxx}}变成查询的query.functionName */
             /* replace替换--把data变量的内容替换到{{data}}对象里面 */
            response.write(string2)  //然后吧新的字符串写到文件里面
            response.end()
        }else {
            response.statusCode= 404;
            response.end()
        }
    }else{
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`你输入的路径有错误哦~`)
        response.end()
    }

    /******** main end ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功！请输入下列地址访问\nhttp://localhost:' + port)
