const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ltnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("gotravel");
    const serviceCollection = database.collection("service");
    const bookingCollection = database.collection("booking");
    //GET API
    app.get("/service", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //GET Booking api
    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find({});
      const booking = await cursor.toArray();
      res.send(booking);
    });

    // create a document to insert
    app.post("/service", async (req, res) => {
      const tourService = req.body;
      console.log("Hit the post", tourService);
      const result = await serviceCollection.insertOne(tourService);
      res.json(result);
    });
    // insert a booking data to server
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      console.log("Hit the post", booking);
      const result = await bookingCollection.insertOne(booking);
      res.json(result);
    });

    //GET SINGLE API
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    });

    //GET SINGLE BOOKING API
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.findOne(query);
      res.json(booking);
    });

    //delete SINGLE BOOKING API
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.deleteOne(query);
      console.log("delete", booking);
      res.json(booking);
    });
    //delete SINGLE service API
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      console.log("delete", result);
      res.json(result);
    });

    // Query for a movie that has the title 'Back to the Future'
    // const query = { title: "Back to the Future" };
    // const movie = await movies.findOne(query);
    // console.log(movie);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
