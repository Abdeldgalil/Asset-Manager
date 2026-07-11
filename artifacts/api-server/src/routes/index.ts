
import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storiesRouter from "./stories";
import imageRouter from "./stories/image";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storiesRouter);
router.use(imageRouter);

export default router;
