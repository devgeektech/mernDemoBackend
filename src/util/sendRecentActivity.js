const sendRecentActivity = (activity) => {
  const admin = allSocketConnections
    .filter((user) => user.userRole === "SuperAdmin")
    .map((admin) => admin.socketId);
  console.log("admin", admin);
  global.io.to(admin).emit("recentActivity", activity);
};

export default sendRecentActivity;
