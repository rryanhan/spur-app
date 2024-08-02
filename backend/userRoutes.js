const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 6;

let userRoutes = express.Router();

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
                pictures: [],
            };
            let data = await db.collection("users").insertOne(mongoObject);
            return res.status(201).json({ message: "User created successfully!", data });
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

        let db = database.getDb();
        let mongoObject = {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                joinDate: req.body.joinDate,
                events: req.body.events,
                bio: req.body.bio,
                pictures: req.body.pictures,
            }
        };
        let data = await db.collection("users").updateOne({ _id: new ObjectId(id) }, mongoObject);
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
