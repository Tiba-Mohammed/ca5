import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import bcrypt from "bcrypt";
import PostModel from './Models/PostModel.js';
import dotenv from "dotenv"; 


dotenv.config(); 
const app = express();
app.use(express.json());
app.use(cors());

//Database connection
const connectString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@postitcluster.568al.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&appName=PostITCluster`; 

 

mongoose.connect(connectString);
app.listen(process.env.PORT, () => {
  console.log("You are connected");
});


//Express route for register
app.post("/registerUser", async(req, res) => {
  try{
    const user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })

    await user.save();
    res.send({user:user, msg:"Document saved successfully"})

  }
  catch(error) {
    console.error(error);
    res.status(500).json({error:"An unexpected error occurred"})

  }


})

//Express route for save post
app.post("/savePost", async(req, res) => {
  try{
    const post = new PostModel({
      postMsg: req.body.postMsg,
      email: req.body.email,
     
    })

    await post.save();
    res.send({post:post, msg:"Posted Message is saved successfully"})

  }
  catch(error) {
    console.error(error);
    res.status(500).json({error:"An unexpected error occurred"})

  }


});


//Express route for get post

app.get("/getPosts",async(req,res)=>{
  try{
    const posts = await PostModel.find({}).sort({ createdAt: -1 }); 
    const countPost = await PostModel.countDocuments({});
    res.send({ posts: posts, count: countPost });
  }catch(error){
    console.error(err); 
    res.status(500).json({ error: "An error occurred" }); 
  }
});

//Express route for login

app.post("/login", async (req, res) => { 
  try { 
    const { email, password } = req.body;
  
    const user = await UserModel.findOne({ email: email });

    if (!user) { 
      res.status(500).send({ msg: " Couldn't find the user" });
      
    }
    else if (user.password !== password) {
      res.status(500).json({ msg: "Password is incorrect" });
      
    }
    else {
      res.send({user: user,msg:"Authentication is  successfull"})
    }
  }
  catch (error) { 
    res.status(500).json({error:"An unexpected error occurred"})
  }
})

app.post("/logout", async (req, res) => {
  res.send({ msg: "logout successful" })
 })


//Express route for like post

 app.put("/likePost/:postId/", async (req, res) => { 

   const postId = req.params.postId; //Extract the ID of the post from the URL 
   const userId = req.body.userId; 
  
  try { 
    //search the postId if it exists 
    const postToUpdate = await PostModel.findOne({ _id: postId }); 
    if (!postToUpdate) { 
      return res.status(404).json({ msg: "Post not found." }); 
    } 
    //Search the user Id from the array of users who liked the post. 
    const userIndex = postToUpdate.likes.users.indexOf(userId); 
  
    //indexOf method returns the index of the first occurrence of a specified value in an array. 
    //If the value is not found, it returns -1. 
    //This code will toogle from like to unlike 
    if (userIndex !== -1) { 
      // User has already liked the post, so unlike it 
       const udpatedPost = await PostModel.findOneAndUpdate( 
            { _id: postId }, 
    
           { 
              $inc: { "likes.count": -1 }, // Decrement the like count $inc and $pull are update operators 
              $pull: { "likes.users": userId }, // Remove userId from the users array 
           }, 
    
            { new: true } // Return the modified document 
    
       ); 
    
    
    
      res.json({ post: udpatedPost, msg: "Post unliked." }); 
    
     } else { 
    
          // User hasn't liked the post, so like it 
          
          const updatedPost = await PostModel.findOneAndUpdate( 
          
              { _id: postId }, 
              
              { 
              
                $inc: { "likes.count": 1 }, // Increment the like count 
                $addToSet: { "likes.users": userId }, // Add userId to the users array if not already present 
              
              }, 
        
              { new: true } // Return the modified document 
          ); 
    
    
    
          res.json({ post: updatedPost, msg: "Post liked." }); 
    
    } 
  
  } catch (err) { 
  
     console.error(err); 
    res.status(500).json({ error: "An error occurred" }); 
  
  } 
  
  }); 