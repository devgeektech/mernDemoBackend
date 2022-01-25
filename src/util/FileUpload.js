import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import Handlebars from 'handlebars';
import moment from 'moment';

export const resizeImage = async (sourcePath, destinationPath, width) => {
  const lenna = await Jimp.read(sourcePath);
  lenna.resize(width, Jimp.AUTO).quality(100).write(destinationPath); // save
  return true;
};

/**
|--------------------------------------------------
| Upload Profile Image
|--------------------------------------------------
*/
export const uploadImage = ({ stream, filename }) => {
  const uploadDir = path.join(__dirname, '../..', 'assets', 'image');
  filename = filename.replace(', (?=[^(]*\\))', ''); //replace(/\s/g, ''); // remove space from file name
  filename = `${Date.now()}`; //${filename}`
  const imagePath = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(imagePath);
        reject(error);
      })
      .pipe(fs.createWriteStream(imagePath))
      .on('error', (error) => reject(error))
      .on('finish', () => resolve({ imagePath, filename }))
  );
};

/**
|--------------------------------------------------
| Upload Documents
|--------------------------------------------------
*/

export const uploadDocument = ({ stream, filename, uploadfilename }) => {
  const uploadDir = path.join(__dirname, '../..', 'assets', 'documents');
  uploadfilename = filename.replace(/\s/g, ''); //replace(/\s/g, ''); // remove space from file name
  filename =
    uploadfilename == 'blob'
      ? `${Date.now()}-${uploadfilename}.pdf`
      : `${Date.now()}-${uploadfilename}`; /* ${Date.now()} */

  const docPath = `${uploadDir}/${filename}`;
  let filesize = 0;
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(docPath);
        reject(error);
      })
      .on('data', (chunk) => {
        filesize += chunk.length;
      })
      .pipe(fs.createWriteStream(docPath))
      .on('error', (error) => reject(error))
      .on('finish', () =>
        resolve({ docPath, filename, uploadfilename, filesize })
      )
  );
};

export const ImageUploadPath = path.join('/', 'assets', 'image');
export const ThumbnailImageUploadPath = path.join(
  ImageUploadPath,
  'thumbnailImages'
);
export const DocumentUploadPath = path.join('/', 'assets', 'documents');
