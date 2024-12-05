import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';


const initialState = { 
    status: "idle", 
    posts: [], 
    comments: [], 
    likes: [], 
}; 



export const savePost = createAsyncThunk("posts/savePost", async (postData) => { 
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/savePost`,{
            postMsg: postData.postMsg,
            email: postData.email,
        });

        const post = response.data.post;
        const msg = response.data.msg;
        return ({post,msg});


    }
    catch(error){
            console.log(error);
    }

    
}); 


export const getPosts = createAsyncThunk("post/getPosts",async()=>{
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getPosts`); 
        return response.data.posts; 
        console.log(response); 
    }
    catch(error){
        console.log(error); 
    }
});


export const likePost = createAsyncThunk("posts/likePost", async (postData) => { 

    try { 
    
        //Pass along the URL the postId 
    
        const response = await axios.put( 
             `${process.env.REACT_APP_API_URL}/likePost/${postData.postId}`, // postId will send via URL as parameter
            { 
                 userId: postData.userId, // postId will send via body of request 
            } 
    
        ); 
    
         const post = response.data.post; 
         return post; 
        } catch (error) { 
    
             console.log(error); 
    
        } 
    
         }); 


const postSlice = createSlice({ 
    name: "posts", 
    initialState: initialState, 
    reducers: {}, 
    extraReducers: (builder)=>{
        builder

            .addCase(savePost.pending, (state) =>{
                state.status = "loading";
            })
            .addCase(savePost.fulfilled, (state,action) =>{
                state.status = "succeeded";
                state.posts.unshift(action.payload)
            })
            .addCase(savePost.rejected, (state,action) =>{
                state.status = "failed";
                state.error = action.error.message;
            })

            .addCase(getPosts.pending, (state) =>{
                state.status = "loading";
            })
            .addCase(getPosts.fulfilled, (state,action) =>{
                state.status = "succeeded";
                // Update the state with fetched posts 
                console.log(action.payload); 
                state.posts = action.payload; 
            })
            .addCase(getPosts.rejected, (state,action) =>{
                state.status = "failed";
                state.error = action.error.message;
            })

            .addCase(likePost.pending, (state) =>{
                state.status = "loading";
            })
            .addCase(likePost.fulfilled, (state,action) =>{
                state.status = "succeeded";
                //Search the post id from the posts state 

                const updatedPostIndex = state.posts.findIndex( 

                    (post) => post._id === action.payload._id 
    
                ); 
    
  
                //If found, update the likes property of the found post to the current value of the likes 
                
                    if (updatedPostIndex !== -1) { 
                        state.posts[updatedPostIndex].likes = action.payload.likes; 
                    } 
            })
            .addCase(likePost.rejected, (state,action) =>{
                state.status = "failed";
                state.error = action.error.message;
            })
            


        
    } 
    
    }); 

    
export default postSlice.reducer; 