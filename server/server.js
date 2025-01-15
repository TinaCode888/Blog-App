const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true 
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer configuration for storing uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error("Only JPEG, JPG, and PNG images are allowed."));
        }
    }
});

// Session setup
app.use(session({
    secret: "MySecretKey",
    resave: false,
    saveUninitialized: false
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/MyBlogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed:", err));

// Mongoose schemas
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const blogSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    content: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
});

// Plugins
userSchema.plugin(passportLocalMongoose);

// Models
const User = mongoose.model("User", userSchema);
const Blog = mongoose.model("Blog", blogSchema);

// Passport-local setup
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Utility function to delete a file
function deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

// Routes
app.post("/register", (req, res) => {
    const { username, password, confirmPwd } = req.body;

    if (password !== confirmPwd) {
        return res.json({ success: false, message: "Passwords do not match." });
    }

    User.register(new User({ username }), password, (err, user) => {
        if (err) {
            return res.json({ success: false, message: "Registration failed: " + err.message });
        }
        req.login(user, (loginErr) => {
            if (loginErr) return res.json({ success: false, message: "Login after registration failed." });
            res.json({ success: true, message: "Registered and logged in successfully." });
        });
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ success: false, message: "Username and password are required." });
    }

    passport.authenticate("local", (err, user) => {
        if (err || !user) {
            return res.json({ success: false, message: "Invalid username or password." });
        }
        req.login(user, (loginErr) => {
            if (loginErr) return res.json({ success: false, message: "Login failed." });
            res.json({ success: true, message: "Logged in successfully."});
        });
    })(req, res);
});

app.post("/blog/add", upload.single("image"), (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({ success: false, message: "You must be logged in to create a blog." });
    }

    const { title, content } = req.body;

    if (!title || !content) {
        return res.json({ success: false, message: "Title and content are required." });
    }

    const newBlog = new Blog({
        author: req.user._id,
        title,
        content,
        image: req.file ? `/uploads/${req.file.filename}` : null
    });

    newBlog.save()
        .then(savedBlog => res.json({ success: true, message: "Blog created successfully.", blog: savedBlog }))
        .catch(err => res.json({ success: false, message: "Failed to create blog." }));
});

app.put("/blog/edit/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        // Delete the old image if a new one is uploaded
        if (req.file && blog.image) {
            deleteFile(path.join(__dirname, blog.image));
        }

        const updateFields = {};
        if (title) updateFields.title = title;
        if (content) updateFields.content = content;
        if (imagePath) updateFields.image = imagePath;

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedBlog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        res.json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
    } catch (err) {
        console.error("Error updating the blog:", err);
        res.json({ success: false, message: "Server error" });
    }
});

app.post("/blog/delete", async (req, res) => {
    const { id } = req.body;

    try {
        const blog = await Blog.findById(id);
        if (blog) {
            // Delete the associated image
            if (blog.image) {
                deleteFile(path.join(__dirname, blog.image));
            }

            await Blog.findByIdAndDelete(id);
            res.json({ success: true, message: "Blog deleted successfully." });
        } else {
            res.json({ success: false, message: "Blog not found." });
        }
    } catch (err) {
        res.json({ success: false, message: "Blog deletion failed." });
    }
});

app.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "username");
        blogs.forEach(blog => {
            if (blog.image) {
                blog.image = `http://localhost:3001${blog.image.replace(/\\/g, "/").replace(/\/\//g, "/")}`;
            }
        });
        res.json({ blogs });
    } catch (err) {
        res.json({ error: "Failed to fetch all blogs." });
    }
});

app.get('/blogs/post/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id).populate("author", "username");
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        if (blog.image) {
            blog.image = `http://localhost:3001${blog.image.replace(/\\/g, "/").replace(/\/\//g, "/")}`;
        }

        res.json({ success: true, blog: blog });
    } catch (err) {
        console.error("Error updating the blog:", err);
        res.json({ success: false, message: "Server error" });
    }
});

app.get("/user/blogs", async (req, res) => {
    try {
        const userId = req.user._id;
        const blogs = await Blog.find({ author: userId }).populate("author", "username");

        blogs.forEach(blog => {
            if (blog.image) {
                blog.image = `http://localhost:3001${blog.image.replace(/\\/g, "/").replace(/\/\//g, "/")}`;
            }
        });

        res.json({ blogs });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch your blogs." });
    }
});

app.post("/logout", (req, res) => {
    try {
        res.clearCookie("token", { path: "/" });
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Logout failed." });
    }
});

// Start server
app.listen(3001, () => console.log("Server started on port 3001"));
