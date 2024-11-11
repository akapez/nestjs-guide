import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Profile, ProfileSchema } from "../schemas/profile.schema";
import { User, UserSchema } from "../schemas/user.schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
