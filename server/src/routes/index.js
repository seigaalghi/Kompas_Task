const express = require("express");
const { register, login } = require("../controllers/auth");
const { getPosts, getPostById, addPost, editPost, deletePost } = require("../controllers/post");
const { fileUpload } = require("../middlewares/fileUpload");
const { auth } = require("../middlewares/auth");
const router = express.Router();

// =============================================================
// Auth
// =============================================================

router.post("/auth/register", register);
router.post("/auth/login", login);

// =============================================================
// POST
// =============================================================

router.get("/post/all", getPosts);
router.get("/post/:id", getPostById);
router.post("/post", auth, fileUpload("image"), addPost);
router.patch("/post/:id", auth, fileUpload("image"), editPost);
router.delete("/post/:id", auth, deletePost);

module.exports = router;
