import { AuthorizationError } from "@src/common/util/util.route-errors";
import { Request, Response, NextFunction, Handler } from "express";
import { IncomingHttpHeaders, OutgoingMessage } from "http";
import { assert } from "is-any-type";
import { decrypt } from "jwt-transform";

export const transform = (): Handler => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      let headers: IncomingHttpHeaders = req.headers;
      if (!Object.keys(headers).includes("authorization"))
        throw new AuthorizationError("Authorization header is required");

      const authorization: boolean | undefined = (
        headers.authorization as string
      ).includes("Bearer");
      if (!authorization)
        throw new AuthorizationError("Authorization format is not valid");

      const accessToken: string = (headers.authorization as string).split(
        "Bearer "
      )[1];
      if (assert.isUndefined(accessToken as any))
        throw new AuthorizationError("Access Token is required");

      const validJwt: string[] = (accessToken as string).split(".");
      if (validJwt?.length !== 3)
        throw new AuthorizationError("Access Token is not valid");

      // overwrite authorization headers
      req.headers.authorization = `Bearer ${await decrypt(accessToken, 20)}`;

      next();
    } catch (e: any) {
      throw new AuthorizationError(e.message);
    }
  };
};
