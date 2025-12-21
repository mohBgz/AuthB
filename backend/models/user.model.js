import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

    role: {
      type: String,
      enum: ["developer", "user"],
      default: "user",
    },
    appId: { //the reference to the developer-created app that this regular user uses.
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientApp",
      required: function () {
        return this.role === "user";
      },
    },
  },
  { timestamps: true }

  //by adding timestamps:true, createdat and updatedat feilds will be automatically added into the document
);

export const User = mongoose.model("User", userSchema);
