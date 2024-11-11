import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Profile } from "../schemas/profile.schema";
import { User } from "../schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async createUser({ profile, ...dto }: CreateUserDto) {
    if (profile) {
      const newProfile = new this.profileModel(profile);
      const savedNewProfile = await newProfile.save();
      const newUser = new this.userModel({
        ...CreateUserDto,
        profile: savedNewProfile._id,
      });
      return newUser.save();
    }
    const newUser = new this.userModel(dto);
    return newUser.save();
  }

  getUsers() {
    return this.userModel.find();
  }

  getUserById(id: string) {
    return this.userModel.findById(id).populate("profile");
  }

  updateUser(id: string, dto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, dto, { new: true });
  }
}
