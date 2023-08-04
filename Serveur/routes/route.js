const KoaRouter = require('koa-combine-routers');
const routerData = require('./data_route');

const koaRouter = new KoaRouter(
routerData,
);

module.exports = koaRouter