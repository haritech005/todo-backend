import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// Middleware to check if the user is authenticated /auth/register
router.post("/register", (req, res) => {
    const { username, password } = req.body

    //save the username and irreversably encrypted password to the database
    // encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)
    //save the new user and hashed password to the database
    try {
        const insertUser = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        const result = insertUser.run(username, hashedPassword);

        // now we have user we need to add their first todo for them
        const defaultTodo = `Hi there ${username}, welcome to your todo list!`;
        const insertTodo = db.prepare("INSERT INTO todos (user_id, task) VALUES (?, ?)");
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    }
    catch (error) {
        console.error("Error saving user to database:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

});


router.post("/login", (req, res) => {
    const { username, password } = req.body

    //check if the user exists

    try {
        const getUser = db.prepare(`SELECT * from users where username = ?`)
        // inject the username into the question mark read all the user and get the particular user which we have inserted 
        const user = getUser.get(username)

        if (!user) {
            return res.status(404).send({ message: "User Not found" })
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) return res.status(401).send({ message: "Password is incorrect" })
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    }
    catch (error) {
        console.error("Error checking user in database:", error);
        return res.status(503).json({ message: "Internal server error" });
    }

});

export default router;
