/** @format */
import { Schema, model } from "mongoose";
const schema = new Schema({
  userId: { type: String, default: "" },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  role: {
    type: String,
    default: "User",
    enum: ["SuperAdmin", "User"],
  },
  email: { type: String, default: null },
  phoneNumber: { type: String, default: null },
  audio: { type: String, default: null },
  password: { type: String, default: null },
  setPasswordId: { type: String, default: "" },
  createdBy: { type: Schema.Types.ObjectId, ref: "Users" },
  createdAt: { type: Date, default: Date.now },
  modifiedBy: { type: Schema.Types.ObjectId, ref: "Users" },
  modifiedAt: { type: Date, default: Date.now },
});

module.exports = model("Users", schema);
