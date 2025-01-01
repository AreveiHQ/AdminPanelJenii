const mongoose = require('mongoose');

const homepageSchema = new mongoose.Schema({
  desktopBannerImage: {
    type: String,
    required: true,
  },
  mobileBannerImage: {
    type: String,
    required: true,
  },
  links: {
    type: String,
    required: true,
  },
  section:{
    type: String,
    enum:["hero-slider","about-slider"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Home = mongoose.models.Homepage||mongoose.model('Homepage', homepageSchema);
module.exports = Home;