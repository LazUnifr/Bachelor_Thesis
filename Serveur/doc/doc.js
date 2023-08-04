const swaggerJsdoc = require('swagger-jsdoc');
const {koaSwagger} = require('koa2-swagger-ui');
const path = require ('path')
//let spec;

const swaggerDefinition = {
  info: {
    title: 'API SWAGGER DOC',
    version: '1.0.1',
    description: 'API',
  },
  host: '192.168.1.139:8080',
  basePath: '' // Base path (optional)
};

const swaggerOps  = {
  swaggerDefinition,
  openapi: '3.0.0',
  path: "/swagger.json", // where to publish json file (path)
  apis: [path.join(__dirname, '../routes/*.js')], // files containing annotations

};

function specFunc(options){
    // Create the documentation with the given options
    spec = swaggerJsdoc(options);

    // Return a Koa middleware
    return function swaggerDocEndpoint(ctx,nxt){
        /**
         * If the path is the one specified in the options for 
         * accessing the documentation, show it and interrupt the request. 
         * Otherwise, call the next middleware.
         */
        if(ctx.path !== options.path) {
        //console.log(options.path)
        //console.log(ctx.path)
          return nxt()
        }
        ctx.body = spec;
    };
}

const swaggerSpec= specFunc(swaggerOps);

// Build the UI for swagger and expose it on the /doc endpoint
const swaggerUi = koaSwagger({
  routePrefix: '/doc',
  swaggerOptions: {
      url: swaggerOps.path
  }
});

module.exports = {swaggerSpec,swaggerUi}