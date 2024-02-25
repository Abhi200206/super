const express=require('express');
const zod=require('zod');
const jwt=require('jsonwebtoken');
const app=express();
const jwtpass="1990987677";
const port=3000;
const mongoose=require('mongoose');
const schema=zod.object({
    username:zod.string(),
    password:zod.string(),
    email:zod.string().email()
});
mongoose.connect("mongodb+srv://vikkymsd777:TAm6HPFXUd4FIJig@cluster0.xpoedji.mongodb.net/users");
const user=mongoose.model("user",{
    username:String,
    password:String,
    email:String
});
app.use(express.json())
app.post('/signup',async (req,res)=>{
    let obj=req.body.obj;
    let result=schema.safeParse(obj);
    if(result.success)
    {
        let r =await user.find({username: obj.username}).exec();
        if(!r[0]){
        let u=new user({
            username:obj.username,
            password:obj.password,
            email:obj.email
        })
        u.save().then(()=>{console.log("data saving completed")});
        res.status(200).json({
            "msg":"signup completed. now login"
        })
    }
    else{
        res.status(404).json({
            error: "user already present"
        });
    }
        
    }
    else{
        res.status(404).json({
            error: "invalid input please check"
        });
    }
})
app.post('/signin',async (req,res)=>{
    let user1=req.body.username;
    let pass=req.body.password;
    let result=await user.find({username: user1,password:pass}).exec();
    if(result[0])
    {
        let token=jwt.sign({user_name: user1},jwtpass);
        res.status(200).json({
            "token":token
        });
    }
    else{
        res.status(404).json({
            msg:"username not found !!"
        })
    }
    
})
function usersret(arr,user)
{
    let r=[]
    for(let i=0;i<arr.length;i++)
    {
        if(arr[i].username!=user)
        {
            r.push(arr[i].username);
        }
    }
    return r;
}
app.get('/users', async (req,res)=>{
  const token = req.headers.authorization;
  const decoded = jwt.verify(token,jwtpass);
  const username = decoded.user_name;
  let result =await user.find({}).exec();
  let arr=usersret(result,username)
  res.status(200).json({
    "users":arr
  })
})
app.use((err,req,res,next)=>{
    res.status(500).json({
        "error":"server error"
    })
})
app.listen(port,()=>{
    console.log(`server running on port no: ${port}`)
})

