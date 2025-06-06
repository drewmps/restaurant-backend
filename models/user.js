"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Cuisine, { foreignKey: "authorId" });
    }

    toJSON() {
      return {
        email: this.email,
        username: this.username,
      };
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "email is already registered",
        },
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "email is required",
          },
          notNull: {
            msg: "email is required",
          },
          isEmail: {
            msg: "email must be of format email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "password is required",
          },
          notNull: {
            msg: "password is required",
          },
          len: {
            args: [5, Infinity],
            msg: "minimal password length is 5 characters",
          },
        },
      },
      role: { type: DataTypes.STRING, defaultValue: "Staff" },
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((user) => {
    const hashedPassword = hashPassword(user.password);
    user.password = hashedPassword;
  });
  return User;
};
