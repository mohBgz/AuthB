import express from "express";

import {createApp, getApps} from "../controllers/app.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


router.post("/create-app",verifyToken, createApp); //http://localhost:5173/apps/create-app
router.get("/",verifyToken, getApps); //http://localhost:5173/apps

export default router;