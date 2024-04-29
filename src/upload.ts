import multer, { Options } from "multer";
import path from "path";
import { v4 } from "uuid";
import fs from "fs";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const UPLOADS_PATH = path.join(__dirname, "/uploads/");

if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdir(UPLOADS_PATH, null, (err) => {
    if (err) {
      console.error("Something went wrong with creating uploads folder", err);
    }
    console.log("Uploads folder created!");
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "/uploads/"));
  },
  filename(_req, file, cb) {
    const type = file.mimetype.split("/")[1];
    const splited = file.originalname.split(".");
    const name = splited.slice(0, splited.length - 1).join("");
    const fileName = `${name}-${v4()}.${type}`;
    cb(null, fileName);
  },
});

const upload_options: Options = {
  storage,
  limits: { fileSize: 5_000_000 },
  fileFilter(req, file, cb) {
    if (ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
};

export const upload = multer(upload_options);
