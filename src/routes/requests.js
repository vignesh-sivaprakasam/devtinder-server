const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

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

      const toUser = await UserModel.findById(toUserId);
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

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatuses = ["accepted", "rejected"];
      // status validation
      if (!allowedStatuses.includes(status)) {
        throw new Error(
          "Invalid status. Please choose from accepted or rejected.",
        );
      }

      const connectionRequest =
        await ConnectionRequestModel.findById(requestId);
      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found.",
        });
      }

      if (!connectionRequest.toUserId.equals(loggedInUser._id)) {
        return res.status(401).json({
          message: "You are not authorized to update this connection request.",
        });
      }

      if (connectionRequest.status !== "interested") {
        throw new Error("Invalid connection request status.");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `Connection request ${status}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  },
);

module.exports = requestRouter;
