const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
let userRoutes = express.Router();
const bcrypt = require("bcrypt")
const SALT_ROUNDS = 6

// Retrieve all
userRoutes.route("/users").get(async (request, response, next) => {
    try {
        let db = database.getDb();
        let data = await db.collection("users").find({}).toArray(); // Corrected this line
        if (data.length > 0) {
            response.json(data);
        } else {
            response.status(404).send("Data was not found");
        }
    } catch (error) {
        next(error);
    }
});

// Retrieve one
userRoutes.route("/users/:id").get(async (request, response, next) => {
    try {
        let db = database.getDb();
        let data = await db.collection("users").findOne({ _id: new ObjectId(request.params.id) });
        if (data) {
            response.json(data);
        } else {
            response.status(404).send("Data was not found");
        }
    } catch (error) {
        next(error);
    }
});

// Create one
userRoutes.route("/users").post(async (request, response, next) => {
    
    try {
        let db = database.getDb();

        const takenEmail = await db.collection("users").findOne({email : request.body.email})

        if (takenEmail){
            response.json({message: "The email is taken"})
        } else {
            const hash = await bcrypt.hash(request.body.password, SALT_ROUNDS)

            let mongoObject = {
                name: request.body.name,
                email: request.body.email,
                password: hash,
                joinDate: new Date(),
                events: [],
                bio: [],
                pictures: [],
            };
            let data = await db.collection("users").insertOne(mongoObject);
            response.json(data);
            
            }   

        
    } catch (error) {
        next(error);
    }
});

// Update one
userRoutes.route("/users/:id").put(async (request, response, next) => {
    try {
        let db = database.getDb();
        let mongoObject = {
            $set: {
                name: request.body.name,
                email: request.body.email,
                password: request.body.password,
                joinDate: request.body.joinDate,
                events: request.body.events,
                bio: request.body.bio,
                pictures: 0,
            }
        };
        let data = await db.collection("users").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject); // Corrected this line
        response.json(data);
    } catch (error) {
        next(error);
    }
});

// Delete one
userRoutes.route("/users/:id").delete(async (request, response, next) => {
    try {
        let db = database.getDb();
        let data = await db.collection("users").deleteOne({ _id: new ObjectId(request.params.id) });
        response.json(data);
    } catch (error) {
        next(error);
    }
});

module.exports = userRoutes;

//Login
userRoutes.route('/login').post(async (req, res) => {
    try {
      const db = database.getDb();
      const user = await db.collection('users').findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(400).json({ message: 'Email not found' });
      }
  
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Successfully logged in
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = userRoutes;