const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express =require('express')
const cors=require('cors')
const app =express()
const port = process.env.PORT || 3000

// middleware
app.use(cors());
app.use(express.json());





const uri = "mongodb+srv://job-hunt:ynCoQcgFpuHFsiLN@cluster0.abdx34i.mongodb.net/?appName=Cluster0";

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
   
    await client.connect();

    const db=client.db('job-hunt')
    const jobCollection =db.collection('job')
    // user data
    const userCollection=db.collection('user')
    // user post
    app.post('/user', async(req,res)=>{
      const newUser=req.body;
      const email=req.body.email;
      const query={email: email}
      const existingUser= await userCollection.findOne(query)
      if(existingUser){
        res.send('already exist')
      }
     else{
const result =await userCollection.insertOne(newUser)
      res.send(result)
     }
      
    })
    // get
    app.get('/job',async(req,res)=>{
        const cursor =jobCollection.find();
        const result =await cursor.toArray()
        res.send(result)
    })
    //get by id
    app.get('/job/:id', async(req,res)=>{
         const id =req.params.id;
    const query={ _id: new ObjectId(id)}
    const result = await jobCollection.findOne(query)
     res.send(result)
    })
// client post
    app.post('/job', async(req,res)=>{
        const newJob=req.body
        const result=await jobCollection.insertOne(newJob)
        res.send(result)
    })

    //patch
    app.patch('/job/:id', async(req,res)=>{
        const id =req.params.id;
        const updateJob=req.body;
        const query={ _id: new ObjectId(id)}
        const update={
            $set:{
              tittle:updateJob.tittle

            }
        }
        const result= await jobCollection.updateOne(query,update)
    })

// delect
app.delete('/job/:id', async(req,res)=>{
    const id =req.params.id;
    const query={ _id: new ObjectId(id)}
    const result =await jobCollection.deleteOne(query)
    res.send(result)
})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('your job hunt server is running')
});

app.listen(port,()=>{
    console.log(`job hunt lisening port is${port}`)
})