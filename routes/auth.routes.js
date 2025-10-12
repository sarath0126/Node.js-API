import express from "express"
import { authenticateToken, authorizeRole } from "../middlewares/auth.middlewares.js";
import { registerUser,loginUser, logoutUser } from "../controllers/auth.controller.js";
import { getUsers , getEmployees , getUserById , updateUser , deleteUser} from "../controllers/user.controller.js";
import { createTask ,deleteTask,getTasks , updateTask } from "../controllers/task.controller.js";


const router = express.Router();

// auth routes
router.post("/register" , registerUser);
router.post("/login" , loginUser);
router.get("/logout" , logoutUser)


// User routes
router.get("/getUsers",authenticateToken , authorizeRole("admin"), getUsers);
router.get("/employees" , authenticateToken , authorizeRole("admin","manager") , getEmployees);
router.get("/getUserById/:id" , authenticateToken , authorizeRole("admin", "manager") , getUserById);
router.put("/updateUser/:id" , authenticateToken , authorizeRole("admin") , updateUser);
router.delete("/deleteUser/:id" , authenticateToken , authorizeRole("admin"),deleteUser);


// Task routes

router.post("/createTask" , authenticateToken , authorizeRole("admin", "manager") ,createTask);
router.get("/getTasks" , authenticateToken ,getTasks);
router.put("/updateTask/:id" , authenticateToken , updateTask)
router.delete("/deleteTask/:id" , authenticateToken ,deleteTask);


/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post("/register", registerUser);
export default router;