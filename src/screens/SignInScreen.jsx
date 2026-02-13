import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoBlue from "../assets/logoBlue.png";

const SignInScreen = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    // Need to apply validation rules as well
    navigate("/home");
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img src={logoBlue} alt="OSCAR Mobile Logo" style={styles.logo} />

        <h1 style={styles.title}>OSCAR Mobile</h1>
        <p style={styles.subtitle}>Electronic Medical Records</p>

        <form onSubmit={handleSignIn} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>User ID</label>
            <input
              type="text"
              placeholder="Enter your ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.signInButton}>
            SIGN IN
          </button>

          <div style={styles.rememberMeContainer}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor="rememberMe" style={styles.rememberMeLabel}>
              Remember Me
            </label>
          </div>

          <a href="#" style={styles.forgotPassword}>
            Forgot Password?
          </a>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#E8E8E8",
    padding: "20px",
    overflow: "hidden",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "350px",
  },
  logo: {
    width: "70px",
    height: "100px",
    objectFit: "contain",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#000000",
    margin: "0 0 5px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666666",
    margin: "0 0 40px 0",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: "1px solid #D1D1D6",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    boxSizing: "border-box",
    outline: "none",
  },
  signInButton: {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#FFFFFF",
    backgroundColor: "#007AFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    marginBottom: "16px",
  },
  rememberMeContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    marginRight: "8px",
    cursor: "pointer",
  },
  rememberMeLabel: {
    fontSize: "14px",
    color: "#000000",
    cursor: "pointer",
  },
  forgotPassword: {
    fontSize: "14px",
    color: "#666666",
    textAlign: "center",
    textDecoration: "none",
    marginTop: "8px",
  },
};

export default SignInScreen;
