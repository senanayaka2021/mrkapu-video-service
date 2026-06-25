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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3Service = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.bucket = this.configService.get('AWS_S3_BUCKET') || '';
        this.region = this.configService.get('AWS_REGION') || 'ap-south-1';
        this.publicBaseUrl = this.configService.get('AWS_S3_PUBLIC_URL') || undefined;
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const credentials = accessKeyId && secretAccessKey
            ? { accessKeyId, secretAccessKey }
            : undefined;
        this.client = new client_s3_1.S3Client({
            region: this.region,
            credentials,
        });
    }
    getBucket() {
        if (!this.bucket) {
            throw new Error('AWS_S3_BUCKET is not configured');
        }
        return this.bucket;
    }
    getPublicUrl(key) {
        if (this.publicBaseUrl) {
            return `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`;
        }
        return `https://${this.getBucket()}.s3.${this.region}.amazonaws.com/${key}`;
    }
    async createPresignedUpload(key, contentType, expiresInSeconds = 900) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.getBucket(),
            Key: key,
            ContentType: contentType,
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, {
            expiresIn: expiresInSeconds,
        });
        return {
            uploadUrl,
            key,
            fileUrl: this.getPublicUrl(key),
            expiresIn: expiresInSeconds,
        };
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
export {};
