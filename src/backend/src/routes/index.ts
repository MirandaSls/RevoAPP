import  express  from 'express';
import { eventRouter } from './event';
import { userRoutes } from './user';

const routes = express()

routes.use("/user", userRoutes);
routes.use("/event", eventRouter);

export {routes}