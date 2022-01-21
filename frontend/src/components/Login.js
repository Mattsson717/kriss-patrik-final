import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../utils/constants";
import user from "../reducers/user";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("signin");
  const [error, setError] = useState(false);

  const errorMess = useSelector((store) => store.user.error);

  const accessToken = useSelector((store) => store.user.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/home");
    }
  }, [accessToken, navigate]);

  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    };

    fetch(API_URL(mode), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUserId(data.response.userId));
            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setEmail(data.response.email));
            dispatch(user.actions.setError(null));
            //specify the data that we want to save in localStorage 'user' here
            localStorage.setItem(
              "user",
              JSON.stringify({
                userId: data.response.userId,
                username: data.response.username,
                email: data.response.email,
                accessToken: data.response.accessToken,
              })
            );
          });
        } else {
          batch(() => {
            dispatch(user.actions.setUserId(null));
            dispatch(user.actions.setUsername(null));
            dispatch(user.actions.setAccessToken(null));
            dispatch(user.actions.setEmail(null));
            dispatch(user.actions.setError(data.response));
          });
          setError(true);
        }
      });
  };

  return (
    <section>
      <form onSubmit={onFormSubmit}>
        <fieldset>
          <legend>
            <label htmlFor="username">Username</label>
          </legend>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </fieldset>
        <fieldset>
          <legend>
            <label htmlFor="password">Password</label>
          </legend>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </fieldset>

        {mode === "signup" && (
          <>
            <fieldset>
              <legend>
                <label htmlFor="email">Email</label>
              </legend>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </fieldset>
          </>
        )}

        <button type="submit">Submit</button>
        {error && <p>{errorMess}</p>}

        {mode === "signin" && (
          <button type="button" onClick={() => setMode("signup")}>
            Create new account
          </button>
        )}
        {mode === "signup" && (
          <button type="button" onClick={() => setMode("signin")}>
            Go to log in
          </button>
        )}
      </form>
    </section>
  );
};

export default Login;
