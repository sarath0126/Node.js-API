// import { Project } from "../models/project.models.js";

// CREATE PROJECT
import mongoose from "mongoose";
import { User } from "../models/users.models.js";
import { Project } from "../models/project.models.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate, teamMembers } = req.body;

    // remove dup id's
    const uniqueMembers = [...new Set(teamMembers)];

    
    for (const id of uniqueMembers) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: `Invalid user ID: ${id}`,
        });
      }
    }

  
    const users = await User.find({ _id: { $in: uniqueMembers } });

    if (users.length !== uniqueMembers.length) {
      return res.status(404).json({
        message: "One or more user IDs do not exist",
      });
    }

    
    const project = await Project.create({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user.id,
      teamMembers: []
    });

    
    for (const user of users) {
      if (!user.assignedProjects.includes(project._id)) {
        return res.status(400).json({
          message: `User ${user.username} is NOT assigned to this project`,
        });
      }
    }

    
    project.teamMembers = uniqueMembers;
    await project.save();

    res.status(201).json({
      message: "Project created successfully",
      project,
    });

  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// GET ALL PROJECTS
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isDeleted: false })
      .populate("createdBy", "username email role")
      .populate("teamMembers", "username email role");

    res.status(200).json({
      count: projects.length,
      projects,
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      updated,
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// DELETE PROJECT (soft delete)
export const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Project.findByIdAndUpdate(id, { isDeleted: true });

    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};