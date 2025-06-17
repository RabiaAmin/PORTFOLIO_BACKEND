import express from "express";
import {
    addNewProject,
    deleteProject,
    updateProject,
    getAllProject,

} from "../controller/projectController.js";
import {isAuthenticated} from "../middleware/auth.js";

const router = express.Router();

router.post("/add",isAuthenticated ,addNewProject);
router.post("/delete/:id",isAuthenticated,deleteProject);
router.put("/update/:id",isAuthenticated,updateProject);
router.get("/getall",getAllProject);


export default router;
