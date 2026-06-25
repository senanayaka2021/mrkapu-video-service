import { ArrayMaxSize, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateShortVideoDto {
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  youtubeVideoId?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  tags?: string[];
}
