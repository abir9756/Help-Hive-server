import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import { MongoClient } from 'mongodb';


const app = express()
const PORT = 5000


app.use(cors())
app.use(express.json());


const client = new MongoClient(process.env.MONGODB_URI);


export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}


const mongoClient = await connectToMongoDB();
const db = mongoClient.db('helphive');
const createEventCollection = db.collection('createEvent')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/createEvent',async(req,res)=>{
    const data = req.body
    const result = await createEventCollection.insertOne(data)
    res.send(result)
    console.log(data)
})

app.get('/upcomingEvent',async(req,res)=>{
    const result = await createEventCollection.find().toArray()
    res.send(result)
})


app.listen(PORT, () => {
  console.log(`server running successfully on port ${PORT}`)
})