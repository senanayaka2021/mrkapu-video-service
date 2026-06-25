// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedAdvertisementPlacementModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const advertisement_entity_1 = require("../../advertisements/advertisement.entity");
const user_entity_1 = require("../../user/user.entity");
const wall_entity_1 = require("../../wall/wall.entity");
const advertisement_placement_service_1 = require("./advertisement-placement.service");
let SharedAdvertisementPlacementModule = class SharedAdvertisementPlacementModule {
};
exports.SharedAdvertisementPlacementModule = SharedAdvertisementPlacementModule;
exports.SharedAdvertisementPlacementModule = SharedAdvertisementPlacementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: advertisement_entity_1.AdvertisementCampaign.name, schema: advertisement_entity_1.AdvertisementCampaignSchema },
                { name: user_entity_1.User.name, schema: user_entity_1.UserSchema },
                { name: wall_entity_1.WallPost.name, schema: wall_entity_1.WallPostSchema },
            ]),
        ],
        providers: [advertisement_placement_service_1.AdvertisementPlacementService],
        exports: [advertisement_placement_service_1.AdvertisementPlacementService],
    })
], SharedAdvertisementPlacementModule);
export {};
