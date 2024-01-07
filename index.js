//jshint: esversion: 6

import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'; // Import cookie-parser

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser()); // Use the cookie-parser middleware
app.use((req, res, next) => {
    req.userId = getUserId(req, res); // Set userId in the request object for every incoming request
    next();
  });

mongoose.connect(
  "mongodb+srv://youssefouakaa2:ApR8XwdAkUFwsAt7@cluster0.sn19g4m.mongodb.net/todo?retryWrites=true&w=majority"
);

const itemSchema = new mongoose.Schema({
  userId: String, // Add a field to store the userId
  name: String,
  done: Boolean,
});

const DailyTask = new mongoose.model("DailyTask", itemSchema);
const WorkTask = new mongoose.model("WorkTask", itemSchema);
const SchoolTask = new mongoose.model("SchoolTask", itemSchema);

function generateUniqueIdentifier() {
  // Logic to generate a unique identifier (e.g., UUID or any other method)
  // For demonstration, using a simple random string here
  return Math.random().toString(36).substr(2, 9);
}

function getUserId(req, res) {
  let userId = req.cookies.userId;
  if (!userId) {
    userId = generateUniqueIdentifier();
    res.cookie("userId", userId);
  }
  return userId;
}

app.get("/", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const dailyTasks = await DailyTask.find({ userId: userId });
    res.render("index.ejs", { tasks: dailyTasks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving tasks");
  }
});

app.post("/done-daily", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const taskId = req.body.check;
    await DailyTask.updateOne({ _id: taskId, userId: userId}, { $set: { done: true } });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error marking task as done");
  }
});

app.post("/add-daily", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const newTask = new DailyTask({ userId: userId, name: req.body.toadd, done: false });
    await newTask.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding new task");
  }
});

app.post("/delete-daily", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const taskId = req.body.mybtn;
    await DailyTask.deleteOne({ _id: taskId, userId: userId });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting task");
  }
});

app.get("/work", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const workTasks = await WorkTask.find({userId: userId});
    res.render("work.ejs", { tasks: workTasks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving tasks");
  }
});

app.post("/done-work", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const taskId = req.body.check;
    await WorkTask.updateOne({ _id: taskId, userId: userId }, { $set: { done: true } });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error marking task as done");
  }
});

app.post("/add-work", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const newTask = new WorkTask({ userId: userId, name: req.body.toadd, done: false });
    await newTask.save();
    res.redirect("/work");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding new task");
  }
});

app.post("/delete-work", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const taskId = req.body.mybtn;
    await WorkTask.deleteOne({ _id: taskId, userId: userId });
    res.redirect("/work");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting task");
  }
});

app.get("/school", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const schoolTasks = await SchoolTask.find({userId: userId});
    res.render("school.ejs", { tasks: schoolTasks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving tasks");
  }
});

app.post("/done-school", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const taskId = req.body.check;
    await SchoolTask.updateOne({ _id: taskId, userId: userId }, { $set: { done: true } });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error marking task as done");
  }
});

app.post("/add-school", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const newTask = new SchoolTask({ userId: userId, name: req.body.toadd, done: false });
    await newTask.save();
    res.redirect("/school");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding new task");
  }
});

app.post("/delete-school", async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request object
    const taskId = req.body.mybtn;
    await SchoolTask.deleteOne({ userId: userId, _id: taskId });
    res.redirect("/school");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting task");
  }
});
/* 
app.get("/school", (req, res) => {
    res.render("school.ejs", {tasks: school});
});

app.post("/add-school", (req, res) => {
    school.push(req.body.toadd);
    res.redirect("/school");
});

app.post("/delete-school", (req, res) => {
    school.splice(req.body.mybtn, 1);
    res.redirect("/school");
});
*/

app.listen(port, () => {
  console.log("Listening on port " + port);
});
