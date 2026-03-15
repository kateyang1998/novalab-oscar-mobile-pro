import React from 'react';
import theme from '../../styles/theme';

const Modal = ({ children, onDismiss }) => {
  return (
    <div style={styles.overlay} onClick={onDismiss}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  },
  container: {
    backgroundColor: theme.colors.oscarWhite,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    boxShadow: theme.shadows.lg,
  },
};

export default Modal;


