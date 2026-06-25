// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PhoneMessagingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneMessagingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Twilio = require("twilio");
let PhoneMessagingService = PhoneMessagingService_1 = class PhoneMessagingService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PhoneMessagingService_1.name);
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        this.fromNumber = this.configService.get('TWILIO_PHONE_NUMBER');
        if (accountSid && authToken) {
            this.client = Twilio(accountSid, authToken);
        }
    }
    async sendVerificationCode(toNumber, code) {
        const normalizedPhone = toNumber.trim();
        if (!normalizedPhone) {
            throw new Error('Phone number is required');
        }
        const message = `Your MrKapu verification code is ${code}. It expires in 10 minutes.`;
        if (!this.client || !this.fromNumber) {
            this.logger.warn(`SMS provider is not configured. Verification code for ${normalizedPhone}: ${code}`);
            return;
        }
        await this.client.messages.create({
            from: this.fromNumber,
            to: normalizedPhone,
            body: message,
        });
    }
};
exports.PhoneMessagingService = PhoneMessagingService;
exports.PhoneMessagingService = PhoneMessagingService = PhoneMessagingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PhoneMessagingService);
export {};
