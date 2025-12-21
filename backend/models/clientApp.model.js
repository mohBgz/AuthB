import mongoose from "mongoose";

const clientAppSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    apiKeyHash: {
      type: String,
      required: true,
      unique: true,
    },
    

    ownerId: {
      // who owns this app (developer)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status :{
      type: String,
      enum : ["Active","Inactive"],
      default: "Active",
      required : true,
    }
  },
  { timestamps: true }
);

export const ClientApp = mongoose.model("ClientApp", clientAppSchema);
