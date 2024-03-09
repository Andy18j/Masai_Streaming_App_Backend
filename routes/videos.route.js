// routes/videos.route.js
const express = require("express");
const fs = require("fs");
const { videoModel } = require("../model/video.model");

const videoRouter = express.Router();

videoRouter.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ message: "Video ID is missing" });
    }

    const video = await videoModel.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const videoPath = video.path; // Use the path of the video file
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Range": "bytes",
        "Content-Length": chunksize,
        "Content-Type": video.contentType,
      };

      res.writeHead(206, head); // Respond with status code 206 (Partial Content)
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": video.contentType,
      };

      res.writeHead(200, head); // Respond with status code 200 (OK)
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'An error occurred while fetching video' });
  }
});

module.exports = {
  videoRouter
};
