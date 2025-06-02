import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTE, BASE_URL } from "./utils/constants";

const NavBar = () => {
  const user = useSelector(store => store.user);
  const navigate = useNavigate();

  const onClickLogout = async () => {
    const authContext = BASE_URL + AUTH_ROUTE;
    try {
      await axios.post(authContext + 'logout', {}, {withCredentials: true})
      return navigate("login");
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="navbar bg-neutral">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Welcome to Dev Tinder</Link>
      </div>
        {/* if user exists then only show user image div */}
        {user && (
          <div className="flex gap-2">
          <div className="items-center">Welcome, {user.firstName}</div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={user.photoURL} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><Link>Settings</Link></li>
              <li><Link onClick={onClickLogout}>Logout</Link></li>
            </ul>
          </div>
        </div>
        )}
        

    </div>
  )
}

export default NavBar;