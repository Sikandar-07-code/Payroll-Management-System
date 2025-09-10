import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedDemoUser = async () => {
  try {
    await connectDB();

    const email = "hire-me@anshumat.org";
    const password = "HireMe@2025!";
    const name = "Demo User";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("✅ Demo user already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin", // we seed as Admin for testing
    });

    console.log("🎉 Demo user seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding demo user:", error.message);
    process.exit(1);
  }
};

seedDemoUser();
