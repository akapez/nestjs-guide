import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateUserProfileDto {
  @IsOptional()
  @IsBoolean()
  receiveNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  receiveEmail?: boolean;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserProfileDto)
  profile?: CreateUserProfileDto;
}
