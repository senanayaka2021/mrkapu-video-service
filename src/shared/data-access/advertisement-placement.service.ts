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
exports.AdvertisementPlacementService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const advertisement_entity_1 = require("../../advertisements/advertisement.entity");
const user_entity_1 = require("../../user/user.entity");
const wall_entity_1 = require("../../wall/wall.entity");
let AdvertisementPlacementService = class AdvertisementPlacementService {
    constructor(advertisementModel, userModel, wallPostModel) {
        this.advertisementModel = advertisementModel;
        this.userModel = userModel;
        this.wallPostModel = wallPostModel;
    }
    normalizeString(value) {
        return (value ?? '').trim();
    }
    normalizeStringList(values) {
        return Array.from(new Set((values || [])
            .map((value) => this.normalizeString(value).toLowerCase())
            .filter((value) => value.length > 0)));
    }
    viewerLocationTokens(user) {
        const tokens = new Set();
        const rawValues = [user.location, user.city, user.province, 'sri lanka'];
        for (const raw of rawValues) {
            const normalized = this.normalizeString(raw).toLowerCase();
            if (!normalized) {
                continue;
            }
            tokens.add(normalized);
            normalized
                .split(/[,\-]/)
                .map((part) => part.trim())
                .filter((part) => part.length > 0)
                .forEach((part) => tokens.add(part));
        }
        return tokens;
    }
    matchesLocationList(viewerTokens, targets) {
        const normalizedTargets = this.normalizeStringList(targets);
        if (!normalizedTargets.length) {
            return true;
        }
        return normalizedTargets.some((target) => {
            for (const token of viewerTokens) {
                if (token.includes(target) || target.includes(token)) {
                    return true;
                }
            }
            return false;
        });
    }
    matchesViewerLocation(campaign, viewer) {
        const targeting = (campaign.targeting || {});
        const viewerTokens = this.viewerLocationTokens(viewer);
        const country = this.normalizeString(targeting.country).toLowerCase();
        if (country.length > 0 && country !== 'sri lanka') {
            if (!this.matchesLocationList(viewerTokens, [country])) {
                return false;
            }
        }
        if (!this.matchesLocationList(viewerTokens, targeting.provinces)) {
            return false;
        }
        if (!this.matchesLocationList(viewerTokens, targeting.cities)) {
            return false;
        }
        if (!this.matchesLocationList(viewerTokens, targeting.locationKeywords)) {
            return false;
        }
        return true;
    }
    async resolveSponsoredPostForViewer(viewerId, excludedPostIds = []) {
        if (!(0, mongoose_2.isValidObjectId)(viewerId)) {
            return null;
        }
        const viewer = await this.userModel.findById(viewerId).lean().exec();
        if (!viewer) {
            return null;
        }
        const now = new Date();
        const campaigns = await this.advertisementModel
            .find({
            ownerUserId: { $ne: viewerId },
            postId: { $nin: excludedPostIds },
            status: 'active',
            paymentStatus: 'paid',
            $or: [{ startAt: null }, { startAt: { $lte: now } }],
        })
            .sort({ activatedAt: -1, createdAt: -1 })
            .limit(30)
            .lean()
            .exec();
        for (const campaign of campaigns) {
            const deliveredCount = Number(campaign.deliveredCount || 0);
            const targetAudienceCount = Number(campaign.targetAudienceCount || 0);
            const servedUserIds = Array.isArray(campaign.servedUserIds)
                ? campaign.servedUserIds
                : [];
            if (campaign.endAt && new Date(campaign.endAt) < now) {
                continue;
            }
            if (deliveredCount >= targetAudienceCount) {
                continue;
            }
            if (servedUserIds.includes(viewerId)) {
                continue;
            }
            if (!this.matchesViewerLocation(campaign, viewer)) {
                continue;
            }
            const updated = await this.advertisementModel
                .findOneAndUpdate({ _id: campaign._id, servedUserIds: { $ne: viewerId } }, {
                $addToSet: { servedUserIds: viewerId },
                $inc: { deliveredCount: 1 },
                $set: { lastServedAt: now },
            }, { new: true })
                .lean()
                .exec();
            if (!updated) {
                continue;
            }
            if (Number(updated.deliveredCount || 0) >=
                Number(updated.targetAudienceCount || 0)) {
                await this.advertisementModel.updateOne({ _id: updated._id }, { $set: { status: 'completed' } });
            }
            const post = await this.wallPostModel.findById(updated.postId).lean().exec();
            if (!post) {
                continue;
            }
            return { campaign: updated, post };
        }
        return null;
    }
};
exports.AdvertisementPlacementService = AdvertisementPlacementService;
exports.AdvertisementPlacementService = AdvertisementPlacementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(advertisement_entity_1.AdvertisementCampaign.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(wall_entity_1.WallPost.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdvertisementPlacementService);
export {};
