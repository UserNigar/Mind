import { userModel } from "../model/productModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsersService = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerService = async (req, res) => {
  try {
    const { username, password, email, name, surname } = req.body;
    const photoPath = req.file?.filename;

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      name,
      surname,
      email,
      password: hashedPassword,
      photo: photoPath,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginService = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // JWT yarat – müddət 1 dəqiqə (60 saniyə)
    const token = jwt.sign(
      { user: { id: user._id, username: user.username } },
      "nodejs",
      { expiresIn: "20d" }
    );

    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      message: "Login successful",
      user: userData,
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
