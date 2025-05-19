import express from 'express';
import db from '../db.js';

const router = express.Router();
// Get all todos from the logged-in user
router.get("/", (req, res) => {
    const getTodo = db.prepare(`SELECT * FROM todos WHERE user_id = ?`)
    const todos = getTodo.all(req.userId);
    res.json({ todos })
})

router.post("/", (req, res) => { })

router.put("/:id", (req, res) => { })

router.delete("/:id", (req, res) => { })

export default router;