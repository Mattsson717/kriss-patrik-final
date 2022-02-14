import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

//setting up local database
const mongoUrl = process.env.MONGO_URL || "MONGO_URL";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});
mongoose.Promise = Promise;

// ******** Schemas ******** //
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
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "task",
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
    unique: true,
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
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
const Group = mongoose.model("Group", GroupSchema);

// Model to create task
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  taken: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Task = mongoose.model("Task", TaskSchema);

// ******** Defined Port ******** //
const port = process.env.PORT || 9000;
const app = express();

// ******** Middlewear ******** //
app.use(cors());
app.use(express.json());

// ******** Authentication function ******** //.
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");

  try {
    const user = await User.findOne({ accessToken });
    if (user) {
      next();
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

// ******** ENDPOINTS ******** //
// GET endpoints
app.get("/", (req, res) => {
  res.send("Start");
});

app.get("/home", authenticateUser);
app.get("/home", async (req, res) => {
  res.send("Home");
});

// Get all tasks by USER ID --- WORKS!
app.get("/tasks/:userId", authenticateUser);
app.get("/tasks/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ user: userId })
      .populate("user")
      .sort({ createdAt: "desc" });
    res.status(201).json({ response: tasks, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// GET GROUPS by USER ID --- WORKS!
app.get("/groups/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const queriedGroup = await Group.find({ user: { $in: [userId] } })
      .populate("group")
      .sort({ createdAt: "desc" });
    if (queriedGroup) {
      res.status(200).json({ response: queriedGroup, success: true });
    } else {
      res.status(404).json({ response: "User not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// GET TASKS by GROUP ID --- WORKS!
app.get("/tasks/group/:groupId", async (req, res) => {
  const { groupId } = req.params;

  try {
    const queriedGroup = await Group.findById(groupId).populate("task");

    if (queriedGroup) {
      res.status(200).json({ response: queriedGroup.task, success: true });
    } else {
      res.status(404).json({ response: "User not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// POST endpoints
// Create new GROUP AND attatch the logged in USER to that GROUP --- WORKS!
app.post("/group/user/:userId", async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.params;

  try {
    const queriedUser = await User.findById(userId);
    const newGroup = await new Group({
      title,
      description,
      user: queriedUser,
    }).save();

    res.status(200).json({ response: newGroup, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Create new TASK and push it into the GROUP --- WORKS!
app.post("/task/group/:groupId", async (req, res) => {
  const { title, description } = req.body;
  const { groupId } = req.params;

  try {
    const queriedGroup = await Group.findById(groupId);
    if (queriedGroup) {
      const newTask = await Task({
        title,
        description,
      }).save();
      if (newTask) {
        const updatedGroup = await Group.findByIdAndUpdate(
          groupId,
          {
            $push: {
              task: newTask,
            },
          },
          { new: true }
        ).populate("task");
        res.status(200).json({ response: updatedGroup.task, success: true });
      }
    } else {
      res.status(404).json({ response: "Group not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: "Title aldready exist", success: false });
  }
});

// SIGNUP endpoint --- WORKS!
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

// SIGNIN endpoint --- WORKS!
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

// DELETE endpoints
// Delete Task by Id --- WORKS!
app.delete("/tasks/:taskId", async (req, res) => {
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

// Delete Group by Id --- WORKS!
app.delete("/groups/:groupId", async (req, res) => {
  const { groupId } = req.params;

  try {
    const deletedGroup = await Group.findByIdAndDelete(groupId);
    if (deletedGroup) {
      res.status(200).json(deletedGroup);
    } else {
      res.status(404).json({ response: "Group not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// PATCH endpoints
// Patch Task by Id --- WORKS!
app.patch("/tasks/:taskId", async (req, res) => {
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

// Patch Group by Id --- WORKS!
app.patch("/group/:groupId", async (req, res) => {
  const { groupId } = req.params;

  try {
    const updatedGroup = await Group.findByIdAndUpdate(groupId, req.body, {
      new: true,
    });
    if (updatedGroup) {
      res.json(updatedGroup);
    } else {
      res.status(404).json({ response: "Group not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Attach USER to GROUPS --- WORKS!
app.patch("/user/:userId/groups/:groupId", async (req, res) => {
  const { userId, groupId } = req.params;

  try {
    const queriedGroup = await Group.findById(groupId);

    if (queriedGroup) {
      const queriedUser = await User.findById(userId);
      if (queriedUser) {
        const updatedGroup = await Group.findByIdAndUpdate(
          groupId,
          {
            $push: {
              user: queriedUser,
            },
          },
          { new: true }
        );

        res.status(200).json({ response: updatedGroup, success: true });
      } else {
        res.status(404).json({ response: "User not found", success: false });
      }
    } else {
      res.status(404).json({ response: "Group not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Attach USER to TASKS --- WORKS!
app.patch("/user/:userId/tasks/:taskId", async (req, res) => {
  const { userId, taskId } = req.params;

  try {
    const queriedTask = await Task.findById(taskId);

    if (queriedTask) {
      const queriedUser = await User.findById(userId);

      if (queriedUser) {
        const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          {
            $push: {
              user: queriedUser,
            },
          },
          { new: true }
        ).populate("user");

        res.status(200).json({ response: updatedTask, success: true });
      } else {
        res.status(404).json({ response: "User not found", success: false });
      }
    } else {
      res.status(404).json({ response: "Task not found", success: false });
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
