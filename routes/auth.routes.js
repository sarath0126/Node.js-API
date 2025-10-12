import express from "express";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/auth.middlewares.js";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import {
  getUsers,
  getEmployees,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication routes
 *   - name: Users
 *     description: User management routes
 *   - name: Tasks
 *     description: Task management routes
 */

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
 *               dob:
 *                 type: string
 *               address:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get("/logout", logoutUser);

/**
 * @swagger
 * /api/users/getUsers:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Forbidden, only admin can access
 */
router.get("/getUsers", authenticateToken, authorizeRole("admin"), getUsers);

/**
 * @swagger
 * /api/users/employees:
 *   get:
 *     summary: Get all employees (Admin and Manager)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 *       403:
 *         description: Forbidden, only admin or manager can access
 */
router.get(
  "/employees",
  authenticateToken,
  authorizeRole("admin", "manager"),
  getEmployees
);

/**
 * @swagger
 * /api/users/getUserById/{id}:
 *   get:
 *     summary: Get a user by ID (Admin and Manager)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get(
  "/getUserById/:id",
  authenticateToken,
  authorizeRole("admin", "manager"),
  getUserById
);

/**
 * @swagger
 * /api/users/updateUser/{id}:
 *   put:
 *     summary: Update a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.put(
  "/updateUser/:id",
  authenticateToken,
  authorizeRole("admin"),
  updateUser
);

/**
 * @swagger
 * /api/users/deleteUser/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete(
  "/deleteUser/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteUser
);

/**
 * @swagger
 * /api/users/createTask:
 *   post:
 *     summary: Create a new task (Admin and Manager)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               dueDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post(
  "/createTask",
  authenticateToken,
  authorizeRole("admin", "manager"),
  createTask
);

/**
 * @swagger
 * /api/users/getTasks:
 *   get:
 *     summary: Get all tasks (Authenticated users)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/getTasks", authenticateToken, getTasks);

/**
 * @swagger
 * /api/users/updateTask/{id}:
 *   put:
 *     summary: Update a task (Authenticated users)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               dueDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put("/updateTask/:id", authenticateToken, updateTask);

/**
 * @swagger
 * /api/users/deleteTask/{id}:
 *   delete:
 *     summary: Delete a task (Authenticated users)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete("/deleteTask/:id", authenticateToken, deleteTask);

export default router;
