import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, login, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  };
  console.log(user);
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="loginContainer">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="formControl">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            value={email}
            placeholder="exapmle@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="formControl">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            placeholder="pasword"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="buttons">
          <button className="btn btn--primary" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
