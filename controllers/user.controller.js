import { User } from "../models/users.models.js";

// Get All Users from DB (Should Be Done Only By Admin)
export const getUsers = async(req,res)=>{
    try{
        const users = await User.find({},"-password");//
        if(users.length === 0){
            console.log("User Not Found");
        }

        res.status(200)
        .json({message : "Users Fetched Successfully" , users})
    }
    catch(err){
        
        res.status(500).json({message : "Internal Server Error"});
    }
}

// Get Only Employees (Should be Done Admin and Manager)

export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" })

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "Employees not found" });
    }

    res.status(200).json({
      message: "Employees fetched successfully",
      employeeList: employees,
    });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// Get User By Based on Their ID(It Can Done by admin and manager)


export const getUserById = async(req,res)=>{
  try {
      const {id} = req.params;
      const user = await User.findById(id , "-password");
      if(!user){
        return res.status(404).json({message : "User Not Found"});
      }

      res.status(200)
      .json({message : "User Detailes Fetched Successful" , userInfo : user})

  } catch (error) {
    res.status(500).json({message : "Internal Server Error "})
  }
}



// Update User (only Admin)

export const updateUser = async(req,res)=>{
  try{
    const {id} = req.params
    const {username ,  email , role, dob , address , location } = req.body;
    const updateData = {username ,  email , role, dob , address , location}

    const updateUser = await User.findByIdAndUpdate(id , updateData ,{new : true});

    if(!updateUser){
      return res.status(404).json({message : "User Not Found"});
    }
    
    res.status(200)
      .json({message : "User Updated Successfully" , userInfo : updateUser})

  }
  catch(err){
    console.log(err);
    
    res.status(500).json({message : "Internal Server Error "})
  }
}



// Delete User (Only Admin Should Do this)
export const deleteUser = async(req,res)=>{
  try {
      const {id} = req.params;
      const user = await User.findById(id);
      if(!user){
        return res.status(404).json({message : "User Not Found"});
      }
      
     user.isDeleted =  true;
     user.deletedBy = user.username;
     user.deletedAt = Date.now();
     await user.save();

      res.status(200).json({message : "User Deleted Successfully"})
  } catch (error) {
    console.log(error);
    console.log(error);
    
    res.status(500).json({message : "Internal Server Error "})
  }
}

