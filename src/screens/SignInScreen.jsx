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
  const [fieldErrors, setFieldErrors] = useState({ userId: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal]       = useState(false);
  const [forgotUserId, setForgotUserId]             = useState("");
  const [forgotStatus, setForgotStatus]             = useState(""); // "success" | "error" | ""
  const [forgotMessage, setForgotMessage]           = useState("");
  const [forgotLoading, setForgotLoading]           = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation: ensure both fields are non-empty
    const newFieldErrors = { userId: '', password: '' };
    if (!userId.trim()) newFieldErrors.userId = 'Please enter your User ID.';
    if (!password.trim()) newFieldErrors.password = 'Please enter your password.';
    setFieldErrors(newFieldErrors);

    if (newFieldErrors.userId || newFieldErrors.password) {
      // Do not attempt network request if client-side validation fails
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
        // Show server error as a general message (do not mark fields red for authentication failure)
        setFieldErrors({ userId: '', password: '' });
        setError(data.error || "Invalid user id or password.");
        return;
      }

      navigate("/home");
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotStatus("");
    setForgotMessage("");

    if (!forgotUserId.trim()) {
      setForgotStatus("error");
      setForgotMessage("Please enter your User ID.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: forgotUserId.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setForgotStatus("error");
        setForgotMessage(data.error || 'User ID not found.');
      } else {
        setForgotStatus("success");
        setForgotMessage("Your password has been reset to: oscar123");
      }
    } catch {
      setForgotStatus("error");
      setForgotMessage("Could not connect to server. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotUserId("");
    setForgotStatus("");
    setForgotMessage("");
  };

  return (
    <div style={{ ...styles.container, backgroundColor: 'var(--oscar-gray)' }}>
      <div style={styles.content}>
        <img src={logoBlue} alt="OSCAR Mobile Pro Logo" style={{ ...styles.logo, filter: 'none' }} />

        <h1 style={styles.title}>OSCAR Mobile Pro</h1>
        <p style={styles.subtitle}>Electronic Medical Records</p>

        <form onSubmit={handleSignIn} style={styles.form}>
          <TextInput id="signin-userid" label="User ID" value={userId} onChange={(v) => { setUserId(v); if (fieldErrors.userId) setFieldErrors(fe => ({ ...fe, userId: '' })); setError(''); }} placeholder="e.g. CL000001" error={fieldErrors.userId} />
          <TextInput id="signin-password" label="Password" type="password" value={password} onChange={(v) => { setPassword(v); if (fieldErrors.password) setFieldErrors(fe => ({ ...fe, password: '' })); setError(''); }} placeholder="Enter your password" error={fieldErrors.password} />

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

          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            style={styles.forgotPassword}
          >
            Forgot Password?
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Reset Password</h2>
            <p style={styles.modalSubtitle}>
              Enter your User ID and your password will be reset to the default.
            </p>

            {forgotStatus !== "success" && (
              <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <TextInput
                  id="forgot-userid"
                  label="User ID"
                  value={forgotUserId}
                  onChange={(v) => { setForgotUserId(v); if (forgotStatus) { setForgotStatus(''); setForgotMessage(''); } }}
                  placeholder="e.g. CL000001"
                  error={forgotStatus === 'error' ? forgotMessage : ''}
                />
                <div style={styles.modalButtons}>
                  <button
                    type="submit"
                    className="btn btn-caution"
                    disabled={forgotLoading}
                    style={{ flex: 1 }}
                  >
                    {forgotLoading ? 'Resetting…' : 'Reset'}
                  </button>
                  <button type="button" className="btn btn-cancel" style={{ flex: 1 }} onClick={closeForgotModal}>Cancel</button>
                </div>
              </form>
            )}

            {forgotStatus === "success" && (
              <>
                <div style={styles.successBox}>
                  <p style={styles.successText}>{forgotMessage}</p>
                </div>
                <div style={styles.modalButtons}>
                  <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={closeForgotModal}>Done</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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
  forgotPassword: {
    background: "none",
    border: "none",
    fontSize: "14px",
    color: "var(--pale-sky)",
    textAlign: "center",
    cursor: "pointer",
    padding: "0",
    marginBottom: "8px",
  },
  // Modal styles
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "var(--oscar-white, #fff)",
    borderRadius: "12px",
    padding: "24px",
    width: "100%",
    maxWidth: "340px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--oscar-black)",
    margin: 0,
  },
  modalSubtitle: {
    fontSize: "14px",
    color: "var(--pale-sky)",
    margin: 0,
  },
  successBox: {
    backgroundColor: "var(--oscar-white)",
    borderRadius: "8px",
    padding: "12px",
  },
  successText: {
    fontSize: "14px",
    color: "var(--oscar-green, #43a047)",
    margin: 0,
    textAlign: "center",
  },
  modalButtons: {
    display: 'flex',
    gap: 8,
    marginTop: 8,
  },
};

export default SignInScreen;
