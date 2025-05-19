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
try{
  const insertUser = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
  const result = insertUser.run(username, hashedPassword);
}
catch(error){
  console.error("Error saving user to database:", error);
  return res.status(500).json({ message: "Internal server error" });
}
  
});

router.post("/login", (req, res) => {
 
});

export default router;
