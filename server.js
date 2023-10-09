import express from "express";
const port = 3000; // or any other port number you prefer



const app = express()

app.get('/',(req,res)=>{
    res.send("Hello there");
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});