import express from 'express'
import cors from 'cors'
import fileroute from './routes/fileroute.js'
import directoryroute from './routes/directoryRoutes.js'
import user from './routes/user.js'
import cookieParser from 'cookie-parser'


const app = express()
const port = 4100;
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));


app.use(cors({
  origin: "http://localhost:5173",
  credentials:true,
  
  exposedHeaders: ['Set-Cookie'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'parentdirid'
  ]
}));

// OPTIONAL but matches your OPTIONS handling
app.options('*', cors());

app.use('/files', fileroute);
app.use('/directory', directoryroute);
app.use('/user', user);
app.get('/',(req,res)=>{
  res.send("backend is runnign ")
})

app.post('/files/trash', (req, res) => {
  res.end("trash received");
});
app.listen(port, () => {
  console.log(`Server running at http://192.168.29.249:${port}`);
});
