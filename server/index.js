import express from 'express';
const app = express();
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRouter from './routes/Users.js';

dotenv.config();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://crowdfunding-frontend-eight.vercel.app"],
  methods: ["POST", "GET", "PATCH", "DELETE"],
  credentials: true,
}));

app.use('/users', userRouter);

// const db = await orbitdb.open('my-user-profiles', { type: 'keyvalue' })
// await db.put('name', 'Rajeev')
// await db.put('badge', 'newbie')
// console.log('my-db address', db.address);
//
// // Print out the above records.
// console.log(await db.all())
//
// // Close your db and stop OrbitDB and IPFS.
// await db.close()
// await orbitdb.stop()
// await ipfs.stop()

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
