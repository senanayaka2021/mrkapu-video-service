// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedWallEngagementModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const db_models_1 = require("../db-models");
const shared_events_module_1 = require("../events/shared-events.module");
const shared_user_account_module_1 = require("./shared-user-account.module");
const wall_engagement_service_1 = require("./wall-engagement.service");
let SharedWallEngagementModule = class SharedWallEngagementModule {
};
exports.SharedWallEngagementModule = SharedWallEngagementModule;
exports.SharedWallEngagementModule = SharedWallEngagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: db_models_1.WallPost.name, schema: db_models_1.WallPostSchema },
                { name: db_models_1.WallViewEvent.name, schema: db_models_1.WallViewEventSchema },
            ]),
            shared_user_account_module_1.SharedUserAccountModule,
            shared_events_module_1.SharedEventsModule,
        ],
        providers: [wall_engagement_service_1.WallEngagementService],
        exports: [wall_engagement_service_1.WallEngagementService],
    })
], SharedWallEngagementModule);
export {};
