import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';


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
const bookingCollection = db.collection('Eventbookings')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/createEvent/:id',async(req,res)=>{
    const data = req.body
    const result = await createEventCollection.insertOne(data)
    res.send(result)
    console.log(data)
})

app.get('/upcomingEvent',async(req,res)=>{
    const result = await createEventCollection.find().toArray()
    res.send(result)
})

app.get('/upcomingEvent/:id',async(req,res)=>{
  const id = req.params.id;
  const result = await createEventCollection.findOne({ _id: new ObjectId(id) });
  res.send(result) 
})


app.post('/eventBookings',async(req,res)=>{
  const data = req.body;
  const result = await bookingCollection.insertOne(data);
  res.json(result)
  console.log(result)
})

app.get('/userBookings/:email',async(req,res)=>{
  const {email}=req.params
  console.log("email",email)
  const result = await bookingCollection.find({email:email}).toArray()
  res.send(result)
})

app.delete('/userBookings/:id',async(req,res)=>{
  const {id} = req.params
  const result = await bookingCollection.deleteOne({_id:id})
  res.send(result)
})


app.listen(PORT, () => {
  console.log(`server running successfully on port ${PORT}`)
})