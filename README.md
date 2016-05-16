node-fiddler-im

### use

```
npm install node-fiddler-im
```


本地配置代理，指向 127.0.0.1:8006。

``` javascript
require('macfiddler').start({
    port: 8006,
    projects:[
        {
            rules:[
                {
                    match:'regex:(?isx)ke\.qq\.com\/cgi-bin',
                    action:'[Ignore] // Ignore'
                },
                {
                    match:'//ke.qq.com/',
                    action:'c:\\test\\'
                }   
            ],
            hosts:[
                {
                    ip:'127.0.0.1',
                    domain:'ke.qq.com'
                }
            ]
        }
    ]
});
```

### 中间件

``` javascript
require('macfiddler').applyMiddleware(function(req,res,next){
    req.setHeader('xxx','xxx');
    return next();
});
```


### 其他

暂时只支持http转发，不支持https

处理流程：

1. 设置本机代理至node服务端口
2. node层的http server构造一个请求对象
3. 过各种中间件
4. 最后的next为默认请求

