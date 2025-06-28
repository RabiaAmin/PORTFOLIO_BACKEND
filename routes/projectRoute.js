import express from "express";
import {
    addNewProject,
    deleteProject,
    updateProject,
    getAllProject,
    getSingleProject

} from "../controller/projectController.js";
import {isAuthenticated} from "../middleware/auth.js";

const router = express.Router();

router.post("/add",isAuthenticated ,addNewProject);
router.delete("/delete/:id",isAuthenticated,deleteProject);
router.put("/update/:id",isAuthenticated,updateProject);
router.get("/getall",getAllProject);
router.get('/getSingleProject/:id',getSingleProject);


export default router;
