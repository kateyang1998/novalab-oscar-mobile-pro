const SplashScreen = () => {
  return (
    <div style={styles.container}>
      <h1>Splash Screen</h1>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    minHeight: "calc(100vh - 80px)",
  },
};

export default SplashScreen;
