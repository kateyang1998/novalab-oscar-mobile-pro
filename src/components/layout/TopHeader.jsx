import React from 'react';
import { IconChevronLeft } from '../common/Icons';

const TopHeader = ({ title, onBack, showBack = true, right = null }) => {
  return (
    <div style={styles.header} className="top-bar">
      {/* inner container aligns header content with page content width */}
      <div className="container" style={styles.innerContainer}>
        <div style={styles.left}>
          {showBack ? (
            <button aria-label="Back" onClick={onBack} style={styles.backButton}>
              <IconChevronLeft size={24} color="var(--color-text)" />
            </button>
          ) : (
            <div style={{ width: 40 }} />
          )}
        </div>

        <div style={styles.center}>
          <h1 style={styles.title}>{title}</h1>
        </div>

        <div style={styles.right}>{right ? right : <div style={{ width: 40 }} />}</div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    background: 'var(--oscar-white)',
    borderBottom: '1px solid var(--color-neutral-2)',
    flexShrink: 0,
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0',
  },
  left: { display: 'flex', alignItems: 'center', width: 56 },
  center: { flex: 1, display: 'flex', justifyContent: 'center' },
  right: { display: 'flex', alignItems: 'center', width: 56, justifyContent: 'flex-end' },
  backButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--color-text)',
    margin: 0,
  },
};

export default TopHeader;

