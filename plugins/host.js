/*

处理host，支持配置如下：

{
    projects:[
        {
            hosts:[
                {
                    ip:'127.0.0.1',
                    domain:'qq.com'
                }
            ]
        }
    ]
}

 */

/**
 * [matchHost description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var matchHost = function(req, res, next) {
    return function(hosts) {
        return function(index) {
            if (!index) index = 0;
            if (index > hosts.length - 1) return next();
            var host = hosts[index];
            if (req.hostname === host.domain) {
                // match host
                req.url = req.protocol + '//' + host.ip + req.path;
            }
            return matchHost(req, res, next)(hosts)(++index);
        };
    };
};



module.exports = function(req, res, next) {
    req.config.projects = req.config.projects || [];
    var project, host, hosts = [];
    req.config.projects.forEach(function(project){
        project = project || {};
        hosts = hosts.concat(project.hosts || []);
    });
    return matchHost(req, res, next)(hosts)(0);
};