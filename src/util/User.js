/** @format */
import { UserModel } from "../models";
import jwt from "jsonwebtoken";
import { checkStatus } from "./userStatus";

export const generateBaseId = async (role) => {
  const count = await UserModel.countDocuments({
    role,
  });

  let baseID = "";
  switch (role) {
    case "IndividualStudent":
      baseID = `UPS-SA-IS-${(count + 1).toString().padStart(4, "0")}`;
      break;
    case "ProgramSuperAdmin":
      baseID = `UPS-PSA-${(count + 1).toString().padStart(4, "0")}`;
      break;
    case "SchoolSuperAdmin":
      baseID = `UPS-SSA-${(count + 1).toString().padStart(4, "0")}`;
      break;
    case "ProgramSitesSuperAdmin":
      baseID = `UPS-PSSA-${(count + 1).toString().padStart(4, "0")}`;
      break;
    default:
      break;
  }
  return baseID;
};

export const verifyToken = async (req, res, next) => {
  // check header or url parameters or post parameters for token
  let token = req.headers["authorization"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    checkStatus(decoded.id);
    next();
  });
};

export const stringToDate = (string = "") => {
  if (string === "" || string === null) {
    return null;
  } else {
    const stringArr = string.split("/");
    return stringArr[2] + "-" + stringArr[1] + "-" + stringArr[0];
  }
};
