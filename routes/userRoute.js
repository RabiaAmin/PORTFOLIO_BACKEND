import express from "express";
import {register,login,logout ,getUser,profileUpdate} from "../controller/userController.js"
import { isAuthenticated } from "../middleware/auth.js";


const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.get("/getUser" , isAuthenticated, getUser);
router.put("/update/profile",isAuthenticated,profileUpdate)

export default router;