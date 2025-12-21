import { User } from "../models/user.model.js";
import connectDB from "../db/connectDB.js";
import dotenv from "dotenv"

dotenv.config();

connectDB();

async function deleteAllUsers() {
    await User.deleteMany({});
}

deleteAllUsers();