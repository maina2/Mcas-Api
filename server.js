import express from "express";
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser'
import routes from './src/routes/routes.js'

const port = 3000; 

const app = express()

app.use(bodyParser.json())


//middlewareq
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//jwt middleware
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], config.jwt_secret, (err, decode) => {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

routes(app);


app.get('/',(req,res)=>{
    res.send("Hello there");
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});