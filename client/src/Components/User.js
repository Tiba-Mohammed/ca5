import { useSelector } from "react-redux";
import userimg from "../Images/user.png";


const User = () => {
 const { user} = useSelector((state) => state.users);

  return (
    <div>
      <img src={userimg} className="userImage" alt="" />
      <h6>{user?.name}</h6>  {/*we put ?, so that if the user in null it will not display error */}
      <h6>{user?.email}</h6>
    </div>
  );
};

export default User;
