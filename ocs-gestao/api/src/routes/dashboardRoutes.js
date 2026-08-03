import express from "express";
import validateJWT from "./jwtmiddleware.js";
import DashboardController from "../controllers/dashboarController.js";

const router = express.Router();

router
    .get('/dashboard',validateJWT,DashboardController.GetDashboard)
 
export default router;