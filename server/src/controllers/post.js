const { Author, Post, Tag, Comment, Like } = require("../../models");
const Joi = require("joi");

// =================================================================================
// GET POSTS
// =================================================================================

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: {
        exclude: ["updatedAt", "authorId"],
      },
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "tag"],
        },
        {
          model: Like,
          as: "likes",
          attributes: {
            exclude: ["updatedAt"],
          },
          include: {
            model: Author,
            as: "author",
            attributes: ["name"],
          },
        },
        {
          model: Comment,
          as: "comments",
          attributes: {
            exclude: ["updatedAt"],
          },
          include: {
            model: Author,
            as: "author",
            attributes: ["name"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!posts) {
      return res.status(400).json({
        status: "failed",
        message: "The posts is empty",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Posts loaded successfully",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};

// =================================================================================
// GET POST BY ID
// =================================================================================

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({
      where: { id },
      attributes: {
        exclude: ["updatedAt", "authorId"],
      },
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["id", "name"],
        },
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "tag"],
        },
        {
          model: Like,
          as: "likes",
          attributes: {
            exclude: ["updatedAt"],
          },
          include: {
            model: Author,
            as: "author",
            attributes: ["name"],
          },
        },
        {
          model: Comment,
          as: "comments",
          attributes: {
            exclude: ["updatedAt"],
          },
          include: {
            model: Author,
            as: "author",
            attributes: ["name"],
          },
        },
      ],
      order: [
        ["createdAt", "DESC"],
        [{ model: Comment, as: "comments" }, "createdAt", "DESC"],
      ],
    });

    if (!post) {
      return res.status(400).json({
        status: "failed",
        message: `No post found with id of ${id}`,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Post loaded successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};

// =================================================================================
// ADD POST
// =================================================================================

exports.addPost = async (req, res) => {
  const { body, user, files } = req;
  console.log(body.tag);
  try {
    const schema = Joi.object({
      authorId: Joi.number().required(),
      title: Joi.string().required(),
      image: Joi.string().required(),
      body: Joi.string().required(),
      tag: Joi.exist(),
    });

    const { error } = schema.validate(
      { ...body, authorId: user.id, image: files.image[0].filename },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const post = await Post.create({
      ...body,
      authorId: user.id,
      image: files.image[0].filename,
    });

    if (!post) {
      return res.status(400).json({
        status: "failed",
        message: `Failed to make post, please try again`,
      });
    }

    if (body.tag) {
      await Promise.all(body.tag.map((tg) => Tag.create({ postId: post.id, tag: tg })));
    }

    const response = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: {
            exclude: ["password", "updatedAt"],
          },
        },
        {
          model: Author,
          as: "author",
          attributes: {
            exclude: ["password", "updatedAt"],
          },
        },
      ],
    });

    res.status(200).json({
      status: "success",
      message: "Post posted successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};

// =================================================================================
// EDIT POST
// =================================================================================

exports.editPost = async (req, res) => {
  const { id } = req.params;
  const { body, files, user } = req;
  try {
    const schema = Joi.object({
      title: Joi.string(),
      image: Joi.exist(),
      body: Joi.string(),
    });

    const { error } = schema.validate(
      { ...body, image: files.image ? files.image[0].filename : null },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const old = await Post.findOne({
      where: { id },
    });

    if (old.dataValues.authorId !== user.id) {
      return res.status(400).json({
        status: "failed",
        message: `You can't edit a post that not yours`,
      });
    }

    const post = await Post.update(
      {
        ...body,
        image: files.image ? files.image[0].filename : old.dataValues.image,
      },
      { where: { id } }
    );

    if (!post) {
      return res.status(400).json({
        status: "failed",
        message: `Failed to make post, please try again`,
      });
    }

    const response = await Post.findOne({
      where: { id },
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: {
            exclude: ["password", "updatedAt"],
          },
        },
        {
          model: Author,
          as: "author",
          attributes: {
            exclude: ["password", "updatedAt"],
          },
        },
      ],
    });

    res.status(200).json({
      status: "success",
      message: "Post posted successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};

// =================================================================================
// DELETE POST
// =================================================================================

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await Post.findOne({ where: { id } });

    if (check.dataValues.authorId !== req.user.id) {
      return res.status(400).json({
        status: "failed",
        message: `You can't delete a post that not yours`,
      });
    }

    const post = await Post.destroy({ where: { id } });

    if (!post) {
      return res.status(400).json({
        status: "failed",
        message: `Failed to delete the post, please try again`,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};
