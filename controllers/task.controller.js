import { Task } from "../models/tasks.models.js";
import { User } from "../models/users.models.js";
import { Project } from "../models/project.models.js";


export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate, projectId } = req.body;
    
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Not Able To Assign" });
    }

    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: "Assigned User Not Found" });
    }

    if (req.user.role === "manager" && user.role !== "employee") {
      return res.status(403).json({ message: "Managers can assign tasks only to employees" });
    }

    const project = await Project.findById(projectId);
    if (!project || project.isDeleted) {
      return res.status(404).json({ message: "Project Not Found" });
    }

    // Create Task
    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      status,
      priority,
      dueDate,
      projectId,
    });

    return res.status(201).json({ 
      message: "Task Created Successfully", 
      task 
    });

  } catch (err) {
    console.error("Create Task Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      // Admin gets all tasks
      tasks = await Task.find({ isDeleted: false })
        .populate("assignedTo assignedBy projectId", "username email role title");
    }

    else if (req.user.role === "manager") {
      // Manager gets only tasks they created
      tasks = await Task.find({ 
        assignedBy: req.user.id,
        isDeleted: false 
      }).populate("assignedTo assignedBy projectId", "username email role title");
    }

    else if (req.user.role === "employee") {
      // Employee gets tasks assigned to them
      tasks = await Task.find({ 
        assignedTo: req.user.id,
        isDeleted: false 
      }).populate("assignedTo assignedBy projectId", "username email role title");
    }

    else {
      return res.status(403).json({ message: "Access Denied" });
    }

    return res.status(200).json({
      message: "Tasks Fetched Successfully",
      tasks
    });

  } catch (err) {
    console.error("Get Tasks Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, status, priority, dueDate, projectId } = req.body;

    const task = await Task.findById(id);
    if (!task || task.isDeleted) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    if (req.user.role === "admin") {
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, assignedTo, status, priority, dueDate, projectId },
        { new: true }
      );
      return res.status(200).json({ message: "Task Updated Successfully", updatedTask });
    }

    if (req.user.role === "manager") {
      if (task.assignedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Managers can update only tasks they assigned" });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, assignedTo, status, priority, dueDate, projectId },
        { new: true }
      );
      return res.status(200).json({ message: "Task Updated Successfully", updatedTask });
    }


    if (req.user.role === "employee") {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only update your own tasks" });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      return res.status(200).json({
        message: "Task Status Updated Successfully",
        updatedTask
      });
    }

    return res.status(403).json({ message: "Invalid Role" });

  } catch (err) {
    console.error("Update Task Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task || task.isDeleted) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    if (req.user.role === "admin") {
      task.isDeleted = true;
      await task.save();
      return res.status(200).json({ message: "Task Deleted by Admin" });
    }

    
    if (req.user.role === "manager") {
      if (task.assignedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Managers can delete only tasks they created" });
      }

      task.isDeleted = true;
      await task.save();
      return res.status(200).json({ message: "Task Deleted by Manager" });
    }

    if (req.user.role === "employee") {
      return res.status(403).json({ message: "Employees cannot delete tasks" });
    }

    return res.status(403).json({ message: "Invalid Role" });

  } catch (err) {
    console.error("Delete Task Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getProjectTasks = async (req, res) => {
  try {
    const projectId = req.params.id;

    const tasks = await Task.find({
      projectId,
      isDeleted: false
    }).populate("assignedTo assignedBy", "username email role");

    return res.status(200).json({
      message: "Project Tasks Fetched Successfully",
      tasks,
      count: tasks.length
    });

  } catch (err) {
    console.error("Project Tasks Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};