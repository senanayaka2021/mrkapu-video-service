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
exports.UserAccountService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../../user/user.entity");
const domain_events_1 = require("../contracts/domain-events");
const event_publisher_service_1 = require("../events/event-publisher.service");
let UserAccountService = class UserAccountService {
    constructor(userModel, eventPublisher) {
        this.userModel = userModel;
        this.eventPublisher = eventPublisher;
    }
    async create(data) {
        const user = new this.userModel(data);
        const saved = await user.save();
        await this.eventPublisher.publish((0, domain_events_1.createDomainEvent)(domain_events_1.DOMAIN_EVENT_TYPES.userProfileUpdated, {
            userId: saved._id.toString(),
        }));
        return saved;
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async findByIds(ids, select) {
        const validIds = Array.from(new Set(ids.filter((id) => typeof id === 'string' && (0, mongoose_2.isValidObjectId)(id))));
        if (!validIds.length) {
            return [];
        }
        const query = this.userModel.find({ _id: { $in: validIds } });
        if (select?.trim()) {
            query.select(select);
        }
        return query.lean().exec();
    }
    async findManyByIds(ids, select) {
        return this.findByIds(ids, select);
    }
    async updateById(id, data) {
        const updated = await this.userModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
        if (updated) {
            await this.eventPublisher.publish((0, domain_events_1.createDomainEvent)(domain_events_1.DOMAIN_EVENT_TYPES.userProfileUpdated, {
                userId: updated._id.toString(),
            }));
        }
        return updated;
    }
    async incrementPoints(id, delta) {
        return this.userModel
            .findByIdAndUpdate(id, { $inc: { points: delta } }, { new: true })
            .exec();
    }
    async setRole(id, role) {
        return this.updateById(id, { role });
    }
    async addBookmarkedService(actorId, serviceId) {
        const actor = await this.userModel.findById(actorId).exec();
        if (!actor) {
            return null;
        }
        actor.bookmarkedServiceIds = Array.isArray(actor.bookmarkedServiceIds)
            ? actor.bookmarkedServiceIds
            : [];
        if (!actor.bookmarkedServiceIds.includes(serviceId)) {
            actor.bookmarkedServiceIds.push(serviceId);
        }
        actor.bookmarkedServiceIds = Array.from(new Set(actor.bookmarkedServiceIds));
        await actor.save();
        return actor.bookmarkedServiceIds;
    }
    async removeBookmarkedService(actorId, serviceId) {
        const actor = await this.userModel.findById(actorId).exec();
        if (!actor) {
            return null;
        }
        actor.bookmarkedServiceIds = (actor.bookmarkedServiceIds || []).filter((id) => id !== serviceId);
        await actor.save();
        return actor.bookmarkedServiceIds;
    }
    async followUser(actorId, targetUserId) {
        if (actorId === targetUserId) {
            return { isFollowing: false, followersCount: 0, followingCount: 0 };
        }
        const actor = await this.userModel.findById(actorId).exec();
        const target = await this.userModel.findById(targetUserId).exec();
        if (!actor || !target) {
            return null;
        }
        actor.followingIds = Array.isArray(actor.followingIds)
            ? actor.followingIds
            : [];
        target.followerIds = Array.isArray(target.followerIds)
            ? target.followerIds
            : [];
        if (!actor.followingIds.includes(targetUserId)) {
            actor.followingIds.push(targetUserId);
        }
        if (!target.followerIds.includes(actorId)) {
            target.followerIds.push(actorId);
        }
        actor.followingIds = Array.from(new Set(actor.followingIds));
        target.followerIds = Array.from(new Set(target.followerIds));
        actor.followingCount = actor.followingIds.length;
        target.followersCount = target.followerIds.length;
        await Promise.all([actor.save(), target.save()]);
        await Promise.all([
            this.eventPublisher.publish((0, domain_events_1.createDomainEvent)(domain_events_1.DOMAIN_EVENT_TYPES.userProfileUpdated, {
                userId: actorId,
            })),
            this.eventPublisher.publish((0, domain_events_1.createDomainEvent)(domain_events_1.DOMAIN_EVENT_TYPES.userProfileUpdated, {
                userId: targetUserId,
            })),
        ]);
        return {
            isFollowing: true,
            followersCount: target.followersCount,
            followingCount: actor.followingCount,
        };
    }
};
exports.UserAccountService = UserAccountService;
exports.UserAccountService = UserAccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        event_publisher_service_1.EventPublisherService])
], UserAccountService);
export {};
