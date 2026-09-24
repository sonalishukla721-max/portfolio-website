const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        technologies: {
            type: [String],
            default: []
        },

        githubUrl: {
            type: String,
            trim: true
        },

        liveUrl: {
            type: String,
            trim: true
        },

        image: {
            type: String,
            trim: true
        },

        featured: {
            type: Boolean,
            default: false
        },

        user: {
          type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
  }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);