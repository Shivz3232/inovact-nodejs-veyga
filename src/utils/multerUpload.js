const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const multerUpload = async (req, res, next) => {
  const oldBody = req.body;

  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        errorCode: 'BAD_REQUEST',
        errorMessage: err.message,
      });
    }

    req.body = {
      ...req.body,
      ...oldBody,
    };

    next();
  });
};

module.exports = multerUpload;
