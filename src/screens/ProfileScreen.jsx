const ProfileScreen = () => {
  return (
    <div style={styles.container}>
      <h1>Profile</h1>
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

export default ProfileScreen;
