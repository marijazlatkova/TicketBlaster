import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <div id="nav">
      <ul>
        <li>
          <Link to="/create-account">Create Account</Link>
        </li>
      </ul>
    </div>
  );
};
