import multer from 'multer'
import path from "path"
import fs from 'fs'


// Function to set dynamic storage path
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folderName = `uploads/${file.fieldname}`

        // Create folder if it doesn't exist
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, { recursive: true });
        }

        cb(null, folderName);
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
})

// File filter for allow only image
const fileFilter = (req, file, cb) =>{
    const allowedFileTypes = /jpeg|jpg|png|svg/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only images (JPEG, JPG, PNG, SVG) are allowed!"), false);
    }
}

const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter:fileFilter
})


export default upload