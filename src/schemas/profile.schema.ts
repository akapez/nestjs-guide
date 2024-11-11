import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Profile {
  @Prop({ required: false })
  receiveNotification?: boolean;

  @Prop({ required: false })
  receiveEmail?: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
