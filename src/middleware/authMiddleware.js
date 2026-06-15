import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  console.log("Auth middleware reached");

  // Read the token from the request
  let token;
  
  // Check both headers and cookies for JWT token
  // Has Authorization key and value starts w/ "Bearer" in req headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // ["Bearer", "JWT-token"]
  } else if (req.cookies?.jwt) { // cookies might be null so use `?`
    token = req.cookies.jwt
  }

  if (!token) {
    return res.status(401).json({error: "Not authorized, no token provided"});
  }

  try {
    // Verify token is valid and extract user ID by decoding JWT token b/c when generating token, we passed it in
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {id: decoded.id}
    });
    
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    // Attach user ID to request
    req.user = user;
    next(); // continue on to fulfulling request
  } catch (err) {
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
};

