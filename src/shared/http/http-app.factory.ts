// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapHttpApp = bootstrapHttpApp;
const core_1 = require("@nestjs/core");
async function bootstrapHttpApp(moduleRef) {
    const app = await core_1.NestFactory.create(moduleRef);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:4000',
            'http://127.0.0.1:4000',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    return app;
}
export {};
