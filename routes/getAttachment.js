const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');
const FormData = require('form-data');
const User = require('../models/user');

const getImagesArray = array => {
  const images = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] && array[i].correctly) {
      // images.push({ input: fs.readFileSync(`../images/${i}.png`) });
    }
  }
  return images;
};

const compositeImage = async questions => {
  // const base = fs.readFileSync(`${__dirname}/base.png`);
  const images = getImagesArray(questions);
  try {
    return sharp({
      create: {
        width: 300,
        height: 200,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 0.5 }
      }
    })
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

    const user = await User.findOne({ vkId }).then(found => found);
    if (user) {
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
