const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const awsRoutes = express.Router();

const s3Bucket = "spur-profile-pictures";
const s3Client = new S3Client({
  region: "us-east-1", // Adjust region if necessary
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 5 * 1024 * 1024 } // Set a file size limit (5MB)
});

// Upload a profile picture
awsRoutes.route('/profile-picture').post(upload.single('image'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const file = req.file;
  const bucketParams = {
    Bucket: s3Bucket,
    Key: `profile-pictures/${Date.now()}_${file.originalname}`, // Unique key
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    res.json({ message: 'Profile picture uploaded successfully', key: bucketParams.Key });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
  }
});

// Retrieve a profile picture
awsRoutes.route('/profile-picture/:key').get(async (req, res) => {
  const key = req.params.key;
  const bucketParams = {
    Bucket: s3Bucket,
    Key: key,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    const chunks = [];
    data.Body.on('data', (chunk) => chunks.push(chunk));
    data.Body.on('end', () => {
      const buffer = Buffer.concat(chunks);
      res.writeHead(200, {
        'Content-Type': data.ContentType,
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    });
  } catch (error) {
    console.error('Error retrieving profile picture:', error);
    res.status(500).json({ message: 'Error retrieving profile picture' });
  }
});

// Upload a photo to user profile
awsRoutes.route('/users/:id/photos').post(upload.single('photo'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const userId = req.params.id;
  const file = req.file;
  const bucketParams = {
    Bucket: s3Bucket,
    Key: `user-photos/${userId}/${Date.now()}_${file.originalname}`, // Unique key for user photo
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    res.json({ message: 'Photo uploaded successfully', key: bucketParams.Key });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

// Delete a photo from user profile
awsRoutes.route('/users/:id/photos/:photoKey').delete(async (req, res, next) => {
  const photoKey = req.params.photoKey;
  const bucketParams = {
    Bucket: s3Bucket,
    Key: `user-photos/${req.params.id}/${photoKey}`,
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
    res.json({ message: 'Photo deleted successfully', data });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ message: 'Error deleting photo', error: error.message });
  }
});

module.exports = awsRoutes;
