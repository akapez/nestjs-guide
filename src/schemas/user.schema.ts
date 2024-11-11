import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Profile } from "./profile.schema";

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: false })
  displayName?: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Profile" })
  profile?: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
