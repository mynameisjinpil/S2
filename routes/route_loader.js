/**
 * Created by user on 2017-05-25.
 */

var route_loader = {}

var config = require('../config/config');

route_loader.init = function(app, router){
    console.log("[[called]] router >> init()");
    return initRoutes(app, router);
}

function initRoutes(app, router) {
    var infoLen = config.route_info.length;
    console.log("[[push]] num of routing module: %d", infoLen);

    for (var i = 0; i < infoLen; i++) {
        var curItem = config.route_info[i];
        var curModule = require(curItem.file);

        if (curItem.type == 'get') {
            router.route(curItem.path).get(curModule[curItem.method]);
        } else if (curItem.type == 'post') {
            router.route(curItem.path).post(curModule[curItem.method]);
        } else {
            router.route(curItem.path).post(curModule[curItem.method]);
        }

        console.log('[[push]] routing module [%s] was set', curItem.method);
    }

    app.use('/', router);
}

module.exports = route_loader;