// const express = require("express");
// const cors = require("cors");
// // const { MongoClient, ServerApiVersion } = require('mongodb');
// // require('dotenv').config();
// const app = express();
// const port = process.env.PORT || 8080;

// //middleware
// app.use(cors)
// app.use(express.json());

// // console.log(process.env.DB_PASS);

// // app.get('/', (req, res) => {
// //   console.log('hello');
// //     res.send('server is running')

// // })

// // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzmsh8k.mongodb.net/?retryWrites=true&w=majority`;

// // // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   }
// // });

// // async function run() {
// //   try {
// //     // Connect the client to the server	(optional starting in v4.7)
// //     await client.connect();

// //     const roomCollection = client.db('roomBooking').collection('rooms');


// //     app.get('/rooms', async (req, res) => {
// //       const cursor = roomCollection.find();
// //       const result = await cursor.toArray();
// //       res.send(result);
// //   })

// //     // Send a ping to confirm a successful connection
// //     await client.db("admin").command({ ping: 1 });
// //     console.log("Pinged your deployment. You successfully connected to MongoDB!");
// //   } finally {
// //     // Ensures that the client will close when you finish/error
// //     // await client.close();
// //   }
// // }
// // run().catch(console.dir);


// app.get('/', (req, res) => {
//   console.log('hello');
//     res.send('server is running')

// })



// app.listen(port, () => {
//     console.log(`server is running on port ${port}`);
// })




const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//  middleware

app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzmsh8k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const roomCollection = client.db('roomBooking').collection('rooms');
    const bookingCollection = client.db('roomBooking').collection('bookings');

    app.get('/rooms', async (req, res) => {
      const cursor = roomCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/rooms/:id', async (req, res) => {
       const id = req.params.id;
       const query = { _id: new ObjectId(id)}

       const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { price_per_night: 1, room_type: 1, 
        img: 1, room_size: 1, description: 1, special_offers: 1 },
      };

       const result = await roomCollection.findOne(query, options);
       res.send(result);
    })

    // app.get('/rooms/:id', async(req, res) =>{
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) }

    //   const options = {
    //     // Include only the `title` and `imdb` fields in the returned document
    //     projection: { price_per_night: 1, room_type: 1, img: 1 },
    //   };

    //   const result = await roomCollection.findOne(query, options);
    //   res.send(result);
    // })

    //bookings
    app.post('/bookings', async(req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  console.log('hello');
  res.send('server is running')

})

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
