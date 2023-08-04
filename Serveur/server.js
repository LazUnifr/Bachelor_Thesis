const Koa = require('koa');
const KoaJson = require('koa-json');
const bodyParser = require('koa-bodyparser');
//const KoaRouter = require('koa-router');
const routerData = require('./routes/route');
const app = module.exports = new Koa();
const {swaggerSpec,swaggerUi} = require('./doc/doc');
const PORT = 8080 ;
const IP = "192.168.1.139"


app.use(swaggerSpec)
app.use(swaggerUi);
app.use(bodyParser());
app.use(KoaJson());

//router middleware for user route
//app.use(routerUser.routes()).use(routerUser.allowedMethods);
app.use(routerData());


//App port listener
app.listen(PORT,IP,()=>{
    console.log(`Running on port ${PORT}`)
});