"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.Author, { as: "author", foreignKey: "authorId" });
      Post.hasMany(models.Tag, { as: "tags", foreignKey: "postId" });
      Post.hasMany(models.Like, { as: "likes", foreignKey: "postId" });
      Post.hasMany(models.Comment, { as: "comments", foreignKey: "postId" });
    }
  }
  Post.init(
    {
      authorId: DataTypes.INTEGER,
      body: DataTypes.TEXT,
      title: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
