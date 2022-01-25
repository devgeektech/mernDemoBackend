/** @format */

import {
  UserModel,
} from "../../../models";

import { ObjectID } from "mongodb";
import { Messages, encrypt, generatePassword } from "../../../common";
import { Email, AvailiableTemplates } from "../../../util";
import { stringToDate } from "../../../util/User";

import moment from "moment";



const add = async (req, res) => {
  try {
    const { body } = req;
    if (req.file) {
      body.audio = "/uploads/" + req.file.filename;
    }
    const checkEmail = await UserModel.findOne(
      { email: body.email, role: "User" },
      { _id: 1 }
    );
    if (checkEmail) {
      return res.status(401).json({
        message: Messages.AlreadyExist.replace(":item", "Email"),
      });
    }
    const setPasswordLink = encrypt(generatePassword(10));
    body.setPasswordId = setPasswordLink;
    const count = await UserModel.countDocuments({
      role: "User",
    });

    body.userId = `WY${(count + 1).toString().padStart(4, "0")}`;
    const user = await UserModel.create(body);
    
    return res.status(200).json({
      message: Messages.Created.replace(":item", "User"),
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { query } = req;
    const { search } = query;
    const skip = parseInt(query.skip) || 0;
    const limit = parseInt(query.limit) || 10;
    const sortBy = query.sortBy;
    const order = query.order === "asc" ? 1 : -1;
    let sort = { _id: -1 };
    switch (sortBy) {
      case "name":
        sort = {
          firstName: order,
        };
        break;
      default:
        break;
    }
    let condition = {
      role: "User"
    };
    if (search) {
      condition["$or"] = [
        {
          firstName: {
            $regex: new RegExp(search.trim(), "i"),
          },
        },
      ];
    }
    
    const data = await UserModel.aggregate([
      {
        $match: condition,
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          audio: 1,
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    
    const totalRecords = await UserModel.aggregate([
      {
        $match: condition,
      },
      {
        $count: "count",
      },
    ]);
    return res.status(200).json({
      message: Messages.List.replace(":item", "User"),
      data,
      totalRecords:
        totalRecords && totalRecords.length ? totalRecords[0].count : 0,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const info = async (req, res) => {
  try {
    const { id } = req.params;
    let condition = { _id: ObjectID(id) };
    
    const data = await UserModel.aggregate([
      {
        $match: condition,
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          audio: 1,
        },
      },
    ]);
    return res.status(200).json({
      message: Messages.Info.replace(":item", "User"),
      data: data[0],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    let condition = { _id: ObjectID(id) };
    const checkUser = await UserModel.findOne(condition);
    if (!checkUser) {
      return res.status(401).json({
        message: Messages.NotExist.replace(":item", "User"),
      });
    }
    await UserModel.deleteOne(condition);
    
    return res.status(200).json({
      message: Messages.DeleteSuccess.replace(":item", "User"),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const uploadAudio = async (req, res) => {
  return res.status(200).json("/uploads/" + req.file.filename);
};

const update = async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;
    if (req.file) {
      body.audio = "/uploads/" + req.file.filename;
    }
    const checkExist = await UserModel.findOne({
      _id: ObjectID(id),
    });
    if (!checkExist) {
      return res.status(401).json({
        message: Messages.NotExist.replace(":item", "User"),
      });
    }
    const checkDuplicateEmail = await UserModel.findOne(
      { _id: { $ne: ObjectID(id) }, email: body.email, role: "User" },
      { _id: 1 }
    );
    if (checkDuplicateEmail) {
      return res.status(401).json({
        message: Messages.AlreadyExist.replace(":item", "Email"),
      });
    }
    body.emergency = {
      firstName: body["emergency.0.firstName"],
      lastName: body["emergency.0.lastName"],
      relationship: body["emergency.0.relationship"],
      email: body["emergency.0.email"],
      phoneNumber: body["emergency.0.phoneNumber"],
    };
    body.dateOfBirth = stringToDate(body.dateOfBirth);
    await UserModel.update({ _id: ObjectID(id) }, body);
    
    return res.status(200).json({
      message: Messages.Updated.replace(":item", "User"),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  add,
  list,
  info,
  deleteUser,
  uploadAudio,
  update,
};
