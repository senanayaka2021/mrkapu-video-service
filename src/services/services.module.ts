// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const services_controller_1 = require("./services.controller");
const short_videos_controller_1 = require("./short-videos.controller");
const services_service_1 = require("./services.service");
const custom_service_entity_1 = require("./custom-service.entity");
const short_video_entity_1 = require("./short-video.entity");
const s3_service_1 = require("../common/s3.service");
const shared_auth_module_1 = require("../shared/auth/shared-auth.module");
const shared_events_module_1 = require("../shared/events/shared-events.module");
const shared_user_account_module_1 = require("../shared/data-access/shared-user-account.module");
let ServicesModule = class ServicesModule {
};
exports.ServicesModule = ServicesModule;
exports.ServicesModule = ServicesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: custom_service_entity_1.CustomService.name, schema: custom_service_entity_1.CustomServiceSchema },
                { name: short_video_entity_1.ShortVideo.name, schema: short_video_entity_1.ShortVideoSchema },
            ]),
            shared_auth_module_1.SharedAuthModule,
            shared_events_module_1.SharedEventsModule,
            shared_user_account_module_1.SharedUserAccountModule,
        ],
        controllers: [services_controller_1.ServicesController, short_videos_controller_1.ShortVideosController],
        providers: [services_service_1.ServicesService, s3_service_1.S3Service],
    })
], ServicesModule);
export {};
