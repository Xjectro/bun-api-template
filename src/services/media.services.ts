import axios from 'axios';
import fs from 'fs';
import { config } from '../constants';

const { hostName, accessKey, stroageName } = config.bunny;

export const uploadFile = async (file: any) => {
  const fileStream = fs.createReadStream(file.path);
  const uniqueFilename = `${Date.now()}-${file.filename}-${file.originalname}`;

  const response = await axios.put(`https://${hostName}/${stroageName}/${uniqueFilename}`, fileStream, {
    headers: {
      AccessKey: accessKey,
    },
  });

  if (response.data) {
    return `https://${stroageName}.b-cdn.net/${uniqueFilename}`;
  } else {
    return false;
  }
};
