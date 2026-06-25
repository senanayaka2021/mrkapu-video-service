// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpLambdaHandler = createHttpLambdaHandler;
const serverless_express_1 = require("@vendia/serverless-express");
const http_app_factory_1 = require("./http-app.factory");
function createHttpLambdaHandler(moduleRef) {
    let cachedServer = null;
    return async (event, context) => {
        if (!cachedServer) {
            const app = await (0, http_app_factory_1.bootstrapHttpApp)(moduleRef);
            await app.init();
            cachedServer = (0, serverless_express_1.configure)({
                app: app.getHttpAdapter().getInstance(),
            });
        }
        return cachedServer(event, context);
    };
}
export {};
