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

// Define route for serving videos
videoRouter.get('/videos/:filename', async (req, res) => {
  try {
    // Fetch video document by filename from the database
    const video = await videoModel.findOne({ filename: req.params.filename });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Set response headers to specify content type
    res.set('Content-Type', video.contentType);

    // Send the video file as a response
    res.sendFile(video.path);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'An error occurred while fetching the video' });
  }
});

module.exports = {
  videoRouter
};
