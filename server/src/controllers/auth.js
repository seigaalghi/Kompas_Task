const { Author } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =================================================================================
// REGISTER
// =================================================================================

exports.register = async (req, res) => {
  const body = req.body;
  const { email, password } = body;
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({ ...body }, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const checkEmail = await Author.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.status(400).json({
        status: "failed",
        message: "Email already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const author = await Author.create({
      ...body,
      password: hashedPassword,
    });

    const payload = {
      id: author.id,
    };

    const response = await Author.findOne({
      where: { email: body.email },
      attributes: {
        exclude: ["updatedAt", "password"],
      },
    });

    jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 36000000000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        status: "success",
        message: "Registered successfully",
        data: {
          token,
          author: response,
        },
      });
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
// LOGIN
// =================================================================================

exports.login = async (req, res) => {
  const { body } = req;
  const { email, password } = body;
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({ ...body }, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const author = await Author.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    if (!author) {
      return res.status(400).json({
        status: "failed",
        message: "Wrong email or password",
      });
    }

    const validate = await bcrypt.compare(password, author.password);

    if (!validate) {
      return res.status(400).json({
        status: "failed",
        message: "Wrong email or password",
      });
    }

    const payload = {
      id: author.id,
    };

    const response = await Author.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["updatedAt", "password"],
      },
    });

    jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 36000000000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        data: {
          token,
          author: response,
        },
      });
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
// LoadUser
// =================================================================================

exports.loadUser = async (req, res) => {
  const { id } = req.user;
  try {
    const author = await Author.findOne({
      where: { id },
      attributes: {
        exclude: ["updatedAt", "password"],
      },
    });

    if (!author) {
      res.status(400).json({
        status: "failed",
        message: `User not found`,
      });
    }
    res.status(200).json({
      status: "success",
      message: "User loaded successfully",
      data: {
        author,
      },
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
