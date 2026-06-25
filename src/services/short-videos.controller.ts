// @ts-nocheck
import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShortVideoDto } from './dto/create-short-video.dto';
import { UpdateShortVideoDto } from './dto/update-short-video.dto';
import { ShortVideo, ShortVideoDocument } from './short-video.entity';

// These shared modules are authored in CommonJS-style source files, so TypeScript
// cannot reliably import their named exports as types. We use runtime injection.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const actorAuth = require('../shared/auth/actor-auth.service');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const userAccounts = require('../shared/data-access/user-account.service');

@Controller('services')
export class ShortVideosController {
  constructor(
    @Inject(actorAuth.ActorAuthService)
    private readonly actorAuthService: any,
    @Inject(userAccounts.UserAccountService)
    private readonly userAccountService: any,
    @InjectModel(ShortVideo.name)
    private readonly shortVideoModel: Model<ShortVideoDocument>,
  ) {}

  private toResponse(row: any) {
    return {
      id: String(row?._id || row?.id || ''),
      creatorHandle: row?.creatorHandle,
      creatorInitials: row?.creatorInitials,
      caption: row?.caption,
      description: row?.description || '',
      videoUrl: row?.videoUrl,
      youtubeVideoId: row?.youtubeVideoId,
      likes: `${Number(row?.likesCount || 0)}`,
      comments: `${Number(row?.commentsCount || 0)}`,
      shares: `${Number(row?.sharesCount || 0)}`,
      tags: Array.isArray(row?.tags) ? row.tags : [],
    };
  }

  @Post('short-videos')
  async createShortVideo(
    @Headers('authorization') authorization: string,
    @Body() dto: CreateShortVideoDto,
  ) {
    const actorId = this.actorAuthService.getActorIdFromAuth(authorization);
    const caption = (dto.caption || '').toString().trim();
    const description = (dto.description || '').toString().trim();
    const videoUrl = (dto.videoUrl || '').toString().trim();
    const youtubeVideoId = (dto.youtubeVideoId || '').toString().trim();

    if (!caption) {
      throw new BadRequestException('caption is required');
    }

    if (!videoUrl && !youtubeVideoId) {
      throw new BadRequestException('videoUrl or youtubeVideoId is required');
    }

    const actor = await this.userAccountService.findById(actorId);
    const firstName = (actor?.firstName || '').toString().trim();
    const lastName = (actor?.lastName || '').toString().trim();
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
    const creatorHandle = fullName
      ? `@${fullName.toLowerCase().replace(/\s+/g, '')}`
      : `@member${actorId.slice(-4)}`;
    const creatorInitials = [
      firstName.length > 0 ? firstName[0] : '',
      lastName.length > 0 ? lastName[0] : '',
    ]
      .join('')
      .toUpperCase()
      .trim();

    const tags: string[] = [];
    const rawTags = Array.isArray(dto.tags) ? dto.tags : [];
    for (const tag of rawTags) {
      const value = (tag || '').toString().trim();
      if (!value) continue;
      tags.push(value.replaceAll('#', ''));
      if (tags.length >= 12) break;
    }

    const created = await this.shortVideoModel.create({
      creatorUserId: actorId,
      creatorHandle,
      creatorInitials: creatorInitials.length > 0 ? creatorInitials : 'ME',
      caption,
      description,
      videoUrl: videoUrl || undefined,
      youtubeVideoId: youtubeVideoId || undefined,
      tags,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
    });

    return this.toResponse(created);
  }

  @Patch('short-videos/:id')
  async updateShortVideo(
    @Headers('authorization') authorization: string,
    @Param('id') id: string,
    @Body() dto: UpdateShortVideoDto,
  ) {
    const actorId = this.actorAuthService.getActorIdFromAuth(authorization);
    const targetId = (id || '').toString().trim();
    if (!targetId) {
      throw new BadRequestException('id is required');
    }

    const existing = await this.shortVideoModel.findById(targetId).exec();
    if (!existing) {
      throw new NotFoundException('Short video not found');
    }

    if (String(existing.creatorUserId || '') !== String(actorId)) {
      throw new NotFoundException('Short video not found');
    }

    const nextCaption =
      dto.caption != null ? dto.caption.toString().trim() : undefined;
    const nextDescription =
      dto.description != null ? dto.description.toString().trim() : undefined;
    const nextVideoUrl =
      dto.videoUrl != null ? dto.videoUrl.toString().trim() : undefined;
    const nextYoutubeVideoId =
      dto.youtubeVideoId != null
        ? dto.youtubeVideoId.toString().trim()
        : undefined;

    if (nextCaption != null && nextCaption.length === 0) {
      throw new BadRequestException('caption cannot be empty');
    }

    if (nextVideoUrl != null && nextVideoUrl.length === 0) {
      existing.videoUrl = undefined;
    } else if (nextVideoUrl != null) {
      existing.videoUrl = nextVideoUrl;
    }

    if (nextYoutubeVideoId != null && nextYoutubeVideoId.length === 0) {
      existing.youtubeVideoId = undefined;
    } else if (nextYoutubeVideoId != null) {
      existing.youtubeVideoId = nextYoutubeVideoId;
    }

    if (!existing.videoUrl && !existing.youtubeVideoId) {
      throw new BadRequestException('videoUrl or youtubeVideoId is required');
    }

    if (nextCaption != null) existing.caption = nextCaption;
    if (nextDescription != null) existing.description = nextDescription;

    if (dto.tags != null) {
      const tags: string[] = [];
      const rawTags = Array.isArray(dto.tags) ? dto.tags : [];
      for (const tag of rawTags) {
        const value = (tag || '').toString().trim();
        if (!value) continue;
        tags.push(value.replaceAll('#', ''));
        if (tags.length >= 12) break;
      }
      existing.tags = tags;
    }

    const saved = await existing.save();
    return this.toResponse(saved);
  }
}
