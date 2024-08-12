const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const database = require("./connect");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 6;
const jwt = require("jsonwebtoken");
require("dotenv").config({path: "./config.env"});

let userRoutes = express.Router();

const s3Bucket = "spur-profile-pictures";
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Set a file size limit (5MB)
});

// Add photo to user's photos array
userRoutes.route('/users/:id/photos').post(upload.single('photo'), async (req, res, next) => {
  const userId = req.params.id;
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const file = req.file;
  const bucketParams = {
    Bucket: s3Bucket,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    const photoUrl = bucketParams.Key;

    const db = database.getDb();
    const updateResult = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $push: { photos: photoUrl } }
    );

    if (updateResult.modifiedCount > 0) {
      res.json({ message: 'Photo added successfully', photoUrl });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

// Delete a photo from user's photos array
userRoutes.route('/users/:id/photos/:photoKey').delete(async (req, res, next) => {
  const userId = req.params.id;
  const photoKey = req.params.photoKey;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const db = database.getDb();
    const updateResult = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { photos: photoKey } }
    );

    if (updateResult.modifiedCount > 0) {
      res.json({ message: 'Photo deleted successfully' });
    } else {
      res.status(404).json({ message: 'User or photo not found' });
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ message: 'Error deleting photo', error: error.message });
  }
});

// Existing routes...

// Retrieve all users
userRoutes.route("/users").get(async (req, res, next) => {
    try {
        let db = database.getDb();
        let data = await db.collection("users").find({}).toArray();
        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(404).send("Data was not found");
        }
    } catch (error) {
        next(error);
    }
});

// Retrieve one user
userRoutes.route("/users/:id").get(async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        let db = database.getDb();
        let data = await db.collection("users").findOne({ _id: new ObjectId(id) });

        if (data) {
            res.json(data);
        } else {
            res.status(404).send("Data was not found");
        }
    } catch (error) {
        next(error);
    }
});

// Create one user
userRoutes.route("/users").post(async (req, res, next) => {
    try {
      let db = database.getDb();
      const takenEmail = await db.collection("users").findOne({ email: req.body.email });
  
      if (takenEmail) {
        return res.status(400).json({ message: "The email is already taken" });
      } else {
        const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  
        let mongoObject = {
          name: req.body.name,
          email: req.body.email,
          password: hash,
          joinDate: new Date(),
          events: [],
          bio: [],
          photos: [], // Added field for storing photo URLs
          profilePicture: [],
        };
        let data = await db.collection("users").insertOne(mongoObject);
  
        // Create a token
        const token = jwt.sign({ id: data.insertedId }, process.env.SECRETKEY, { expiresIn: "1h" });
  
        return res.status(201).json({ message: "User created successfully!", token });
      }
    } catch (error) {
      next(error);
    }
  });

// Update one user
userRoutes.route("/users/:id").put(async (req, res, next) => {
  try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid ID format' });
      }

      const db = database.getDb();
      const updateFields = {};

      if (req.body.name !== undefined) updateFields.name = req.body.name;
      if (req.body.bio !== undefined) updateFields.bio = req.body.bio;
      if (req.body.profilePicture !== undefined) updateFields.profilePicture = req.body.profilePicture;
      if (req.body.instagramHandle !== undefined) updateFields.instagramHandle = req.body.instagramHandle;
      if (req.body.photos !== undefined) updateFields.photos = req.body.photos;

      const data = await db.collection("users").updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
      );

      res.json(data);
  } catch (error) {
      next(error);
  }
});

// Delete one user
userRoutes.route("/users/:id").delete(async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        let db = database.getDb();
        let data = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Login
userRoutes.route('/users/login').post(async (request, response) => {
    let db = database.getDb();
  
    try {
      const user = await db.collection("users").findOne({ email: request.body.email });
  
      if (!user) {
        return response.status(400).json({ success: false, message: "Email not found" });
      }
  
      const confirmation = await bcrypt.compare(request.body.password, user.password);
      if (confirmation) {
        // Include user ID in the token payload
        const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: "1h" });
        return response.status(200).json({ success: true, token });
      } else {
        return response.status(400).json({ success: false, message: "Incorrect password" });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return response.status(500).json({ success: false, message: 'Server error' });
    }
  });

module.exports = userRoutes;
