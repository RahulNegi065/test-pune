import express from 'express';
import cors from 'cors';
import connectMongo from './connection.js'
import authRoute from './routes/auth.js';
import fileRoute from './routes/file.js';
import { getUserAuthState } from './middlewares/auth.js';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

// connection
const uri = "mongodb+srv://rahulnegi065:simpleSa065@testcluster.mwckz5f.mongodb.net/?retryWrites=true&w=majority";
connectMongo(uri);

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());

app.use('/api', authRoute);

app.use(getUserAuthState);
app.use('/api/files', fileRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});