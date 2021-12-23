const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');
const FormData = require('form-data');
const User = require('../models/user');

const getImagesArray = array => {
  const images = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] && array[i].correctly) {
      images.push({ input: fs.readFileSync(`../images/${i}.png`) });
    }
  }
  return images;
};

const compositeImage = async questions => {
  const base = fs.readFileSync('../images/base.png');
  const images = getImagesArray(questions);
  try {
    return await sharp(base)
      .composite(images)
      .toBuffer();
  } catch (error) {
    console.log(error);
  }
  return '';
};

const getUrl = async token => {
  const method = 'photos.photos.getUploadServer';
  const GROUP_ID = 163544497;
  const ALBUM_ID = 251798458;
  const ver = '5.131';

  const response = await axios.get(`https://api.vk.com/method/${method}?access_token=${token}&group_id=${GROUP_ID}&album_id=${ALBUM_ID}&v=${ver}`);
  console.log(response.data);
  return response.data.response.upload_url;
};

const loadImage = async (url, image) => {
  const formData = new FormData();
  // formData.append('photo', image, 'image.png');

  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
    },
  });
  return response.data;
};

const saveImage = async (data, token) => {
  const method = 'photos.saveMessagesPhoto';
  const ver = '5.131';
  const {
    aid,
    server,
    photo,
    hash,
  } = data;
  const response = await axios.get(`https://api.vk.com/method/${method}?access_token=${token}&photo=${photo}&aid=${aid}&server=${server}&hash=${hash}&v=${ver}`);
  return response;
};

module.exports = app => {
  app.post('/getAttachment', async (req, res) => {
    const result = { error: false, attachment: '' };

    const { vkId, url } = req.body;

    const user = User.findOne({ vkId }).then(found => found);
    if (user) {
      const image = await compositeImage();
      console.log('image', image);
      if (image) {
        const response = await loadImage(url, image);
        console.log('response', response);
        if (response) {
          res.json(response);
        } else result.error = true;
      } else result.error = true;
    } else result.error = true;

    res.json(result);
  });
};
