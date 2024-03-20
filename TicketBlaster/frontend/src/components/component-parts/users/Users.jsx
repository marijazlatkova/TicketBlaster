import { useEffect, useState } from "react";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [popUpUser, setPopUpUser] = useState(false);
  const [popUpAdmin, setPopUpAdmin] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:10005/api/v1/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const upgradeDegrade = async () => {
    try {
      if (selectedUser) {
        const userData = users.find((user) => user._id === selectedUser);
        const userRole = userData.role;
        const newRole = userRole === "admin" ? "user" : "admin";
        await fetch(
          `http://localhost:10005/api/v1/users/role/${selectedUser}`,
          {
            method: "PATCH",
          }
        );
        setUsers((prevUsers) => {
          return prevUsers.map((user) => {
            if (user._id === selectedUser) {
              return { ...user, role: newRole };
            }
            return user;
          });
        });
        if (newRole === "admin") {
          setPopUpAdmin(false);
        } else {
          setPopUpUser(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeUser = async () => {
    try {
      if (selectedUser) {
        const res = await fetch(
          `http://localhost:10005/api/v1/users/${selectedUser}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) {
          throw new Error("Failed to remove user");
        }
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== selectedUser)
        );
        setPopUpDelete(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const makeUser = (userId) => {
    setSelectedUser(userId);
    setPopUpUser(true);
  };

  const makeAdmin = (userId) => {
    setSelectedUser(userId);
    setPopUpAdmin(true);
  };

  const deleteUser = (userId) => {
    setSelectedUser(userId);
    setPopUpDelete(true);
  };

  return (
    <div>
      {users
        .filter((user) => user.role !== "administrator")
        .map((user) => {
          return (
            <div key={user._id}>
              <div>
                <img
                  width={"200px"}
                  height={"150px"}
                  src={`http://localhost:10002/images/${user.image}`}
                  alt={user.name}
                />
                <div>
                  <p>{user.fullname}</p>
                  <p>{user.email}</p>
                </div>
              </div>
              <div>
                <div>
                  {user.role === "user" && (
                    <button onClick={() => makeAdmin(user._id)}>
                      Make Admin
                    </button>
                  )}
                </div>
                <div>
                  {user.role === "admin" && (
                    <button onClick={() => makeUser(user._id)}>
                      Make User
                    </button>
                  )}
                </div>
                {user.role !== "administrator" && (
                  <button onClick={() => deleteUser(user._id)}>
                    Delete User
                  </button>
                )}
              </div>
            </div>
          );
        })}
      {popUpUser && (
        <div>
          <h2>Are you sure?</h2>
          <p>
            You are about to downgrade a user from administrator. Please proceed
            with caution.
          </p>
          <div>
            <button onClick={() => setPopUpUser(false)}>Cancel</button>
            <button onClick={() => upgradeDegrade()}>Downgrade user</button>
          </div>
        </div>
      )}
      {popUpAdmin && (
        <div>
          <h2>Are you sure?</h2>
          <p>
            You are about to make a user administrator of the system. Please
            proceed with caution.
          </p>
          <div>
            <button onClick={() => setPopUpAdmin(false)}>Cancel</button>
            <button onClick={() => upgradeDegrade()}>Make user admin</button>
          </div>
        </div>
      )}
      {popUpDelete && (
        <div>
          <h2>Are you sure?</h2>
          <p>You are about to delete a user. Please proceed with caution.</p>
          <div>
            <button onClick={() => setPopUpDelete(false)}>Cancel</button>
            <button onClick={() => removeUser()}>Delete User</button>
          </div>
        </div>
      )}
    </div>
  );
};
