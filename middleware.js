var cacheMiddlewares = [];

var applyMiddle = function(middleware) {
    if(Array.isArray(middleware)){
        cacheMiddlewares = cacheMiddlewares.concat(middleware);
    } else {
        cacheMiddlewares.push(middleware);
    }
};

var useMiddleware = function(req, res, next) {
    return function(index) {
        if (!index) index = 0;
        if (index > cacheMiddlewares.length - 1) return next(); // 结束
        return cacheMiddlewares[index](req, res, function() {
            index++;
            return useMiddleware(req, res, next)(index);
        });
    }
};

var use = function(req, res, next) {
    return useMiddleware(req, res, next)();
};

module.exports = {
    apply: applyMiddle,
    use: use
};