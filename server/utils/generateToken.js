import jwt from "jsonwebtoken";

const generateToken = (userId, role = "user") => {
  return jwt.sign(
    {
      id: userId,
      _id: userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;
