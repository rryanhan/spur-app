const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
let eventRoutes = express.Router();

// Retrieve all events
eventRoutes.route("/events").get(async (request, response, next) => {
    try {
        console.log("Fetching events from the database...");
        let db = database.getDb();
        let data = await db.collection("events").find({}).toArray();
        if (data.length > 0) {
            console.log("Events found:", data);
            response.json(data);
        } else {
            console.log("No events found.");
            response.json([]); // Return an empty array instead of sending a 404 error
        }
    } catch (error) {
        console.error("Error fetching events:", error);
        next(error);
    }
});

// Retrieve one event by ID
eventRoutes.route("/events/:id").get(async (request, response, next) => {
    try {
        let db = database.getDb();
        let data = await db.collection("events").findOne({ _id: new ObjectId(request.params.id) });
        if (data) {
            response.json(data);
        } else {
            response.status(404).send("Data was not found");
        }
    } catch (error) {
        next(error);
    }
});

// Create a new event
eventRoutes.route("/events").post(async (request, response, next) => {
    try {
        let db = database.getDb();
        let mongoObject = {
            title: request.body.title,
            description: request.body.description,
            endTime: request.body.endTime,
            startTime: request.body.startTime,
            type: request.body.type,
            location: {
                address: request.body.location.address,
                coordinates: request.body.location.coordinates,
            },
            placeName: request.body.placeName, // Save the place name
            attendees: 0,
            frequency: request.body.frequency,
            createdBy: request.body.createdBy, // Include the creator's ID
        };
        let data = await db.collection("events").insertOne(mongoObject);
        response.json(data);
    } catch (error) {
        next(error);
    }
});

// Update an existing event
eventRoutes.route("/events/:id").put(async (request, response, next) => {
    try {
        let db = database.getDb();
        let mongoObject = {
            $set: {
                title: request.body.title,
                description: request.body.description,
                endTime: request.body.endTime,
                startTime: request.body.startTime,
                type: request.body.type,
                location: {
                    address: request.body.location.address,
                    coordinates: request.body.location.coordinates,
                },
                placeName: request.body.placeName,
                attendees: request.body.attendees,
                frequency: request.body.frequency
            }
        };
        let data = await db.collection("events").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
        response.json(data);
    } catch (error) {
        next(error);
    }
});

// Delete an event by ID
eventRoutes.route("/events/:id").delete(async (request, response, next) => {
    try {
        let db = database.getDb();
        let data = await db.collection("events").deleteOne({ _id: new ObjectId(request.params.id) });
        response.json(data);
    } catch (error) {
        next(error);
    }
});

module.exports = eventRoutes;
