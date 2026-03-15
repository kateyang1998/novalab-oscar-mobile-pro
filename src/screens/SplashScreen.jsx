import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoWhite from "../assets/logoWhite.png";

/**
 * Splash Screen Component
 * Initial loading screen that displays for 3 seconds
 * Automatically navigates to sign-in screen after timeout
 */
const SplashScreen = () => {
  const navigate = useNavigate();

  // Navigate to sign-in after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signin");
    }, 2000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <img src={logoWhite} alt="OSCAR Mobile Pro Logo" style={styles.logo} />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    /* Use OSCAR theme blue as background */
    background: "var(--oscar-blue)",
  },
  logo: {
    width: "100px",
    height: "140px",
    objectFit: "contain",
  },
};

export default SplashScreen;
