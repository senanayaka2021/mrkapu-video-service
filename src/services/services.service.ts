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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const services_data_1 = require("./services.data");
const custom_service_entity_1 = require("./custom-service.entity");
const short_video_entity_1 = require("./short-video.entity");
const s3_service_1 = require("../common/s3.service");
const user_account_service_1 = require("../shared/data-access/user-account.service");
const actor_auth_service_1 = require("../shared/auth/actor-auth.service");
const event_publisher_service_1 = require("../shared/events/event-publisher.service");
const domain_events_1 = require("../shared/contracts/domain-events");
let ServicesService = class ServicesService {
    constructor(customServiceModel, s3Service, userAccountService, actorAuthService, eventPublisher) {
        this.customServiceModel = customServiceModel;
        this.s3Service = s3Service;
        this.userAccountService = userAccountService;
        this.actorAuthService = actorAuthService;
        this.eventPublisher = eventPublisher;
    }
    getActorIdFromAuth(authorization) {
        return this.actorAuthService.getActorIdFromAuth(authorization);
    }
    listCategories() {
        return Object.entries(services_data_1.serviceCatalog).map(([key, value]) => ({
            key,
            label: value.label,
            count: value.items.length,
        }));
    }
    async listShortVideos() {
        const fallback = [
            {
                id: 'kapu-s3-sample-a',
                creatorHandle: '@mrkapu',
                creatorInitials: 'MK',
                caption: 'Sample short video (S3) - A',
                description: 'Uploaded to S3 bucket for testing the short video player.',
                videoUrl: 'https://kapu-general.s3.ap-southeast-1.amazonaws.com/services/manual/a.mp4',
                likes: '0',
                comments: '0',
                shares: '0',
                tags: ['sample', 's3', 'shortvideo'],
            },
            {
                id: 'kapu-s3-sample-b',
                creatorHandle: '@mrkapu',
                creatorInitials: 'MK',
                caption: 'Sample short video (S3) - B',
                description: 'Uploaded to S3 bucket for testing the short video player.',
                videoUrl: 'https://kapu-general.s3.ap-southeast-1.amazonaws.com/services/manual/b.mp4',
                likes: '0',
                comments: '0',
                shares: '0',
                tags: ['sample', 's3', 'shortvideo'],
            },
            {
                id: 'bukit-hall-reveal',
                creatorHandle: '@bukitweddings',
                creatorInitials: 'BW',
                caption: 'Grand hall reveal for a full floral wedding setup',
                description: 'A quick walkthrough of the main wedding hall, stage lights, entrance flowers, and guest seating layout.',
                youtubeVideoId: 'aqz-KE-bpKQ',
                likes: '12.4K',
                comments: '684',
                shares: '201',
                tags: ['weddinghall', 'decor', 'venue'],
            },
            {
                id: 'lotus-bridal-look',
                creatorHandle: '@lotusbridal',
                creatorInitials: 'LB',
                caption: 'Bridal makeup transformation for the homecoming look',
                description: 'Soft glam bridal prep with jewelry setting, final touch-up, and saree styling details.',
                youtubeVideoId: '3JZ_D3ELwOQ',
                likes: '8.9K',
                comments: '421',
                shares: '119',
                tags: ['bridalmakeup', 'homecoming', 'beauty'],
            },
            {
                id: 'serene-arch-setup',
                creatorHandle: '@serenearch',
                creatorInitials: 'SA',
                caption: 'Poruwa and floral backdrop setup in 20 seconds',
                description: 'Fresh flower arch, aisle styling, and stage layering for a pastel ceremony concept.',
                videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
                likes: '10.7K',
                comments: '512',
                shares: '143',
                tags: ['poruwa', 'flowers', 'setup'],
            },
            {
                id: 'royal-ride-arrival',
                creatorHandle: '@royalride.lk',
                creatorInitials: 'RR',
                caption: 'Bride arrival convoy with decorated wedding vehicles',
                description: 'Preview of the bridal car, family van, and evening guest shuttle package.',
                youtubeVideoId: 'M7lc1UVf-VE',
                likes: '6.5K',
                comments: '228',
                shares: '74',
                tags: ['transport', 'arrival', 'weddingcars'],
            },
            {
                id: 'blue-haven-suite',
                creatorHandle: '@bluehavenhoneymoons',
                creatorInitials: 'BH',
                caption: 'Honeymoon suite preview with romantic dinner setup',
                description: 'Room decor, balcony views, breakfast service, and a quick look at the private dinner package.',
                videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-20s.mp4',
                likes: '9.1K',
                comments: '307',
                shares: '95',
                tags: ['honeymoon', 'suite', 'travel'],
            },
        ];

        try {
            const model = this.customServiceModel.db.model(short_video_entity_1.ShortVideo.name);
            const rows = await model
                .find({})
                .sort({ createdAt: -1 })
                .limit(80)
                .lean()
                .exec();
            const items = (Array.isArray(rows) ? rows : []).map((row) => ({
                id: String(row._id || row.id || ''),
                creatorHandle: String(row.creatorHandle || '@member'),
                creatorInitials: String(row.creatorInitials || 'ME'),
                caption: String(row.caption || ''),
                description: String(row.description || ''),
                videoUrl: row.videoUrl ? String(row.videoUrl) : undefined,
                youtubeVideoId: row.youtubeVideoId ? String(row.youtubeVideoId) : undefined,
                likes: `${Number(row.likesCount || 0)}`,
                comments: `${Number(row.commentsCount || 0)}`,
                shares: `${Number(row.sharesCount || 0)}`,
                tags: Array.isArray(row.tags) ? row.tags.map((tag) => String(tag)) : [],
            }));
            if (!items.length) {
                return fallback;
            }
            return [...items, ...fallback];
        }
        catch (_a) {
            return fallback;
        }
    }
    getCategory(key) {
        const category = services_data_1.serviceCatalog[key];
        if (!category) {
            throw new common_1.NotFoundException('Service category not found');
        }
        return {
            key,
            label: category.label,
            items: category.items,
        };
    }
    getItem(key, slug) {
        const category = services_data_1.serviceCatalog[key];
        if (!category) {
            throw new common_1.NotFoundException('Service category not found');
        }
        const item = category.items.find((entry) => entry.slug === slug);
        if (!item) {
            throw new common_1.NotFoundException('Service item not found');
        }
        return {
            key,
            item,
        };
    }
    async listCustomServices() {
        const items = await this.customServiceModel
            .find({ isActive: true })
            .sort({ createdAt: -1, _id: -1 })
            .lean()
            .exec();
        return items.map((item) => this.mapCustomService(item));
    }
    async listBookmarkedServices(actorId) {
        const actor = await this.userAccountService.findById(actorId);
        if (!actor) {
            throw new common_1.NotFoundException('User not found');
        }
        const bookmarkedIds = Array.from(new Set((actor.bookmarkedServiceIds || []).filter(Boolean)));
        if (!bookmarkedIds.length) {
            return { bookmarkedServiceIds: [], items: [] };
        }
        const items = await this.customServiceModel
            .find({ _id: { $in: bookmarkedIds }, isActive: true })
            .lean()
            .exec();
        const mappedById = new Map(items.map((item) => [item._id?.toString(), this.mapCustomService(item)]));
        return {
            bookmarkedServiceIds: bookmarkedIds,
            items: bookmarkedIds
                .map((id) => mappedById.get(id))
                .filter((item) => item != null),
        };
    }
    async listCustomServicesByOwner(actorId) {
        const items = await this.customServiceModel
            .find({ isActive: true, ownerUserId: actorId })
            .sort({ createdAt: -1, _id: -1 })
            .lean()
            .exec();
        return items.map((item) => this.mapCustomService(item));
    }
    mapCustomService(item) {
        return {
            id: item._id?.toString(),
            ownerUserId: item.ownerUserId,
            categoryLabel: item.categoryLabel,
            name: item.name,
            district: item.district,
            town: item.town,
            location: `${item.town}, ${item.district}`,
            description: item.description,
            mediaUrls: item.mediaUrls || [],
            amenities: item.amenities || [],
            customFields: item.customFields || {},
            offerings: (item.offerings || []).map((entry) => ({
                title: entry?.title || '',
                subtitle: entry?.subtitle || '',
                includedItems: Array.isArray(entry?.includedItems)
                    ? entry.includedItems
                    : [],
                mediaUrls: Array.isArray(entry?.mediaUrls) ? entry.mediaUrls : [],
            })),
            packages: (item.packages || []).map((entry) => ({
                title: entry?.title || '',
                description: entry?.description || '',
                includedItems: Array.isArray(entry?.includedItems)
                    ? entry.includedItems
                    : [],
            })),
            coverImageUrl: item.coverImageUrl ||
                (item.mediaUrls && item.mediaUrls.length ? item.mediaUrls[0] : ''),
            pricePerDay: item.pricePerDay || 0,
            rating: item.rating || 0,
            createdAt: item.createdAt,
        };
    }
    async bookmarkService(actorId, serviceId) {
        const service = await this.customServiceModel
            .findOne({ _id: serviceId, isActive: true })
            .lean()
            .exec();
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        const bookmarkedServiceIds = await this.userAccountService.addBookmarkedService(actorId, serviceId);
        if (!bookmarkedServiceIds) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            serviceId,
            isBookmarked: true,
            bookmarkedServiceIds,
        };
    }
    async removeBookmarkService(actorId, serviceId) {
        const bookmarkedServiceIds = await this.userAccountService.removeBookmarkedService(actorId, serviceId);
        if (!bookmarkedServiceIds) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            serviceId,
            isBookmarked: false,
            bookmarkedServiceIds,
        };
    }
    async createPresignedUpload(actorId, dto) {
        const safeName = (dto.fileName || 'service-media').replace(/[^a-zA-Z0-9._-]/g, '_');
        const key = `services/${actorId}/${Date.now()}-${safeName}`;
        return this.s3Service.createPresignedUpload(key, dto.contentType || 'application/octet-stream');
    }
    async createCustomService(actorId, dto) {
        if (!dto.categoryLabel?.trim() ||
            !dto.name?.trim() ||
            !dto.district?.trim() ||
            !dto.town?.trim() ||
            !dto.description?.trim()) {
            throw new common_1.BadRequestException('categoryLabel, name, district, town, and description are required');
        }
        const owner = await this.userAccountService.findById(actorId);
        if (!owner) {
            throw new common_1.NotFoundException('User not found');
        }
        const mediaUrls = (dto.mediaUrls || [])
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
        const amenities = (dto.amenities || [])
            .map((item) => (item || '').toString().trim())
            .filter((item) => item.length > 0);
        const customFields = Object.fromEntries(Object.entries(dto.customFields || {}).map(([key, value]) => [
            key.trim(),
            (value || '').toString().trim(),
        ]));
        const offerings = (dto.offerings || [])
            .map((entry) => ({
            title: (entry?.title || '').toString().trim(),
            subtitle: (entry?.subtitle || '').toString().trim(),
            includedItems: Array.isArray(entry?.includedItems)
                ? entry.includedItems
                    .map((item) => (item || '').toString().trim())
                    .filter((item) => item.length > 0)
                : [],
            mediaUrls: Array.isArray(entry?.mediaUrls)
                ? entry.mediaUrls
                    .map((item) => (item || '').toString().trim())
                    .filter((item) => item.length > 0)
                : [],
        }))
            .filter((entry) => entry.title.length > 0);
        const packages = (dto.packages || [])
            .map((entry) => ({
            title: (entry?.title || '').toString().trim(),
            description: (entry?.description || '').toString().trim(),
            includedItems: Array.isArray(entry?.includedItems)
                ? entry.includedItems
                    .map((item) => (item || '').toString().trim())
                    .filter((item) => item.length > 0)
                : [],
        }))
            .filter((entry) => entry.title.length > 0);
        const created = await this.customServiceModel.create({
            ownerUserId: actorId,
            categoryLabel: dto.categoryLabel.trim(),
            name: dto.name.trim(),
            district: dto.district.trim(),
            town: dto.town.trim(),
            description: dto.description.trim(),
            mediaUrls,
            amenities,
            customFields,
            offerings,
            packages,
            coverImageUrl: mediaUrls.length ? mediaUrls[0] : undefined,
            pricePerDay: 0,
            rating: 0,
            isActive: true,
        });
        await this.eventPublisher.publish((0, domain_events_1.createDomainEvent)(domain_events_1.DOMAIN_EVENT_TYPES.serviceCatalogUpdated, {
            serviceId: created._id.toString(),
        }));
        return {
            service: {
                id: created._id.toString(),
                ownerUserId: created.ownerUserId,
                categoryLabel: created.categoryLabel,
                name: created.name,
                district: created.district,
                town: created.town,
                location: `${created.town}, ${created.district}`,
                description: created.description,
                mediaUrls: created.mediaUrls || [],
                amenities: created.amenities || [],
                customFields: created.customFields || {},
                offerings: created.offerings || [],
                packages: created.packages || [],
                coverImageUrl: created.coverImageUrl ||
                    (created.mediaUrls && created.mediaUrls.length
                        ? created.mediaUrls[0]
                        : ''),
                pricePerDay: created.pricePerDay || 0,
                rating: created.rating || 0,
                createdAt: created.createdAt,
            },
        };
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(custom_service_entity_1.CustomService.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        s3_service_1.S3Service,
        user_account_service_1.UserAccountService,
        actor_auth_service_1.ActorAuthService,
        event_publisher_service_1.EventPublisherService])
], ServicesService);
export {};
