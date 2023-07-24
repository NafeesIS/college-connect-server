const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szch3sf.mongodb.net/?retryWrites=true&w=majority`;

async function connectToDB() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        // Connect the client to the server (optional starting in v4.7)

        await client.connect();

        const feedbackCollection = client.db('connectcollegedb').collection('feedback');
        const researchCollection = client.db('connectcollegedb').collection('research');
        const collegeCollection = client.db('connectcollegedb').collection('collegedetails');

        app.get('/feedback', async (req, res) => {
            const result = await feedbackCollection.find().toArray();
            res.send(result);
        });

        app.get('/research', async (req, res) => {
            const result = await researchCollection.find().toArray();
            res.send(result);
        });

        app.get('/collegedetails', async (req, res) => {
            const result = await collegeCollection.find().toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDB().then(() => {
    app.get('/', (req, res) => {
        res.send('college connect is running');
    });

    app.listen(port, () => {
        console.log(`college connect is running on port ${port}`);
    });
}).catch(console.error);
