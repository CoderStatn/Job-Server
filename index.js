const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3g5t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        // console.log('Databse Connected');
        const database = client.db('CareerImpacts');
        const jobs = database.collection('jobs');
        const appliedJobs = database.collection('Applied');
        const usersCollection = database.collection('Users');
        const companyCollection = database.collection('Company');


        // get jobs api
        app.get("/jobs", async (req, res) => {
            const result = await jobs.find({}).toArray();
            console.log(req.body);
            res.send(result);
        });

        // Delete/remove single jobs 
        app.delete("/jobs/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await jobs.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });


        // insert job api
        app.post('/jobs', async (req, res) => {
            const job = req.body;
            const result = await jobs.insertOne(job);
            console.log(result);

            res.json(result);
        });


        // find a single job api
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await jobs.findOne(query);
            // console.log('Find with id', id);
            res.send(result);
        });

        // get manage jobs api
        app.get('/manageJobs', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = jobs.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        });

        // update single job
        app.put('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: updateData
            };
            const result = await jobs.updateOne(filter, updateDoc, options);

            console.log(result);
            // console.log(req.body);
            res.json(result);
        })

        // get specific job information api
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await jobs.findOne(query);
            // console.log('Find with id', id);
            res.send(result);
        });

        // insert appliedJobs job api
        app.post('/appliedJobs/:id', async (req, res) => {
            const job = req.body;
            const result = await appliedJobs.insertOne(job);
            console.log(result);

            res.json(result);
        });


        // Delete/remove appliedJobs jobs 
        app.delete("/appliedJobs/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await appliedJobs.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        // insert a user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });


        // get ceo api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            console.log(user);
            res.json(user);
        })


        // get my myApplied api
        app.get('/myApplied', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = appliedJobs.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })

        // register Company

        app.post('/registerCompany', async (req, res) => {
            const company = req.body;
            const result = await companyCollection.insertOne(company);
            console.log(result);

            res.json(result);
        });

        // get Company
        app.get("/company", async (req, res) => {
            const result = await companyCollection.find({}).toArray();
            console.log(req.body);
            res.send(result);
        });

        ///get apply resume
        app.get("/resume", async (req, res) => {
            const result = await appliedJobs.find({}).toArray();
            console.log(req.body);
            res.send(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to Career Impacts Server')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})