const http = require('http');
const Koa = require('koa');
const koaBodyParser = require('koa-bodyparser');
const KoaRouter = require('@ex/koa-router');
const Cors = require('@koa/cors');
const ss = require('@ss');

const swagger = require('swagger-koa');

module.exports = async () => {
    const koa = new Koa();

    let path = __dirname + '/../listenHttp';

    const router = new KoaRouter();
    router.use(Cors());
    router.use(koaBodyParser());

    router.mapping(path + '/routes');
    koa.use(router.routes());

    // koa.use(views('views', { default: 'jade' }));

    console.log(ss.configs.apiServer.apiUrl);
    koa.use(swagger.init({
        apiVersion: '1.0',
        swaggerVersion: '1.0',
        swaggerURL: '/swagger',
        swaggerJSON: '/api-docs.json',
        swaggerUI: './public/swagger/',
        // basePath: `${ss.configs.apiServer.apiUrl}`,
        // basePath: 'http://localhost:43000',
        basePath: `${ss.configs.apiServer.apiUrl}`,
        info: {
            title: 'swagger-koa sample app',
            description: 'Swagger + Koa = {swagger-koa}'
        },
        apis: ['./apps/api-server/listenHttp/routes/config.js']
    }));

    // koa.use(serve(path.join(__dirname, 'public')));

    koa.on('error', (err, ctx) => {
        console.error(err);
    });

    http.createServer(koa.callback()).listen(ss.configs.apiServer.port, () => {
        console.info('Listen API Server OK => ' + 'http:' + ss.configs.apiServer.port);
    });
};