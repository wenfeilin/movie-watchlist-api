import { prisma } from "../config/db.js"; // this is just the one u have to use
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// Require name, email, password
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists (look in user table)
  const userExists = await prisma.user.findUnique({
    // if there is a unique user where the email = one sent in request
    where: { email: email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "User already exists with this email" });
  }

  // Hash password sent by user (shouldn't store plain text of password = insecure)
  const salt = await bcrypt.genSalt(10); // representation of how hashed you want password to be
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user (in db)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // Note: can unhash a password, but for login, if hash two strings that are the same (same password), gets the hashed password every time
    },
  });

  // Generate JWT token
  const token = generateToken(user.id, res);

  // More detailed success response
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
      token, // pass JWT token
    },
  });
};

// For login, use JWTs (JSON web tokens) = small signed tokens that allow server to verify if user is who they are w/o storing session info on backend; way to verify credentials; good for authorization and authentication
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user email exists in user table
  const user = await prisma.user.findUnique({
    // if there is a unique user where the email = one sent in request
    where: { email: email },
  });

  if (!user) {
    // Prisma returns null if none found
    return res
      .status(401) // 401 Unauthorized
      .json({ error: "Invalid email or password" });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password); // compare plain text password sent by user and hashed password in user's table

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" }); // don't say password is specifically wrong; should be a bit vague with this error message
  }

  // Note: technically doesn't log user in; b/c when logging in, must generate token that represents taht instance of the user logged in = JWT token, which will then be used in every request we are going to make for the API to verify that this user is the one they say they are; have to generate token both on sign up and login

  // Generate JWT token
  const token = generateToken(user.id, res);

  // More detailed success response
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: email,
      },
      token, // pass JWT token
    },
  });
};

// Logout = removing cookie w/ JWT token
const logout = async(req, res) => {
  // Update cookie to nothing
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // expires rn
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { register, login, logout };
