const express=require("express");
const app=express();
const port=3000;
function middleware(req,res,next)
{
    let token=req.body.token;
    let date=new Date();
    //logging the data
    console.log("[",date,"]",`${req.method}: ${req.url},Access Token:"${token}"`);
    next();
}
//to parse the body of the request
app.use(express.json());
//middleware
app.use(middleware)
app.get('/users',(req,res)=>{
    res.send("hello world");
});
app.post('/users',(req,res)=>{
    res.send("hello world");
});
app.put('/users/:id',(req,res)=>{
    res.send("hello world");
});
app.delete('/users/:id',(req,res)=>{
    res.send("hello world");
});
app.listen(port,()=>{
    console.log("server started!!!");
});