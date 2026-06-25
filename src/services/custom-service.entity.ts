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
exports.CustomServiceSchema = exports.CustomService = exports.CustomServicePackage = exports.CustomServiceOffering = void 0;
const mongoose_1 = require("@nestjs/mongoose");
class CustomServiceOffering {
}
exports.CustomServiceOffering = CustomServiceOffering;
class CustomServicePackage {
}
exports.CustomServicePackage = CustomServicePackage;
let CustomService = class CustomService {
};
exports.CustomService = CustomService;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], CustomService.prototype, "ownerUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], CustomService.prototype, "categoryLabel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomService.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], CustomService.prototype, "district", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomService.prototype, "town", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomService.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], CustomService.prototype, "mediaUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: String, default: {} }),
    __metadata("design:type", Object)
], CustomService.prototype, "customFields", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], CustomService.prototype, "amenities", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], CustomService.prototype, "offerings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], CustomService.prototype, "packages", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CustomService.prototype, "coverImageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CustomService.prototype, "pricePerDay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CustomService.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], CustomService.prototype, "isActive", void 0);
exports.CustomService = CustomService = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CustomService);
exports.CustomServiceSchema = mongoose_1.SchemaFactory.createForClass(CustomService);
export {};
