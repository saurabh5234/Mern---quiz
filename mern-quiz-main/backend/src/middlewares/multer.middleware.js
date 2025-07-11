import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // For generating unique filenames
import fs from "fs";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create tmp directory if it doesn't exist
    if (!fs.existsSync("/tmp")) {
      fs.mkdirSync("/tmp", { recursive: true });
    }
    cb(null, "/tmp");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

export const upload = multer({ storage });
