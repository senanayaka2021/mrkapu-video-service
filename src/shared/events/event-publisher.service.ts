// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EventPublisherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPublisherService = void 0;
const common_1 = require("@nestjs/common");
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const domain_events_1 = require("../contracts/domain-events");
let EventPublisherService = EventPublisherService_1 = class EventPublisherService {
    constructor() {
        this.logger = new common_1.Logger(EventPublisherService_1.name);
        this.eventBusName = process.env.EVENT_BUS_NAME?.trim() || undefined;
        this.client = new client_eventbridge_1.EventBridgeClient({
            region: process.env.AWS_REGION || 'ap-southeast-1',
        });
    }
    async publish(event) {
        if (!this.eventBusName) {
            this.logger.debug(`Skipping event publish for ${event.type}; EVENT_BUS_NAME is not set`);
            return;
        }
        await this.client.send(new client_eventbridge_1.PutEventsCommand({
            Entries: [
                {
                    EventBusName: this.eventBusName,
                    Source: domain_events_1.DOMAIN_EVENT_SOURCE,
                    DetailType: event.type,
                    Detail: JSON.stringify(event),
                },
            ],
        }));
    }
};
exports.EventPublisherService = EventPublisherService;
exports.EventPublisherService = EventPublisherService = EventPublisherService_1 = __decorate([
    (0, common_1.Injectable)()
], EventPublisherService);
export {};
