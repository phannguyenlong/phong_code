
import jwt from 'jsonwebtoken';

const JWT_SECRET = "very_Secret_one_from_nam_phong_le"; // Replace with your actual secret key

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

export default generateToken;