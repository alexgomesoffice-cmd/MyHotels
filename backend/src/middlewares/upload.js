import multer from "multer";
import path from "path";
import fs from "fs";

/* ENSURE UPLOADS FOLDER EXISTS */
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* STORAGE CONFIG */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, filename);
  },
});

/* FILE FILTER */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

/* 👇 THIS IS WHAT YOUR ROUTES EXPECT */
export const upload = multer({
  storage,
  fileFilter,
});
