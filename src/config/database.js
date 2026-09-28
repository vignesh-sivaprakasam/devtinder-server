const mongoose = require("mongoose");

const dns = require("dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = async () =>
  await mongoose.connect(
    "mongodb+srv://mvignesh3113_db_user:SAZu75KIBZuL2BLV@namastenode.xrlimnq.mongodb.net/devTinder",
  );

module.exports = connectDB;
