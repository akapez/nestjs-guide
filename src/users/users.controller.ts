import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import mongoose from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException("User not found", 404);
    const findUser = await this.usersService.getUserById(id);
    if (!findUser) throw new HttpException("User not found", 404);
    return findUser;
  }

  @Patch(":id")
  async updateUser(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException("Invalid Id", 400);
    const updateUser = await this.usersService.updateUser(id, dto);
    if (!updateUser) throw new HttpException("User not found", 404);
    return updateUser;
  }
}
