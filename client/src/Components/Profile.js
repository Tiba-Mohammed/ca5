import { useEffect } from "react";
import userimg from "../Images/user.png"; 

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate()
  const {user,isLogin} = useSelector((state) => state.users);
  useEffect(()=>{
    if(!isLogin){navigate("/login")}
  },[isLogin,navigate])

  return (
    <div>
      <h1>Profile</h1>
      <img src={userimg} className="userImage" alt="" /> 
      <h6>{user?.name}</h6> 
      <h6>{user?.email}</h6> 
    </div>
  );
};

export default Profile;
