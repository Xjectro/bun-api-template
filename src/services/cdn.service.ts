import axios from 'axios';
import fs from 'fs';

const { BUNNY_ACCESS_KEY,BUNNY_STORAGE_NAME,BUNNY_HOST_NAME } = process.env;

export const uploadFile = async (file: any) => {
  const fileStream = fs.createReadStream(file.path);
  const uniqueFilename = `${Date.now()}-${file.filename}-${file.originalname}`;

  const response = await axios.put(`https://${BUNNY_HOST_NAME}/${BUNNY_STORAGE_NAME}/${uniqueFilename}`, fileStream, {
    headers: {
      AccessKey: BUNNY_ACCESS_KEY,
    },
  });

  if (response.data) {
    return `https://${BUNNY_STORAGE_NAME}.b-cdn.net/${uniqueFilename}`;
  } else {
    return false;
  }
};
