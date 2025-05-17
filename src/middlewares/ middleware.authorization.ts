import { Handler, NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "@src/common/libs/lib.jwt";
import { AuthorizationError } from "@src/common/util/util.route-errors";
import { User } from "@src/models/User";
import { log } from "console";
export const auth = (): Handler => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = (req.headers.authorization ?? "")
        .replace("Bearer", "")
        .trim()
        .replace(/^"|"$/g, "");

      const decodedToken: string | JwtPayload = await verifyToken(accessToken);
      console.log("Decoded token", decodedToken);

      const user = await User.findById(decodedToken.id);
      if (!user) throw new AuthorizationError("Access denied");
      req.user = user;
      next();
    } catch (e: any) {
      throw new AuthorizationError(e.message);
    }
  };
};
