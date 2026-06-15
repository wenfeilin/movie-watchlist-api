import jwt from "jsonwebtoken";

// Generates JWT token and stores part of user in token --> used to identify/verify user = user id; sign JWT with server's personal secret key so others can't fake the JWT; pass this JWT w/ every request
export const generateToken = (userId, res) => {
  // payload = to be inserted into token
  const payload = { id: userId };

  // Transform into string of letters and numbers (can be converted back into obj)
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d", // pr default to 7 days
  });

  // Return cookie in response = setting cookie for user
  res.cookie("jwt", token, {
    httpOnly: true, // so user's browser can't use JS to access it
    secure: process.env.NODE_ENV === "production", // make secure only if in production
    sameSite: "strict", // stops browser from sending this cookie on cryside requests, which protects agaisnt CSRF attacks (common attack)
    maxAge: (1000 * 60 * 60 * 24) * 7, // max age of cookie (in ms); here, it is 7 dadys
  }); // name cookie and give it a value
  
  return token;
};
