import { isNumber } from "jet-validators";
import { transform } from "jet-validators/utils";

import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import UserService from "@src/services/UserService";

import { IReq, IRes } from "./common/types";
import { parseReq } from "./common/util";
import { loginSchema, userSchema } from "./common/util/validation";
import { ILoginResponseDto } from "@src/dto/dto.user";
import { ApiResponse } from "@src/common/util/util.api-response";
import { ValidationError } from "@src/common/util/util.route-errors";
import { User } from "@src/models/User";
import { log } from "console";

/******************************************************************************
                                Constants
******************************************************************************/

const Validators = {
  login: parseReq(loginSchema),
  register: parseReq(userSchema),
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Login a user.
 */
async function login(req: IReq, res: IRes) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { email, password } = value;

  const loginResult = await UserService.login(email, password);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.OK,
    "Login successful",
    loginResult
  );
  res.status(HttpStatusCodes.OK).json(response);
}

/**
 * Register a user.
 */
async function register(req: IReq, res: IRes) {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  await UserService.register(value);
  const response: ApiResponse = new ApiResponse(
    HttpStatusCodes.CREATED,
    "User registered successfully"
  );
  res.status(HttpStatusCodes.CREATED).json(response);
}

export default {
  login,
  register,
} as const;
