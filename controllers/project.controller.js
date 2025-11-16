import { Project } from "../models/project.models.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate, teamMembers } = req.body;

    const project = await Project.create({
      title,
      description,
      startDate,
      endDate,
      teamMembers,
      createdBy: req.user.id,
    });

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
