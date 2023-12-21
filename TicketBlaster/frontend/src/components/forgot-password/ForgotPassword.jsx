import { useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./forgot-password.module.css";

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
  });

  const dataChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const forgotPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:10001/api/v1/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const token = await res.text();
        navigate(`/reset-password?token=${token}`);
      } else {
        console.log("An error has occurred");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={style["forgot-password"]}>
      <h2>Forgot Password</h2>
      <form onSubmit={forgotPassword}>
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
        <br />
        <button className={style["reset-password-email"]} type="submit">
          Send password reset email
        </button>
      </form>
      <br />
      <button
        className={style["back-to-login"]}
        onClick={() => navigate("/login")}
      >
        Back to login
      </button>
    </div>
  );
};
