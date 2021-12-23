// const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');
const FormData = require('form-data');
const User = require('../models/user');

const getImagesArray = array => {
  const images = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] && array[i].correctly) {
      images.push({ input: `../images/${i}.png` });
    }
  }
  return images;
};

const compositeImage = async questions => {
  const base = '../images/base.png';
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

const loadImage = async (url, image) => {
  const formData = new FormData();
  formData.append('file1', image, 'image.png');

  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
    },
  });
  return response.data;
};

module.exports = app => {
  app.post('/getAttachment', async (req, res) => {
    const result = { error: false, attachment: '' };

    const { vkId, url } = req.body;

    const user = User.findOne({ vkId }).then(found => found);
    if (user) {
      console.log(user);
      const image = await compositeImage(user.questions);
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
