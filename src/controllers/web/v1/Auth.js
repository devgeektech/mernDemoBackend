/** @format */

import { UserModel } from "../../../models";
import {
  comparePassword,
  encryptPassword,
  encrypt,
  generatePassword,
  Messages,
} from "../../../common";
import { Email, AvailiableTemplates } from "../../../util";
import jwt from "jsonwebtoken";
import { ObjectID } from "mongodb";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({
      email: { $regex: new RegExp("^" + email, "i") },
      role: "SuperAdmin",
    });
    if (!user) {
      return res.status(401).json({
        message: Messages.EmailNotFound,
      });
    }
    if (!comparePassword(password, user.password)) {
      return res.status(401).json({
        message: Messages.PassNotMatch,
      });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "70d",
      }
    );

    const lastLogin = new Date();
    await UserModel.updateOne({ email }, { lastLogin });

    let userData = {
      token,
      ...user.toJSON(),
    };
    return res.status(200).json({
      message: Messages.LoginSuccess,
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const { userId } = req;
    const user = await UserModel.findById(userId, {
      _id: 0,
      firstName: 1,
      lastName: 1,
      phoneNumber: 1,
      email: 1,
      dateOfBirth: 1,
      gender: 1,
    });
    if (!user) {
      return res.status(404).json({
        message: Messages.UserNotFound,
      });
    }
    return res.status(200).json({
      message: "Profile fetched successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const {
      body: { oldPassword, newPassword },
      userId,
    } = req;
    const userData = await UserModel.findOne({
      _id: userId,
      role: "SuperAdmin",
    });
    if (!userData) {
      return res.status(400).json({
        message: Messages.UserNotFound,
      });
    }
    if (!comparePassword(oldPassword, userData.password)) {
      return res.status(400).json({
        message: Messages.OldPasswordNotMatch,
      });
    }
    const result = await UserModel.update(
      {
        _id: userId,
      },
      {
        $set: {
          password: encryptPassword(newPassword),
        },
      }
    );
    return res.status(200).json({
      message: Messages.PasswordUpdateSuccess,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { body, userId } = req;

    const userData = {
      email: body.email,
    };

    const isEmailExist = await UserModel.findOne({
      email: body.email,
      _id: {
        $ne: ObjectID(userId),
      },
      role: "SuperAdmin",
    });
    if (isEmailExist) {
      return res.status(400).json({
        message: Messages.AlreadyExist.replace(":item", "Email"),
      });
    }

    await UserModel.updateOne({ _id: userId, role: "SuperAdmin" }, userData);
    return res.status(200).json({
      message: Messages.Updated.replace(":item", "Profile"),
      data: body,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne(
      { email: { $regex: new RegExp("^" + email, "i") }, role: "SuperAdmin" },
      { email: 1, firstName: 1, lastName: 1 }
    );
    if (!user) {
      return res.status(401).json({
        message: Messages.EmailNotExist,
      });
    }

    const forgetLink = encrypt(generatePassword(10));
    await UserModel.updateOne({ _id: user._id }, { setPasswordId: forgetLink });

    const sendEmail = new Email();
    await sendEmail.setTemplate(AvailiableTemplates.FORGET_PASSWORD, {
      fullName: user.firstName + " " + user.lastName,
      userRole: "program site super admin",
      email: user.email,
      WebURL: process.env.API_URL,
      apiURL: process.env.API_URL,
      verificationLink: "reset-password/" + forgetLink,
    });
    await sendEmail.sendEmail(email);

    return res.status(200).json({
      message: Messages.ForgetSuccess,
      data: "",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const setPassword = async (req, res) => {
  try {
    const {
      body: { newPassword },
      params: { id },
    } = req;
    const userData = await UserModel.findOne(
      {
        setPasswordId: id,
        // role: 'SuperAdmin',
      },
      {
        password: 1,
      }
    );
    if (!userData) {
      return res.status(400).json({
        message: Messages.LinkExpired,
      });
    }
    const result = await UserModel.update(
      {
        _id: userData._id,
      },
      {
        $set: {
          password: encryptPassword(newPassword),
          setPasswordId: "",
        },
      }
    );
    return res.status(200).json({
      message: Messages.PasswordUpdateSuccess,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const userList = async (req, res) => {
  try {
    const { role } = req.query;
    const data = await UserModel.find(
      { role: role },
      { _id: 1, firstName: 1, lastName: 1 }
    );
    return res.status(200).json({
      message: Messages.List.replace(":item", "User"),
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  login,
  me,
  changePassword,
  update,
  forgetPassword,
  setPassword,
  userList,
};
