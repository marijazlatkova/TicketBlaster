import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import style from "./reset-password.module.css";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [data, setData] = useState({
    password: "",
    retype_password: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const dataChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (data.password !== data.retype_password) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:10001/api/v1/auth/reset-password?token=${token}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        setSuccessMessage("Password reset successfully!");
        navigate("/login");
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("An unexpected error occurred");
    }
  };

  return (
    <div className={style["reset-password"]}>
      <h2>Reset Password</h2>
      <br />
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={resetPassword}>
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
          Re-Type password
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
        <button className={style["reset-password-button"]} type="submit">
          Reset Password
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
