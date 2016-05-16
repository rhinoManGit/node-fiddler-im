/*
处理fiddler规则

支持配置如下：

{
    projects:[
        {
            rules:[
                {
                    macch:'regex:(?isx)ke\.qq\.com\/cgi-bin',
                    action:'[Ignore]  //Ignore rules on this match'
                }
            ]
        }
    ]
}

 */

var fs = require('fs');
var path = require('path');

var getMimeTypes = require('./mimetypes');

var isFile = function(filePath) {
    return fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory();
};
var isFolder = function(filePath) {
    return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
};
// 获取文件扩展名
var getExt = function(filePath) {
    var ext = '';
    if (filePath) {
        var arrs = filePath.match(/\.([\w]{1,4})$/);
        if (arrs && arrs.length > 1) ext = arrs[1];
    }
    return ext;
};

// 直接发送文件~~~
var sendFile = function(req, res) {
    return function(filePath) {
        fs.readFile(filePath, function(err, data) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': getMimeTypes(getExt(req.pathname))
            });
            res.end(data);
        });
    };
};

/**
 * 匹配rules。处理完毕后，会为req对象增加一个matchFile属性，用于查找目录下的文件。
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var matchRule = function(req, res, next) {
    return function(rules) {
        return function(index) {
            if (!index) index = 0;
            if (index > rules.length - 1) return next();
            var rule = rules[index];
            var url = req.url;
            req.matchFile = '';

            // 先处理正则
            var regHead = 'regex:(?isx)';
            if (rule.match.indexOf(regHead) === 0 && new RegExp(rule.match.substr(regHead.length)).test(url)) {
                // 命中正则，去找actions
                // 不会再命中其他规则。如果需要支持继续命中其他规则，则需要改写此处。
                return matchActions(req, res, next)(rule);
            }

            // 其他规则
            var pos = req.url.indexOf(rule.match);
            if (pos > -1) {
                req.matchFile = req.url.substr(pos);
                return matchActions(req, res, next)(rule);
            }

            return matchRule(req, res, next)(rules)(++index);
        };
    };
};


// 匹配各种action~
var matchActions = function(req, res, next) {
    return function(rule) {
        // 忽略该请求，直接转发
        if (rule.action.indexOf('[Ignore]') === 0) {
            return next();
        }

        // 单文件
        if (isFile(rule.action)) return sendFile(req, res)(rule.action);

        // 目录
        if (isFolder(rule.action)) {
            var filePath = path.join(rule.action, req.matchFile);
            return sendFile(req, res)(filePath);
        }

        // 没有命中action。默认为忽略。
        return next();
    };
};


module.exports = function(req, res, next) {
    req.config.projects = req.config.projects || [];
    var project, rule, rules = [];
    req.config.projects.forEach(function(project) {
        project = project || {};
        rules = rules.concat(project.rules || []);
    });
    return matchRule(req, res, next)(rules)(0);
};