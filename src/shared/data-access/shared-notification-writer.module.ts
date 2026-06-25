// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedNotificationWriterModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const notification_entity_1 = require("../../notifications/notification.entity");
const notification_writer_service_1 = require("./notification-writer.service");
let SharedNotificationWriterModule = class SharedNotificationWriterModule {
};
exports.SharedNotificationWriterModule = SharedNotificationWriterModule;
exports.SharedNotificationWriterModule = SharedNotificationWriterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: notification_entity_1.Notification.name, schema: notification_entity_1.NotificationSchema },
            ]),
        ],
        providers: [notification_writer_service_1.NotificationWriterService],
        exports: [notification_writer_service_1.NotificationWriterService],
    })
], SharedNotificationWriterModule);
export {};
