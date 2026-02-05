import express from "express";

import {createApp, deleteApp, getApps, regenerateKey} from "../controllers/app.controller.js";
import { verifyDashboardAccessToken } from "../middleware/verifyDashboardAccessToken.js";

const router = express.Router();


router.post("/create-app",verifyDashboardAccessToken, createApp); //http://localhost:5173/api/dashboard/apps/create-app
router.delete("/:appId",verifyDashboardAccessToken, deleteApp); //http://localhost:5173/api/dashboard/apps/123
router.patch("/:appId", verifyDashboardAccessToken, regenerateKey); //http://localhost:5173/api/dashboard/apps/123 + body { "regenerateKey" :true}
router.get("/",verifyDashboardAccessToken, getApps); //http://localhost:5173/api/dashboard/apps

export default router;