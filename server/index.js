const express = require('express');

const app = express();

const PORT = 3001;

app.get('/',(req,res)=>{
    res.send('app is running')
})

app.listen(PORT,()=>{
    console.log(`port is running on ${PORT}`);
})