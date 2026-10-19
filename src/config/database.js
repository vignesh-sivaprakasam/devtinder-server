const mongoose = require("mongoose");

const dns = require("dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = async () =>
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);

module.exports = connectDB;
