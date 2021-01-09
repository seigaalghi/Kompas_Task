const { Author, Comment } = require("../../models");
const Joi = require("joi");

// =================================================================================
// ADD COMMENT
// =================================================================================

exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { user, body } = req;
  try {
    const schema = Joi.object({
      authorId: Joi.number().required(),
      postId: Joi.number().required(),
      comment: Joi.string().required(),
    });

    const { error } = schema.validate(
      { ...body, authorId: user.id, postId },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const comment = await Comment.create({
      postId,
      authorId: user.id,
      ...body,
    });

    const response = await Comment.findOne({
      where: { id: comment.id },
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
      message: "Your comment posted successfully",
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
// DELETE COMMENT
// =================================================================================

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await Comment.destroy({ where: { id } });

    res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
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
