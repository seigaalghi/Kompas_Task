const express = require("express");
const { register, login, loadUser } = require("../controllers/auth");
const { getPosts, getPostById, addPost, editPost, deletePost } = require("../controllers/post");
const { addComment, deleteComment } = require("../controllers/comment");
const { addLike, deleteLike } = require("../controllers/like");
const { fileUpload } = require("../middlewares/fileUpload");
const { auth } = require("../middlewares/auth");
const { fileDownload } = require("../controllers/file");
const router = express.Router();

// =============================================================
// Auth
// =============================================================

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth", auth, loadUser);

// =============================================================
// POST
// =============================================================

router.get("/post/all", getPosts);
router.get("/post/:id", getPostById);
router.post("/post", fileUpload("image"), auth, addPost);
router.patch("/post/:id", auth, fileUpload("image"), editPost);
router.delete("/post/:id", auth, deletePost);

// =============================================================
// COMMENT
// =============================================================

router.post("/post/comment/:postId", auth, addComment);
router.delete("/post/comment/:id", auth, deleteComment);

// =============================================================
// LIKE
// =============================================================

router.post("/post/like/:postId", auth, addLike);
router.delete("/post/like/:postId", auth, deleteLike);

// =============================================================
// FILE
// =============================================================

router.get("/file/:file", fileDownload);

module.exports = router;
