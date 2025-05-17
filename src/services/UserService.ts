import {
  ApplicationError,
  RouteError,
} from "@src/common/util/util.route-errors";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";

import { UserRepository } from "@src/repos/UserRepo";
import { IUser, User } from "@src/models/User";
import { IToken, signToken } from "@src/common/libs/lib.jwt";
import { InsertResult } from "typeorm";
import { ILoginResponseDto } from "@src/dto/dto.user";
import {
  PaginationOptions,
  PaginationResult,
} from "@src/common/interfaces/mongo.interface";

/******************************************************************************
                                Constants
******************************************************************************/

export const USER_NOT_FOUND_ERR = "User not found";

/******************************************************************************
                                Functions
******************************************************************************/
class UserService {
  private userRepo = new UserRepository();
  async getAll(): Promise<IUser[]> {
    return this.userRepo.getAll();
  }
  async addOne(user: IUser): Promise<void> {
    return this.userRepo.add(user);
  }
  async updateOne(user: IUser): Promise<void> {
    const persists = await this.userRepo.persists(user.id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }
    return this.userRepo.update_(user);
  }
  async delete(id: number): Promise<void> {
    const persists = await this.userRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }
    return this.userRepo.delete_(id);
  }
  async getUsersWithPagination(
    options: PaginationOptions,
    filters?: any
  ): Promise<PaginationResult<IUser>> {
    return this.userRepo.paginate(filters || {}, options);
  }
  async searchUsers(
    query: string,
    options: PaginationOptions
  ): Promise<PaginationResult<IUser>> {
    return this.userRepo.searchUsers(query, options);
  }
  async login(
    email: string,
    password: string
  ): Promise<ILoginResponseDto | null> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new ApplicationError("User or password is incorrect");
    }
    if (user.password !== password) {
      throw new ApplicationError("Invalid password");
    }
    const payloadToken: Record<string, any> = {
      id: user.id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
    };
    const token: IToken = await signToken(payloadToken, {
      expiredAt: 1,
      type: "days",
    });

    const response: ILoginResponseDto = {
      email: user.email,
      id: user.id,
      name: user.firstName + " " + user.lastName,
      token: token.accessToken,
      refreshToken: token.refreshToken,
    };

    return response;
  }
  async register(user: IUser): Promise<void> {
    const exists = await this.userRepo.findByEmail(user.email);
    if (exists) {
      throw new ApplicationError("Email already exists");
    }
    const saveUser = new User(user);
    const result = await this.userRepo.add(saveUser);
    return result;
  }
}

const userService = new UserService();
export default userService;
