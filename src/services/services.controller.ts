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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesController = void 0;
const common_1 = require("@nestjs/common");
const services_service_1 = require("./services.service");
const create_service_presign_dto_1 = require("./dto/create-service-presign.dto");
const create_custom_service_dto_1 = require("./dto/create-custom-service.dto");
let ServicesController = class ServicesController {
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    listCategories() {
        return this.servicesService.listCategories();
    }
    listCustomServices() {
        return this.servicesService.listCustomServices();
    }
    listBookmarkedServices(authorization) {
        const actorId = this.servicesService.getActorIdFromAuth(authorization);
        return this.servicesService.listBookmarkedServices(actorId);
    }
    bookmarkService(serviceId, authorization) {
        const actorId = this.servicesService.getActorIdFromAuth(authorization);
        return this.servicesService.bookmarkService(actorId, serviceId);
    }
    listShortVideos() {
        return this.servicesService.listShortVideos();
    }
    removeBookmarkService(serviceId, authorization) {
        const actorId = this.servicesService.getActorIdFromAuth(authorization);
        return this.servicesService.removeBookmarkService(actorId, serviceId);
    }
    listMyCustomServices(authorization) {
        const actorId = this.servicesService.getActorIdFromAuth(authorization);
        return this.servicesService.listCustomServicesByOwner(actorId);
    }
    createPresignedUpload(authorization, dto) {
        const actorId = this.servicesService.getActorIdFromAuth(authorization);
        return this.servicesService.createPresignedUpload(actorId, dto);
    }
    createCustomService(authorization, dto) {
        const actorId = this.servicesService.getActorIdFromAuth(authorization);
        return this.servicesService.createCustomService(actorId, dto);
    }
    getCategory(category) {
        return this.servicesService.getCategory(category);
    }
    getItem(category, slug) {
        return this.servicesService.getItem(category, slug);
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "listCategories", null);
__decorate([
    (0, common_1.Get)('custom/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "listCustomServices", null);
__decorate([
    (0, common_1.Get)('bookmarks'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "listBookmarkedServices", null);
__decorate([
    (0, common_1.Post)(':id/bookmark'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "bookmarkService", null);
__decorate([
    (0, common_1.Get)('short-videos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "listShortVideos", null);
__decorate([
    (0, common_1.Delete)(':id/bookmark'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "removeBookmarkService", null);
__decorate([
    (0, common_1.Get)('custom/mine'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "listMyCustomServices", null);
__decorate([
    (0, common_1.Post)('presign'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_service_presign_dto_1.CreateServicePresignDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "createPresignedUpload", null);
__decorate([
    (0, common_1.Post)('custom'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_custom_service_dto_1.CreateCustomServiceDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "createCustomService", null);
__decorate([
    (0, common_1.Get)(':category'),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Get)(':category/:slug'),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "getItem", null);
exports.ServicesController = ServicesController = __decorate([
    (0, common_1.Controller)('services'),
    __metadata("design:paramtypes", [services_service_1.ServicesService])
], ServicesController);
export {};
