import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import { config } from "dotenv";
import bcrypt from "bcrypt";

config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

export const PORT = 8080;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/img`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const uploader = multer({ storage });

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const AuthRol = (req, res, next) => {
  if (req.session?.user) {
    if (
      req.session.user.email === "adminCoder@coder.com" &&
      bcrypt.compareSync("adminCod3r123", req.session.user.password)
    ) {
      req.session.user.role = "Admin";
      delete req.session.user.password;
      return next();
    }
    req.session.user.role = "User";
    delete req.session.user.password;
    return next();
  }
  return next();
};
