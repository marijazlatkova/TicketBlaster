import { useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./login.module.css";

export const Login = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const dataChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:10001/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem("token", token);
        navigate("/events");
      } else {
        console.log("An error has occurred");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={style["login"]}>
      <h2>Log In</h2>
      <br />
      <form onSubmit={login}>
        <label>
          Email
          <br />
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={dataChange}
          />
        </label>
        <br />
        <label>
          Password
          <br />
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={dataChange}
          />
        </label>
        <br />
        <br />
        <a onClick={() => navigate("/forgot-password")}>Forgot Password?</a>
        <button className={style["login-button"]} type="submit">
          Log In
        </button>
      </form>
      <br />
      <button
        className={style["create-account-link"]}
        onClick={() => navigate("/create-account")}
      >
        Don't have an account?
      </button>
    </div>
  );
};
