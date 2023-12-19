import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./create-account.module.css";

export const CreateAccount = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    fullname: "",
    email: "",
    password: "",
    retype_password: "",
  });

  const dataChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const createAccount = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:10001/api/v1/auth/create-account",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        navigate("/login");
      } else {
        console.log("An error has occurred");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={style["create-account"]}>
      <h2>Create account</h2>
      <br />
      <form onSubmit={createAccount}>
        <label>
          Full Name
          <br />
          <input
            type="text"
            name="fullname"
            value={data.fullname}
            onChange={dataChange}
          />
        </label>
        <br />
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
        <label>
          Re-type Password
          <br />
          <input
            type="password"
            name="retype_password"
            value={data.retype_password}
            onChange={dataChange}
          />
        </label>
        <br />
        <br />
        <button className={style["create-account-button"]} type="submit">
          Create account
        </button>
      </form>
      <br />
      <button
        className={style["login-link"]}
        onClick={() => navigate("/login")}
      >
        Already have an account?
      </button>
    </div>
  );
};
