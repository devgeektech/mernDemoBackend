import { UserModel } from "../models";

let onlineUsersList = [];

export const checkStatus = async (id) => {
  await UserModel.updateOne({ _id: id });
  const onlineUser = onlineUsersList.findIndex((user) => user.id === id);
  if (onlineUser == -1) {
    onlineUsersList.push({ id: id, lastUpdate: new Date() });
    return;
  }
  onlineUsersList.splice(onlineUser, 1, { id: id, lastUpdate: new Date() });
};

export const updateStatus = () => {
  console.log("onlineUsersList", onlineUsersList);
  onlineUsersList.map(async (activeUser) => {
    const time = new Date() - activeUser.lastUpdate;
    if (time / 60000 > 5) {
      await UserModel.updateOne(
        { _id: activeUser.id },
        
      );
      onlineUsersList = onlineUsersList.filter(
        (user) => user.id !== activeUser.id
      );
    }
  });
};
