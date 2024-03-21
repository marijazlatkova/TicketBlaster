import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export const UserDetails = () => {
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState(false);
  const [image, setImage] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const fileInput = useRef(null);

  const {
    isLoggedIn,
    userFullname,
    userId,
    userEmail,
    userImage,
    handleUserImage,
  } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
    setFullname(userFullname || "");
    setEmail(userEmail || "");
  }, [isLoggedIn, userFullname, userEmail, navigate]);

  const handleDataChange = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (image) formData.append("image", image);
      if (fullname) formData.append("fullname", fullname);
      if (email) formData.append("email", email);

      const res = await fetch(`http://localhost:10005/api/v1/users/${userId}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        if (formData.has("image")) {
          handleUserImage(data.image, false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      const imageURL = URL.createObjectURL(selectedImage);
      handleUserImage(imageURL, true);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      if (password === reTypePassword) {
        const res = await fetch(
          `http://localhost:10005/api/v1/users/password/${userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
          }
        );
        if (res.ok) {
          alert("Password updated successfully");
          setPassword("");
        }
      } else {
        console.log("Passwords do not match");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUploadClick = () => {
    fileInput.current.click();
  };

  return (
    <div>
      <div>
        <form onSubmit={handleDataChange}>
          <input
            type="file"
            ref={fileInput}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <img src={`http://localhost:10002/images/${userImage}`} />
          <br />
          <button type="button" onClick={handleUploadClick}>
            Upload Avatar
          </button>
          <br />
          <button type="submit">Submit</button>
          <br />
          <label>Full Name</label>
          <br />
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <br />
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </form>
      </div>
      <div>
        <h2>Password</h2>
        <button onClick={() => setPasswordForm(!passwordForm)}>
          Change Password
        </button>
        {passwordForm && (
          <form onSubmit={handlePasswordChange}>
            <label>Password</label>
            <br />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <label>Re-type Password</label>
            <br />
            <input
              type="password"
              required
              value={reTypePassword}
              onChange={(e) => setReTypePassword(e.target.value)}
            />
            <br />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};
