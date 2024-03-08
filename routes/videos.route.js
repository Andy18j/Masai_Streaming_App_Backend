const express = require("express");
const multer = require("multer");
const { videoModel } = require("../model/video.model"); 

const videoRouter = express.Router();

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder where uploaded files will be stored
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Set the filename of the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create Multer instance with the storage configuration
const upload = multer({ storage: storage });

// Define route for uploading videos
videoRouter.post('/upload', upload.single('video'), async (req, res) => {
  try {
    // Extract file metadata
    const { filename, path, size, mimetype } = req.file;

    // Create a new video document with metadata
    const newVideo = new videoModel({
      filename,
      path,
      size,
      contentType: mimetype
    });

    // Save the video document to the database
    await newVideo.save();

    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'An error occurred while uploading the video' });
  }
});


videoRouter.get('/videos', async (req, res) => {
  try {
    // Fetch all video documents from the database
    const videos = await videoModel.find();

    // Set response headers to specify content type
    res.set('Content-Type', 'application/json');

    // Send the videos as a JSON response
    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'An error occurred while fetching videos' });
  }
});

module.exports = {
  videoRouter
};
