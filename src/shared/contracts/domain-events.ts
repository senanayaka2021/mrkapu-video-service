// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMAIN_EVENT_TYPES = exports.DOMAIN_EVENT_SOURCE = void 0;
exports.createDomainEvent = createDomainEvent;
exports.DOMAIN_EVENT_SOURCE = 'mrkapu.backend';
exports.DOMAIN_EVENT_TYPES = {
    userProfileUpdated: 'user.profile.updated',
    wallPostCreated: 'wall.post.created',
    wallPostUpdated: 'wall.post.updated',
    wallPostDeleted: 'wall.post.deleted',
    messageCreated: 'message.created',
    venueUpdated: 'venue.updated',
    serviceCatalogUpdated: 'service.catalog.updated',
    advertisementUpdated: 'advertisement.updated',
    botCommandTick: 'bot.command.tick',
    botCommandBootstrap: 'bot.command.bootstrap',
};
function createDomainEvent(type, detail) {
    return {
        version: 1,
        type,
        emittedAt: new Date().toISOString(),
        detail,
    };
}
export {};
