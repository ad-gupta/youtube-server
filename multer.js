import multer from "multer";

const storage = multer.memoryStorage()

const multiUpload = multer({storage})

export default multiUpload;