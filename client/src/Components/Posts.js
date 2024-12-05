
import { useSelector, useDispatch } from "react-redux"; 
import { Link, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react"; 
import { getPosts } from "../Features/PostSlice"; 
import { Table } from "reactstrap"; 
import moment from "moment"; 
import { likePost } from "../Features/PostSlice"; 
import { FaThumbsUp } from "react-icons/fa6"; 

const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);  // 'state.posts.posts' --> first posts is from the slice which is slice name "name: "posts" // and the second is  array name "posts: [], " 
  const user = useSelector((state) => state.users.user); 
  
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 
  useEffect(() => { 
      dispatch(getPosts()); 
    }, []);

  const handleLikePost = (postId) => { 

        const postData = { 
            postId: postId, 
            userId: user._id, 
      
        }; 
      
        dispatch(likePost(postData)); 
        navigate("/home"); 
  }; 


  return (
    <div className="postsContainer">
      <h1>Display Posts</h1>
      <Table className="table table-striped"> 
          <thead></thead>
          <tbody>
            {
              posts.map((post)=>(
                <tr key={post._id}>
                    <td>{post.email}</td>
                    <td>
                      <p>{moment(post.createdAt).fromNow()}</p>
                      {post.postMsg}
                      <p className="likes"> 
                        <Link onClick={() => handleLikePost(post._id)}> 
                              <FaThumbsUp /> 
                        </Link> 

                        ({post.likes.count}) 
                      </p> 
                      
                    </td>
                </tr>
              ))
            }
          </tbody>
      </Table>
    </div> 
  );
};

export default Posts;
