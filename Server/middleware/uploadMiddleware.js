const multer = require('multer');
const path = require('path');

// Storage logic: Chobi kothay ar ki naame save hobe
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/blogs/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // Max 3MB
});

module.exports = upload;