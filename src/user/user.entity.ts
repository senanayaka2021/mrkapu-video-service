import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Keep user ids consistent with `mrkapu-auth-service` by using the same Mongo
// collection (`auth_users`). This is required for shared modules like
// `UserAccountService` to function.
@Schema({ collection: 'auth_users', timestamps: true })
export class User {
  @Prop({ index: true, sparse: true })
  email?: string;

  @Prop()
  providerId?: string;

  @Prop()
  password?: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  avatarUrl?: string;

  @Prop()
  gender?: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  dob?: string;

  @Prop()
  age?: number;

  @Prop()
  job?: string;

  @Prop()
  occupation?: string;

  @Prop()
  location?: string;

  @Prop()
  city?: string;

  @Prop()
  province?: string;

  @Prop()
  religion?: string;

  @Prop()
  caste?: string;

  @Prop()
  education?: string;

  @Prop()
  monthlyIncomeRange?: string;

  @Prop()
  maritalStatus?: string;

  @Prop()
  vehicleType?: string;

  @Prop()
  numberOfVehicles?: number;

  @Prop()
  houseType?: string;

  @Prop()
  skinColor?: string;

  @Prop()
  hairType?: string;

  @Prop({ type: [String], default: [] })
  hobbies?: string[];

  @Prop({ type: [String], default: [] })
  sports?: string[];

  @Prop({ type: [String], default: [] })
  favoritePlaces?: string[];

  @Prop()
  specialThings?: string;

  @Prop({ type: [String], default: [] })
  interests?: string[];

  @Prop({ type: [String], default: [] })
  photos?: string[];

  @Prop({ default: 0 })
  points?: number;

  @Prop({ default: 'user' })
  role?: string;

  @Prop({ default: false })
  profileCompleted?: boolean;

  @Prop({ default: 0 })
  profileCompletion?: number;

  @Prop({ type: [String], default: [] })
  bookmarkedServiceIds?: string[];

  @Prop({ type: [String], default: [] })
  followingIds?: string[];

  @Prop({ default: 0 })
  followingCount?: number;

  @Prop({ type: [String], default: [] })
  followerIds?: string[];

  @Prop({ default: 0 })
  followersCount?: number;

  @Prop({ type: [String], default: [] })
  connectionIds?: string[];

  @Prop({ default: 0 })
  connectionsCount?: number;

  @Prop({ default: true })
  allowConnectionRequests?: boolean;

  @Prop({ default: false })
  verifiedEmail?: boolean;

  @Prop({ default: false })
  verifiedPhoneNumber?: boolean;

  @Prop({ default: false })
  isProfileVerified?: boolean;

  @Prop({ default: false })
  isBot?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

