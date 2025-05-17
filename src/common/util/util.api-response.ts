import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";

/******************************************************************************
                                 Classes
******************************************************************************/

/**
 * Error with status code and message.
 */
export class ApiResponse {
  public status: HttpStatusCodes;
  public message: string;
  public data: any;

  public constructor(status: HttpStatusCodes, message: string, data?: any) {
    this.status = status;
    this.message = message;
    this.data = data ?? null;
  }
}
