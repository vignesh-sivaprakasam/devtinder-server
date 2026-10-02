const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is incorrect status.",
      },
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  // Check if the from and to user IDs are the same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send a connection request to yourself.");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
