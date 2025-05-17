import { Router } from "express";

import Paths from "@src/common/constants/Paths";
import UserRoutes from "./UserRoutes";
import AuthRoutes from "./AuthRoutes";
import { auth } from "@src/middlewares/ middleware.authorization";
import { transform } from "@src/middlewares/middleware.jwtTransform";

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ** Add UserRouter ** //

// Init router
const userRouter = Router();

/******************************************************************************
                                User routes
******************************************************************************/
// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

const authRouter = Router();
/******************************************************************************
                                Auth routes
******************************************************************************/
// Add AuthRouter
authRouter.post(Paths.Auth.Login, AuthRoutes.login);
authRouter.post(Paths.Auth.Register, AuthRoutes.register);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);
// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;

// appRouter.get(Paths, [transform(), auth()], funtion);
