import { IParseObjectError } from "jet-validators/utils";

import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";

/******************************************************************************
                                 Classes
******************************************************************************/

/**
 * Error with status code and message.
 */
export class RouteError {
  public status: HttpStatusCodes;
  public message: string;
  public isSuccess: boolean;

  public constructor(status: HttpStatusCodes, message: string) {
    this.isSuccess = false;
    this.message = message;
    this.status = status;
  }
}

/**
 * Handle "parseObj" errors.
 */
export class ValidationError extends RouteError {
  public static MESSAGE =
    "The parseObj() function discovered one or " + "more errors.";

  public constructor(message: string) {
    super(HttpStatusCodes.BAD_REQUEST, message);
  }
}

/**
 * Handle "parseObj" errors.
 */
export class ApplicationError extends RouteError {
  public static MESSAGE = "An error occurred while processing your request.";

  public constructor(message: string) {
    super(HttpStatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}

/**
 * Handle "authorization" errors.
 */
export class AuthorizationError extends RouteError {
  public static MESSAGE = "You are not authorized to access this resource.";

  public constructor(message: string) {
    super(HttpStatusCodes.UNAUTHORIZED, message);
  }
}
