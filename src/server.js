import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// get the file path from URL of the current module
const __filename = fileURLToPath(import.meta.url);

//get the dir name from the file path
const __dirname = dirname(__filename);
// middleware
app.use(express.json());

//Serves the HTML from the /public directory
// tells express to serve all files from the public folder as static assests/file
//Any request for the css files will be resolved to public directory
app.use(express.static(path.join(__dirname, "../public")));

// Serving up the html file from the /public directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//routes
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
