const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatuses = ["ignored", "interested"];

      if (!allowedStatuses.includes(status)) {
        throw new Error(
          "Invalid status. Please choose from ignored or interested.",
        );
      }

      const toUser = await User.findById(toUserId);
      console.log("toUser: ", toUser);
      if (!toUser) {
        return res.status(404).json({
          message: "The user you are trying to connect with does not exist.",
        });
      }

      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        throw new Error("Connection request already sent.");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName}, ${toUser.firstName} - ${status}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  },
);

module.exports = requestRouter;
