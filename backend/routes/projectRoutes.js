const express = require("express");

const router = express.Router();

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware");


// ========================================
// PUBLIC ROUTES
// ========================================

// Anyone can view projects

router.get("/", getProjects);

router.get("/:id", getProjectById);


// ========================================
// ADMIN ROUTES
// ========================================

// Admin only

router.post(
    "/",
    protect,
    admin,
    createProject
);


router.put(
    "/:id",
    protect,
    admin,
    updateProject
);


router.delete(
    "/:id",
    protect,
    admin,
    deleteProject
);


module.exports = router;