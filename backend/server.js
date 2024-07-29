const connect = require("./connect")
const express = require("express")
const cors = require("cors")
const events = require("./eventRoutes")

const app = express()

const PORT = 3500

app.use(cors())
app.use(express.json())
app.use(events)

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})