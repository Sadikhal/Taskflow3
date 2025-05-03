// routes/task.routes.js
import express from 'express';
import { createTask, deleteTask, getTasks, getTask, updateTask } from '../controllers/task.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/project/:projectId', verifyToken, createTask);
router.get('/project/:projectId', verifyToken, getTasks);
router.get('/:id', verifyToken, getTask);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

export default router;