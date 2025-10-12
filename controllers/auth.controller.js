import { User } from "../models/users.models.js";
import bcrypt from "bcrypt";

// Register

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, dob, address, location } =
      req.body;

    const userExist = await User.findOne({ $or: [{ email }, { username }] });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    // console.log(userExist)//
    const createUser = await User.create({
      username,
      email,
      password,
      role,
      dob,
      address,
      location,
    });
    res
      .status(201)
      .json({
        statusCode: 201,
        message: "User Created Successfully",
        user: createUser,
      });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = user.generateJWT();

    res.status(200).json({
      statusCode: 200,
      message: "Login successful",
      userDetails: {
        username: user.username,
        email: user.email,
        role:user.role
      },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const logoutUser = async (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "Logout successful — remove token on client side",
  });
};