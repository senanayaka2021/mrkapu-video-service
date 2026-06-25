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
exports.WallEngagementService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto_1 = require("crypto");
const db_models_1 = require("../db-models");
const user_account_service_1 = require("./user-account.service");
const event_publisher_service_1 = require("../events/event-publisher.service");
const domain_events_1 = require("../contracts/domain-events");
let WallEngagementService = class WallEngagementService {
    constructor(wallPostModel, wallViewEventModel, userAccountService, eventPublisher) {
        this.wallPostModel = wallPostModel;
        this.wallViewEventModel = wallViewEventModel;
        this.userAccountService = userAccountService;
        this.eventPublisher = eventPublisher;
    }
    normalizeTag(raw) {
        if (!raw)
            return null;
        const trimmed = raw.trim().replace(/^#+/, '').toLowerCase();
        if (!trimmed)
            return null;
        if (!/^[a-z0-9_]{1,50}$/.test(trimmed))
            return null;
        return trimmed;
    }
    normalizeTags(tags) {
        if (!tags?.length)
            return [];
        return Array.from(new Set(tags
            .map((tag) => this.normalizeTag(tag))
            .filter((tag) => Boolean(tag))));
    }
    extractHashtags(caption) {
        if (!caption?.trim())
            return [];
        const matches = caption.match(/#[A-Za-z0-9_]{1,50}/g) || [];
        return this.normalizeTags(matches.map((tag) => tag.slice(1)));
    }
    resolvePostTags(caption, explicitTags) {
        return Array.from(new Set([
            ...this.extractHashtags(caption),
            ...this.normalizeTags(explicitTags),
        ]));
    }
    normalizeLegacyComments(post) {
        if (!post.comments?.length)
            return;
        for (const comment of post.comments) {
            if (!comment.commentId) {
                comment.commentId = (0, crypto_1.randomUUID)();
            }
            comment.reactions = comment.reactions || [];
            comment.updatedAt = comment.updatedAt || comment.createdAt || new Date();
        }
    }
    normalizeImageEngagement(post) {
        const imageUrls = post.imageUrls || [];
        post.imageEngagement = (post.imageEngagement || [])
            .filter((item) => Number.isInteger(item.imageIndex) &&
            item.imageIndex >= 0 &&
            item.imageIndex < imageUrls.length)
            .map((item) => {
            item.imageUrl = imageUrls[item.imageIndex];
            item.reactions = item.reactions || [];
            item.comments = item.comments || [];
            item.updatedAt = item.updatedAt || new Date();
            for (const comment of item.comments) {
                if (!comment.commentId) {
                    comment.commentId = (0, crypto_1.randomUUID)();
                }
                comment.reactions = comment.reactions || [];
                comment.updatedAt =
                    comment.updatedAt || comment.createdAt || new Date();
            }
            return item;
        });
    }
    getImageEngagement(post, imageIndex) {
        const imageUrls = post.imageUrls || [];
        if (imageIndex < 0 || imageIndex >= imageUrls.length) {
            throw new common_1.BadRequestException('Invalid image index');
        }
        post.imageEngagement = post.imageEngagement || [];
        let imageEngagement = post.imageEngagement.find((item) => item.imageIndex === imageIndex);
        if (!imageEngagement) {
            imageEngagement = {
                imageIndex,
                imageUrl: imageUrls[imageIndex],
                reactions: [],
                comments: [],
                updatedAt: new Date(),
            };
            post.imageEngagement.push(imageEngagement);
        }
        imageEngagement.imageUrl = imageUrls[imageIndex];
        imageEngagement.reactions = imageEngagement.reactions || [];
        imageEngagement.comments = imageEngagement.comments || [];
        imageEngagement.updatedAt = new Date();
        return imageEngagement;
    }
    async createPost(actorId, dto) {
        if (!dto.caption &&
            !(dto.imageUrls && dto.imageUrls.length) &&
            !dto.imageUrl) {
            throw new common_1.BadRequestException('Post must have a caption or an image.');
        }
        const imageUrls = (dto.imageUrls && dto.imageUrls.length ? dto.imageUrls : []);
        if (!imageUrls.length && dto.imageUrl) {
            imageUrls.push(dto.imageUrl);
        }
        const post = await this.wallPostModel.create({
            userId: actorId,
            authorName: dto.authorName,
            authorAvatar: dto.authorAvatar,
            caption: dto.caption,
            imageUrl: dto.imageUrl,
            imageUrls,
            tags: this.resolvePostTags(dto.caption, dto.tags),
            layoutStyle: dto.layoutStyle || 'classic',
            reactions: [],
            comments: [],
            imageEngagement: imageUrls.map((imageUrl, imageIndex) => ({
                imageIndex,
                imageUrl,
                reactions: [],
                comments: [],
                updatedAt: new Date(),
            })),
            viewedBy: [],
            viewsCount: 0,
        });
        const points = Number(process.env.WALL_POST_POINTS || 5);
        if (actorId && (0, mongoose_2.isValidObjectId)(actorId)) {
            await this.userAccountService.incrementPoints(actorId, points);
        }
        await this.eventPublisher.publish((0, domain_events_1.createDomainEvent)(domain_events_1.DOMAIN_EVENT_TYPES.wallPostCreated, {
            postId: post._id.toString(),
        }));
        return {
            post: post.toObject(),
            pointsAwarded: points,
        };
    }
    async reactToPost(postId, actorId, dto) {
        if (!(0, mongoose_2.isValidObjectId)(postId)) {
            throw new common_1.BadRequestException('Invalid post id');
        }
        const post = await this.wallPostModel.findById(postId);
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (typeof dto.imageIndex === 'number') {
            const imageEngagement = this.getImageEngagement(post, dto.imageIndex);
            const existing = imageEngagement.reactions?.find((reaction) => reaction.userId === actorId);
            if (existing) {
                if (existing.type === dto.type) {
                    imageEngagement.reactions = imageEngagement.reactions?.filter((reaction) => reaction.userId !== actorId);
                }
                else {
                    existing.type = dto.type;
                    existing.createdAt = new Date();
                }
            }
            else {
                imageEngagement.reactions = imageEngagement.reactions || [];
                imageEngagement.reactions.push({
                    userId: actorId,
                    type: dto.type,
                    createdAt: new Date(),
                });
            }
            imageEngagement.updatedAt = new Date();
            this.normalizeLegacyComments(post);
            this.normalizeImageEngagement(post);
            await post.save();
            return post.toObject();
        }
        const existing = post.reactions?.find((reaction) => reaction.userId === actorId);
        if (existing) {
            if (existing.type === dto.type) {
                post.reactions = post.reactions?.filter((reaction) => reaction.userId !== actorId);
            }
            else {
                existing.type = dto.type;
                existing.createdAt = new Date();
            }
        }
        else {
            post.reactions = post.reactions || [];
            post.reactions.push({
                userId: actorId,
                type: dto.type,
                createdAt: new Date(),
            });
        }
        this.normalizeLegacyComments(post);
        this.normalizeImageEngagement(post);
        await post.save();
        return post.toObject();
    }
    async addComment(postId, actorId, dto) {
        if (!(0, mongoose_2.isValidObjectId)(postId)) {
            throw new common_1.BadRequestException('Invalid post id');
        }
        const post = await this.wallPostModel.findById(postId);
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (typeof dto.imageIndex === 'number') {
            const imageEngagement = this.getImageEngagement(post, dto.imageIndex);
            imageEngagement.comments = imageEngagement.comments || [];
            imageEngagement.comments.push({
                commentId: (0, crypto_1.randomUUID)(),
                userId: actorId,
                authorName: dto.authorName,
                authorAvatar: dto.authorAvatar,
                text: dto.text,
                reactions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            imageEngagement.updatedAt = new Date();
            this.normalizeLegacyComments(post);
            this.normalizeImageEngagement(post);
            await post.save();
            return post.toObject();
        }
        post.comments = post.comments || [];
        post.comments.push({
            commentId: (0, crypto_1.randomUUID)(),
            userId: actorId,
            authorName: dto.authorName,
            authorAvatar: dto.authorAvatar,
            text: dto.text,
            reactions: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        this.normalizeLegacyComments(post);
        this.normalizeImageEngagement(post);
        await post.save();
        return post.toObject();
    }
    async reactToComment(postId, commentId, actorId, dto) {
        if (!(0, mongoose_2.isValidObjectId)(postId)) {
            throw new common_1.BadRequestException('Invalid post id');
        }
        const post = await this.wallPostModel.findById(postId);
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        const comment = post.comments?.find((item) => item.commentId === commentId);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        const existing = comment.reactions?.find((reaction) => reaction.userId === actorId);
        if (existing) {
            if (existing.type === dto.type) {
                comment.reactions = comment.reactions?.filter((reaction) => reaction.userId !== actorId);
            }
            else {
                existing.type = dto.type;
                existing.createdAt = new Date();
            }
        }
        else {
            comment.reactions = comment.reactions || [];
            comment.reactions.push({
                userId: actorId,
                type: dto.type,
                createdAt: new Date(),
            });
        }
        comment.updatedAt = new Date();
        this.normalizeLegacyComments(post);
        this.normalizeImageEngagement(post);
        await post.save();
        return post.toObject();
    }
    async markPostsViewed(actorId, postIds, dwellMsByPostId = {}) {
        const sanitizedPostIds = Array.from(new Set(postIds
            .map((id) => (typeof id === 'string' ? id.trim() : ''))
            .filter((id) => id.length > 0 && (0, mongoose_2.isValidObjectId)(id))));
        if (!sanitizedPostIds.length) {
            return { counts: {} };
        }
        const counts = {};
        await Promise.all(sanitizedPostIds.map(async (postId) => {
            const updatedPost = await this.wallPostModel
                .findOneAndUpdate({ _id: postId }, [
                {
                    $set: {
                        viewedBy: {
                            $setUnion: [{ $ifNull: ['$viewedBy', []] }, [actorId]],
                        },
                    },
                },
                {
                    $set: {
                        viewsCount: { $size: '$viewedBy' },
                    },
                },
            ], {
                new: true,
                projection: { _id: 1, viewsCount: 1, userId: 1, tags: 1 },
            })
                .lean()
                .exec();
            if (updatedPost?._id) {
                counts[updatedPost._id.toString()] = Number(updatedPost.viewsCount || 0);
                const normalizedDwellMs = Math.max(0, Math.min(Number(dwellMsByPostId[postId] || 0) || 0, 300000));
                await this.wallViewEventModel
                    .findOneAndUpdate({ viewerId: actorId, postId }, {
                    $set: {
                        authorId: String(updatedPost.userId || ''),
                        tags: Array.isArray(updatedPost.tags)
                            ? updatedPost.tags
                            : [],
                        lastViewedAt: new Date(),
                    },
                    $inc: {
                        totalDwellMs: normalizedDwellMs,
                        viewsCount: 1,
                    },
                }, {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                })
                    .exec();
            }
        }));
        return { counts };
    }
};
exports.WallEngagementService = WallEngagementService;
exports.WallEngagementService = WallEngagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(db_models_1.WallPost.name)),
    __param(1, (0, mongoose_1.InjectModel)(db_models_1.WallViewEvent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        user_account_service_1.UserAccountService,
        event_publisher_service_1.EventPublisherService])
], WallEngagementService);
export {};
