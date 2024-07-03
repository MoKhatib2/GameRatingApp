const multer = require('multer');
const path = require('path');
const fs = require('fs');

// const imagesDir = path.join(__dirname, 'src', 'images');
// if (!fs.existsSync(imagesDir)) {
//     fs.mkdirSync(imagesDir, { recursive: true });
// }

const diskStorage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, 'src/images');
        },
        filename: (req, file, cb) => {
            const mimeType = file.mimetype.split('/');
            const fileType = mimeType[1];
            const fileName = file.originalname + '.' + fileType;
            cb(null, fileName);
        }
    }
)

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false)
}

const storage = multer({storage: diskStorage, fileFilter: fileFilter}).single('image');

module.exports = storage;