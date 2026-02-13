import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoWhite from "../assets/logoWhite.png";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signin");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <img src={logoWhite} alt="OSCAR Mobile Logo" style={styles.logo} />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0066CC 0%, #004C99 100%)",
  },
  logo: {
    width: "100px",
    height: "140px",
    objectFit: "contain",
  },
};

export default SplashScreen;
