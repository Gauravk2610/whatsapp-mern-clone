// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from 'pusher'
import Cors from 'cors'

//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "",
    key: "",
    secret: "",
    cluster: "",
    useTLS: true
  });
  

//middleware
app.use(express.json())
app.use(Cors())

//DB Config
const connection_url =
  "mongodb+srv://admin:<password>@cluster0.cjv4y.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//???????

const db = mongoose.connection

db.once('open', ()=>{
    console.log("DB Connected")

    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch()

    changeStream.on("change", (change) => {
        console.log(change)
    
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            })
        } else {
            console.log('Error Triggering Pusher')
        }
    
    })

})

//api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get('/api/v1/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post('/api/v1/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(`${data}`)
        }
    })
})

//listen
app.listen(port, () => console.log(`listening on localhost:${port}`));

// mupmw7fUQy2UVaxF
