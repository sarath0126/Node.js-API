import { Task } from "../models/tasks.models.js";
import { User } from "../models/users.models.js";

// create Task

export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Not Able To Assign" });
    }

    const user = await User.findById(assignedTo);
    if(!user){
      return res.status(200).json({message : "User Not Found"});
    }
    

    if (req.user.role === "manager" && user.role !== "employee") {
      return res.status(403).json({ message: "Managers can assign tasks only to employees" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({ message: "Task Created Successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get Task

export const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find().populate(
        "assignedTo assignedBy",
        "username role email"
      );
    } 
    else if (req.user.role === "manager") {
      tasks = await Task.find({ assignedBy: req.user.id }).populate(
        "assignedTo assignedBy",
        "username role email"
      );
    } 
    else if (req.user.role === "employee") {
      tasks = await Task.find({ assignedTo: req.user.id }).populate(
        "assignedTo assignedBy",
        "username role email"
      );
    } 
    
    else {
      return res.status(403).json({ message: "Access Denied" });
    }

    res.status(200).json({tasks , message: "Tasks Fetched Successfully"});
  } catch (err) {
    return res.status(500).json({message : "Internal Server Error !"});
  }
};


// Update Tasks

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, status, priority, dueDate } = req.body;
    const updatedTaskData = { title, description, assignedTo, status, priority, dueDate };

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    // ✅ Admin can update any task
    if (req.user.role === "admin") {
      const updatedTask = await Task.findByIdAndUpdate(id, updatedTaskData, { new: true });
      return res.status(200).json({ message: "Task Updated Successfully", updatedTask });
    }

    // ✅ Manager can update only tasks they created
    if (req.user.role === "manager") {
      if (task.assignedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access Denied: Managers can only update their own created tasks" });
      }
      const updatedTask = await Task.findByIdAndUpdate(id, updatedTaskData, { new: true });
      return res.status(200).json({ message: "Task Updated Successfully", updatedTask });
    }

    // ✅ Employee can only update their assigned task status
    if (req.user.role === "employee") {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access Denied: You can only update your own task" });
      }
      const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });
      return res.status(200).json({ message: "Task Status Updated Successfully", updatedTask });
    }

    // ✅ If role not found
    return res.status(403).json({ message: "Invalid Role" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Task

export const deleteTask  = async(req,res)=>{
    try{
        const  {id} = req.params;
        const task = await Task.findById(id);
        if(!task){
            return res.status(404).json({message : "Task Not Found"});
        }

        if(req.user.role === "admin"){
            task.isDeleted = true;
            await task.save();
            return res.status(200).json({message : "Deleted Success by admin"})
        }

        else if(req.user.role === "manager"){
            if(task.assignedBy != req.user.id){
                return res.status(401).json({message : "Access Denied can not delete"})
            }

            task.isDeleted = true;
            await task.save();
            return res.status(200).json({message : "Deleted Success By Manager"})
        }

        else if(req.user.role === "employee"){
            return res.status(403).json({message : "Employee cannot delete"})
        }
        else{
            return res.status(403).json({message : "No Role"})
        }
    }
    catch(err){
        res.status(500).json({ message: "Internal Server Error" });
    }

}