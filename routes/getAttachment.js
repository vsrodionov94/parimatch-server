const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');
const FormData = require('form-data');
const User = require('../models/user');

const getImagesArray = array => {
  const images = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] && array[i].correctly) {
      images.push({ input: fs.readFileSync(`${__dirname}/images/${i}.png`) });
    }
  }
  return images;
};

const compositeImage = async questions => {
  const base = fs.readFileSync(`${__dirname}/images/base.png`);
  const images = getImagesArray(questions);
  try {
    return sharp(base)
      .composite(images)
      .toBuffer();
  } catch (error) {
    console.log(error);
  }
  return '';
};

const loadImage = async (url, image) => {
  const formData = new FormData();
  formData.append('photo', image, 'image.png');

  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
    },
  });
  return response.data;
};

module.exports = app => {
  app.post('/getAttachment', async (req, res) => {
    let response;

    const { vkId, url } = req.body;

    const user = await User.findOne({ vkId }).then(found => found);
    if (user) {
      const image = await compositeImage(user.questions);
      if (image) {
        response = await loadImage(url, image);
      }
    }
    res.json(response);
  });
};
