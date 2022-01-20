import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});
mongoose.Promise = Promise;

// Model to Sign Up & Sign in user
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
});
const User = mongoose.model("User", UserSchema);

// Model to create new group
const GroupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  //helpers: {
  //some type of ID that connects to a user, required.
  //}
});
const Group = mongoose.model("Group", GroupSchema);

// Model to create task
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // group: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Group",
  // },
  // Checked?
  //Possible to add helper or leave blank.
});
const Task = mongoose.model("Task", TaskSchema);

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");

  try {
    const user = await User.findOne({ accessToken });
    if (user) {
      next(); // built in function for express that makes the app move along if there's for example an user
    } else {
      res.status(401).json({
        response: {
          message: "Please, log in",
        },
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

// Authentication = member - 401
// Authorization = what type of member - 403

// Get endpoints
app.get("/", (req, res) => {
  res.send("Start");
});

app.get("/home", authenticateUser);
app.get("/home", async (req, res) => {
  res.send("Home");
});

app.get("/home/tasks", authenticateUser);
app.get("/home/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(201).json({ response: tasks, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});
app.get("/home/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId).populate("group");
  res.status(200).json({ response: task, success: true });
});

app.get("/home/groups/:groupId", async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId).populate("task");
  res.status(200).json({ response: group, task, success: true });
});

app.get("/home/groups", authenticateUser);
app.get("/home/groups", async (req, res) => {
  try {
    const groups = await Group.find({}).populate("task");
    res.status(201).json({ response: groups, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Försök hitta alla tasks med samma grupp id
app.get("/home/tasks/:groupId", async (req, res) => {
  const { groupId } = req.body;

  try {
    const tasks = await Task.findById(groupId);
    res.status(201).json({ response: tasks, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Post endpoints
app.post("/home/creategroup", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newGroup = await new Group({ title, description }).save();
    res.status(201).json({ response: newGroup, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.post("/home/task", async (req, res) => {
  const { title, description, group } = req.body;

  try {
    const newTask = await new Task({
      title,
      description,
    }).save();
    await Group.findByIdAndUpdate(group, {
      $push: {
        task: newTask,
      },
    });

    res.status(201).json({ response: newTask, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const salt = bcrypt.genSaltSync();

    if (password.length < 5) {
      throw "Password must be at least 5 characters long";
    }

    const newUser = await new User({
      username,
      password: bcrypt.hashSync(password, salt),
      email,
    }).save();

    res.status(201).json({
      response: {
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
        accessToken: newUser.accessToken,
      },
      success: true,
    });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Signin endpoint
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        response: {
          userId: user._id,
          username: user.username,
          email: user.email,
          accessToken: user.accessToken,
        },
        success: true,
      });
    } else {
      res.status(404).json({
        response: "Username or password doesn't match",
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Delete Task by Id
app.delete("/home/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (deletedTask) {
      res.status(200).json(deletedTask);
    } else {
      res.status(404).json({ response: "Task not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Patch Task
app.patch("/home/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ response: "Thought not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
