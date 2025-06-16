import express from "express";
import {
    addNewSkill,
    deleteSkill,
    updateSkill,
    getAllSkill,
    getAllCategories
} from "../controller/skillController.js";
import {isAuthenticated} from "../middleware/auth.js";

const router = express.Router();

router.post("/add",isAuthenticated ,addNewSkill);
router.post("/delete/:id",isAuthenticated,deleteSkill);
router.put("/update/:id",isAuthenticated,updateSkill);
router.get("/getall",getAllSkill);
router.get("/categories", getAllCategories);

export default router;
