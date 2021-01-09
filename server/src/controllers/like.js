const { Author, Like } = require("../../models");
const Joi = require("joi");

// =================================================================================
// ADD LIKE
// =================================================================================

exports.addLike = async (req, res) => {
  const { postId } = req.params;
  const { user } = req;
  try {
    const schema = Joi.object({
      authorId: Joi.number().required(),
      postId: Joi.number().required(),
    });

    const { error } = schema.validate({ authorId: user.id, postId }, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const check = await Like.findOne({
      where: { postId, authorId: user.id },
    });

    if (check) {
      return res.status(400).json({
        status: "failed",
        message: "Post already liked",
      });
    }

    const like = await Like.create({
      postId,
      authorId: user.id,
    });

    const response = await Like.findOne({
      where: { id: like.id },
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json({
      status: "success",
      message: "Liked Successfully",
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
// DELETE LIKE
// =================================================================================

exports.deleteLike = async (req, res) => {
  const { postId } = req.params;
  const { user } = req;
  try {
    const like = await Like.destroy({ where: { authorId: user.id, postId } });

    if (!like) {
      return res.status(400).json({
        status: "failed",
        message: "Post not liked yet",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Disliked successfully",
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
