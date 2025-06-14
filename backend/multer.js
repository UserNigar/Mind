import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/photos');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName); // 🔥 Sadəcə filename saxla, path YOX
  }
});
export const customizedMulter = multer({ storage });


const editPhoto = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/photos')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(file.originalname)
      cb(null, uniqueSuffix + ext)
    }
})
export const updateProfilePhoto = multer({ storage:editPhoto })
