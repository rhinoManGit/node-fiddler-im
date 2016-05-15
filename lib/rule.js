// 处理fiddler规则


var loopRules = function(next) {
    return function(url) {
        return function(conf) {
            return function(index) {
                if (!index) index = 0;
                if (index > conf.rules.length - 1) return next(); // 结束遍历
                return matchRegExp(function() {
                    index++;
                    return loopRules(next)(url)(conf)(index);
                })(url)(conf.rules[index]);
            }
        }
    }
};

var matchRegExp = function(next) {
    return function(url) {
        return function(rule) {
            var regHead = 'regex:(?isx)';
            console.log(rule, 1);
            if (rule.match.indexOf(regHead) === 0 && new RegExp(rule.match.substr(regHead.length)).test(url)) {
                // 命中正则，去找actions
                return matchActions(next)(rule)(url);
            } else {
                return next();
            }
        }
    }
};

var matchActions = function(next) {
    return function(rule) {
        return function(url) {
            return '';
        }
    }
};

var actionIgnore = function(next) {
    return function(rule){
        if (rule.action.indexOf('[Ignore]') !== 0)  return next();
        // nothing.
    }
};



loopRules(function() {
    console.log('done');
})('xxx.com')({
    rules: [{
        match: 'test1',
        action: 'test action1'
    }, {
        match: 'regex:(?isx)',
        action: 'test action2'
    }, {
        match: 'test3',
        action: 'test action3'
    }]
})();


module.exports = function(conf, req, res, next) {
    var host = req.getHeader('host');
    var protocal = req.protocal || 'http://';
    var url = protocal + host + req.path;
    if (url.indexOf(regHead) === 0) {
        return regexRule(url, conf, req, res, next);
    }
    return stringRule(url, conf, req, res, next);
};