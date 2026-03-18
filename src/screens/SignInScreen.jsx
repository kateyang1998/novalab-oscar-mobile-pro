import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoBlue from "../assets/logoBlue.png";
import TextInput from "../components/common/TextInput";

/**
 * Sign In Screen Component
 * Authenticates against POST /api/auth/login
 * User ID format: CL000001 (shown on Profile screen)
 * Default credentials: CL000001 / oscar123
 */
const SignInScreen = () => {
  const navigate = useNavigate();

  const [userId, setUserId]       = useState("");
  const [password, setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("Please enter your User ID and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
        return;
      }

      navigate("/home");
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.container, backgroundColor: 'var(--oscar-gray)' }}>
      <div style={styles.content}>
        <img src={logoBlue} alt="OSCAR Mobile Pro Logo" style={{ ...styles.logo, filter: 'none' }} />

        <h1 style={styles.title}>OSCAR Mobile Pro</h1>
        <p style={styles.subtitle}>Electronic Medical Records</p>

        <form onSubmit={handleSignIn} style={styles.form}>
          <TextInput label="User ID" value={userId} onChange={setUserId} placeholder="e.g. CL000001" />
          <TextInput label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" />

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'SIGNING IN…' : 'SIGN IN'}
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

          <p style={styles.hint}>Demo credentials: CL000001 / oscar123</p>
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
    backgroundColor: "var(--oscar-gray)",
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
    color: "var(--oscar-black)",
    margin: "0 0 5px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--pale-sky)",
    margin: "0 0 40px 0",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  errorText: {
    fontSize: "13px",
    color: "var(--oscar-red, #e53935)",
    margin: "0 0 12px 0",
    textAlign: "center",
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
    color: "var(--oscar-black)",
    cursor: "pointer",
  },
  hint: {
    fontSize: "12px",
    color: "var(--pale-sky)",
    textAlign: "center",
    margin: "4px 0 0 0",
  },
};

export default SignInScreen;
