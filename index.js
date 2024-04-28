const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const app=express();
const port=process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.as3doaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);


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

    const craftCollection = client.db("ArtCraftStore").collection("Crafts");

    const artCollection = client.db("ArtCraftStore").collection("Arts");



    // get all data

    app.get('/craftSection',async(req,res)=>{
        const cursor=craftCollection.find()
        const result=await cursor.toArray()
        res.send(result)
    })

    app.get('/artSection',async(req,res)=>{
      const cursor=artCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })

    // get data by id

    app.get('/craftSection/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await craftCollection.findOne(query);
        res.send(result);
    })
    // get data by email

    app.get("/craftSection/email/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const result = await craftCollection.find(query).toArray();
        res.send(result);
    });

    
    // insert data to database

    app.post("/addArt&Craft", async (req, res) => {
        console.log(req.body);
        const result = await craftCollection.insertOne(req.body);
        console.log(result);
        res.send(result)
      })

      app.put('/craftSection/:id',async(req,res)=>{
        const id=req.params.id
        const filter={_id: new ObjectId(id)}
        const options={upsert:true}
        const updateCraft=req.body
        const craft={
          $set:{
            photo:updateCraft.photo,
        item_name:updateCraft.item_name,
        subcategory_name:updateCraft.subcategory_name,
        short_description:updateCraft.short_description,
        price:updateCraft.price,
        rating:updateCraft.rating,
        customization:updateCraft.customization,
        processing_time:updateCraft.processing_time,
        stock_status:updateCraft.stock_status
          }
        }
        const result=await craftCollection.updateOne(filter,craft,options)
        res.send(result)
      })

      // deleted data to database

      app.delete("/craftSection/:id",async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const result=await craftCollection.deleteOne(query)
        res.send(result)
      })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('project-10 server running')
})

app.listen(port,()=>{
    console.log(`project-10 server running on port ${port}`);
})
