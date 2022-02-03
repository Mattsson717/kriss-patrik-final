import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

//Kriss is here

//setting up local database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final";
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
    required: true,
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

  //taken by: default none, later user id  (Possible to add helper or leave blank)

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

// ******** ENDPOINTS ******** //
// GET endpoints
app.get("/", (req, res) => {
  res.send("Start");
});

app.get("/home", authenticateUser);
app.get("/home", async (req, res) => {
  res.send("Home");
});

// Get all tasks by USER --- WORKS!
app.get("/tasks/:userId", authenticateUser);
app.get("/tasks/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ user: userId }).populate("user");
    res.status(201).json({ response: tasks, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// GET GROUPS by USERiD --- WORKS!
app.get("/groups/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const queriedGroup = await Group.find({ user: { $in: [userId] } }).populate(
      "group"
    );
    if (queriedGroup) {
      res.status(200).json({ response: queriedGroup, success: true });
    } else {
      res.status(404).json({ response: "User not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// GET GROUPS by GROUP ID --- WORKS
app.get("/groups/:groupId", async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    res.status(200).json({ response: group, success: true });
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
// Create new GROUP --- WORKS!
app.post("/group", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newGroup = await new Group({ title, description }).save();
    res.status(201).json({
      response: {
        groupId: newGroup._id,
        title: newGroup.title,
        description: newGroup.description,
      },
      success: true,
    });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// TEST CREATE GROUP AND ATTACH USER
// app.post("/group", async (req, res) => {
//   const { title, description, userId } = req.body;
//   try {
//     const queriedUser = await User.find({
//       user: { $in: userId.map((item) => item.text) },
//     });

//     const newGroup = await new Group({
//       title,
//       description,
//       userId: queriedUser,
//     }).save();
//     res.status(201).json({
//       response: {
//         groupId: newGroup._id,
//         title: newGroup.title,
//         description: newGroup.description,
//         userId: queriedUser,
//       },
//       success: true,
//     });
//   } catch (error) {
//     res.status(400).json({ response: error, success: false });
//   }
// });

// Create new TASK and push it into the GROUP --- WORKS!
app.post("/task", async (req, res) => {
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

// Is TAKEN --- WORKS!
app.patch("/tasks/:taskId/taken", async (req, res) => {
  const { taskId } = req.params;
  const { taken } = req.body;

  try {
    const updatedTaken = await Task.findOneAndUpdate(
      { _id: taskId },
      { taken },
      { new: true }
    );
    res.status(200).json({ response: updatedTaken, success: true });
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

// Insert task in group --- WORKS!
app.patch("/tasks/:taskId/groups/:groupId", async (req, res) => {
  const { groupId, taskId } = req.params;

  try {
    const queriedGroup = await Group.findById(groupId);

    if (queriedGroup) {
      const queriedTask = await Task.findById(taskId);

      if (queriedTask) {
        const updatedGroup = await Group.findByIdAndUpdate(
          groupId,
          {
            $push: {
              task: queriedTask,
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
        );

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
