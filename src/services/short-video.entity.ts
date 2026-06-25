import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'short_videos' })
export class ShortVideo {
  @Prop({ required: true, index: true })
  creatorUserId!: string;

  @Prop({ required: true })
  creatorHandle!: string;

  @Prop({ required: true })
  creatorInitials!: string;

  @Prop({ required: true })
  caption!: string;

  @Prop({ default: '' })
  description?: string;

  @Prop()
  videoUrl?: string;

  @Prop()
  youtubeVideoId?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ default: 0 })
  likesCount?: number;

  @Prop({ default: 0 })
  commentsCount?: number;

  @Prop({ default: 0 })
  sharesCount?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type ShortVideoDocument = HydratedDocument<ShortVideo>;

export const ShortVideoSchema = SchemaFactory.createForClass(ShortVideo);

