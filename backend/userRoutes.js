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
userRoutes.route('/users/login').post(async (request, response) => {
    let db = database.getDb();

    try {
        const user = await db.collection("users").findOne({ email: request.body.email });

        if (!user) {
            return response.status(400).json({ success: false, message: "Email not found" });
        }

        const confirmation = await bcrypt.compare(request.body.password, user.password);
        if (confirmation) {
            return response.status(200).json({ success: true, user });
        } else {
            return response.status(400).json({ success: false, message: "Incorrect password" });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return response.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = userRoutes;
