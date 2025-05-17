import {
  ApplicationError,
  RouteError,
} from "@src/common/util/util.route-errors";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";

import UserRepo from "@src/repos/UserRepo";
import { IUser, User } from "@src/models/User";
import { IToken, signToken } from "@src/common/libs/lib.jwt";
import { InsertResult } from "typeorm";
import { ILoginResponseDto } from "@src/dto/dto.user";

/******************************************************************************
                                Constants
******************************************************************************/

export const USER_NOT_FOUND_ERR = "User not found";

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 *
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Add one user.
 */
function addOne(user: IUser): Promise<void> {
  return UserRepo.add(user);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }
  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }
  // Delete user
  return UserRepo.delete(id);
}

/**
 * Login a user.
 */

async function login(
  email: string,
  password: string
): Promise<ILoginResponseDto | null> {
  const user = await UserRepo.getOne(email);
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
    // role: user.role,
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

/**
 * Register a user.
 */
async function register(user: IUser): Promise<void> {
  const exists = await UserRepo.getOne(user.email);
  if (exists) {
    throw new ApplicationError("Email already exists");
  }
  const saveUser = new User(user);
  const result = await UserRepo.add(saveUser);
  return result;
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  login,
  register,
} as const;
