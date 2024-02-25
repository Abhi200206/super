const express=require("express");
const mongoose=require("mongoose");
const app=express();
const zod=require("zod");
const port=3000;
//here zod is used for input validation of users request
const schema=zod.object({
    name:zod.string().regex(/^[a-zA-Z\s]+$/,{"message":"only letters are allowed in name"}).min(3,{ message: "minimum 3 letters required in name" }),// name should be minimum of 3 letters
    email:zod.string().email({ message: "Invalid email address" }),
    age:zod.union([zod.number().gt(0),zod.string().regex(/^\d+$/)]),
    country:zod.string().regex(/^[a-zA-Z]+$/,{"message":"only letters are allowed in country"}).min(4,{"message":"invalid country"}),
    password:zod.string().min(8,{ message: "Invalid password" })// pasword should be of minimum 8 characters
});
//connecting to mongodb
mongoose.connect("mongodb+srv://vikkymsd777:TAm6HPFXUd4FIJig@cluster0.xpoedji.mongodb.net/rooba-api");
//defining schema 
const Roobaschema=new mongoose.Schema({
    name:String,
    email:String,
    age:Number,
    country:String,
    password:String
});
//defining a model
const User=mongoose.model('users',Roobaschema);
app.use(express.json());
//post route to add users with input vaildation
app.post('/users',async (req,res)=>{
    try{
    let obj=req.body.obj;
    let pass=schema.safeParse(obj);
    if(pass.success)
    {
        let result=await User.create({
            name:obj.name,
            email:obj.email,
            age:obj.age,
            country:obj.country,
            password:obj.password
        });
        res.json({"message":"user created successfully with id "+ result._id, id:result._id});
    }
    else
    {
        res.status(500).json({"error":pass.error.issues[0].message ? pass.error.issues[0].message:"invalid inputs","message":"input validation failed, give valid inputs"});
    }
}
catch(error)
{
    console.error("error: ",error);
    res.status(500).send("invalid request")
}
});

//get route fto get the all users in db
app.get('/users',async (req,res)=>{
    let result=await User.find({});
    if(result.length>0)
    {
        let arr=result.map((v)=>{
            return {
                name:v.name,
                email:v.email,
                age:v.age,
                country:v.country
            }
        })
        res.status(200).send(arr);
    }
    else
    {
        res.json({err:"error  getting the data or no data in db"});
    }
});
// put route to update user details
app.put('/users/:id',async (req,res)=>{
    let id=req.params.id;
    try {
    let result=await User.updateOne({_id:id},
        {
            name:req.body.name,
            email:req.body.email,
            age:req.body.age,
            country:req.body.country,
            password:req.body.password
        });
    if(result.acknowledged)
    {
        res.json({"message":`user with id: ${id} updated successfully`});
    }
    else
    {
        res.json({"error":"error while updating"});
    }
}
catch(err)
{
    console.error("error: ",err);
    res.json("error at server, please try again");
}

})

app.delete('/users/:id',async(req,res)=>{
    let id=req.params.id;
    try{
        let result=await User.deleteOne({_id:id},{});
        if(result.acknowledged && result.deletedCount>0)
        {
            res.json({message:`user with id: ${id} deleted successfully`})
        }
        else
        {
            res.json({error:"no user with id or error while deleting "})
        }
    }
    catch(err)
    {
        console.error("error: ",err);
        res.json({"error":"error at server"});
    }

})
//global error handling middleware
app.use((err,req,res,next)=>{
    {
        console.error("error: ",err);
        res.status(500).json({"error":"error at server"});
    }
})

app.listen(port,()=>{
    console.log(`app running on port ${port}`);
})

