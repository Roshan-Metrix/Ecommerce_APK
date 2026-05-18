import express from 'express';
import path from 'path';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { functions, inngest } from './config/inngest.js'
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

const app = express()

const __dirname = path.resolve()

app.use(express.json())
app.use(clerkMiddleware());  // add req req.auth

app.use('/app/inngest',serve({ client: inngest, functions}))

app.get('/api/health',(req,res) => {
    res.status(200).json({message: "Success"});
})

// Making App ready for deployment
if(ENV.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,"../../admin/dist")));

    app.get("/{*any}",(req,res) => {
         res.sendFile(path.join(__dirname,"../../admin/dist","index.html"));
    })
}

app.listen(ENV.PORT, () => {
    console.log("Server is listening at port 3000")
    connectDB();
})