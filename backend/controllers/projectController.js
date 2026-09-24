const Project = require("../models/Project");


// ==================== CREATE PROJECT ====================

const createProject = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            technologies,
            githubUrl,
            liveUrl,
            image,
            featured
        } = req.body;


        if (!title || !description || !category) {

            return res.status(400).json({
                message: "Title, description and category are required"
            });

        }


        const project = await Project.create({

            title,
            description,
            category,
            technologies: technologies || [],
            githubUrl,
            liveUrl,
            image,
            featured: featured || false,

            // Logged-in user's ID
            user: req.user._id

        });


        res.status(201).json({

            message: "Project created successfully",

            project

        });


    } catch (error) {

        res.status(500).json({

            message: "Failed to create project",

            error: error.message

        });

    }

};


// ==================== GET ALL PROJECTS ====================
// PUBLIC ROUTE

const getProjects = async (req, res) => {

    try {

        const projects = await Project.find()
            .sort({
                createdAt: -1
            });


        res.status(200).json({

            count: projects.length,

            projects

        });


    } catch (error) {

        res.status(500).json({

            message: "Failed to fetch projects",

            error: error.message

        });

    }

};


// ==================== GET SINGLE PROJECT ====================
// PUBLIC ROUTE

const getProjectById = async (req, res) => {

    try {

        const project = await Project.findById(
            req.params.id
        );


        if (!project) {

            return res.status(404).json({

                message: "Project not found"

            });

        }


        res.status(200).json(project);


    } catch (error) {

        res.status(500).json({

            message: "Failed to fetch project",

            error: error.message

        });

    }

};


// ==================== UPDATE PROJECT ====================
// PROTECTED ROUTE

const updateProject = async (req, res) => {

    try {

        const project = await Project.findOne({

            _id: req.params.id,

            user: req.user._id

        });


        if (!project) {

            return res.status(404).json({

                message: "Project not found"

            });

        }


        const {
            title,
            description,
            category,
            technologies,
            githubUrl,
            liveUrl,
            image,
            featured
        } = req.body;


        if (title !== undefined) {
            project.title = title;
        }


        if (description !== undefined) {
            project.description = description;
        }


        if (category !== undefined) {
            project.category = category;
        }


        if (technologies !== undefined) {
            project.technologies = technologies;
        }


        if (githubUrl !== undefined) {
            project.githubUrl = githubUrl;
        }


        if (liveUrl !== undefined) {
            project.liveUrl = liveUrl;
        }


        if (image !== undefined) {
            project.image = image;
        }


        if (featured !== undefined) {
            project.featured = featured;
        }


        const updatedProject =
            await project.save();


        res.status(200).json({

            message: "Project updated successfully",

            project: updatedProject

        });


    } catch (error) {

        res.status(500).json({

            message: "Failed to update project",

            error: error.message

        });

    }

};


// ==================== DELETE PROJECT ====================
// PROTECTED ROUTE

const deleteProject = async (req, res) => {

    try {

        const project = await Project.findOne({

            _id: req.params.id,

            user: req.user._id

        });


        if (!project) {

            return res.status(404).json({

                message: "Project not found"

            });

        }


        await project.deleteOne();


        res.status(200).json({

            message: "Project deleted successfully"

        });


    } catch (error) {

        res.status(500).json({

            message: "Failed to delete project",

            error: error.message

        });

    }

};


module.exports = {

    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject

};