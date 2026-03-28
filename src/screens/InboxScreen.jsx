import { useState, useEffect } from "react";
import TopHeader from "../components/layout/TopHeader";
import theme from '../styles/theme';

/**
 * Inbox Screen Component
 * Displays a list of messages with expand/collapse functionality
 * Shows unread messages with a blue left border
 * Supports marking all messages as read
 */
const InboxScreen = () => {
  const [messages, setMessages] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/messages')
      .then(r => r.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setMessages([]);
        setLoading(false);
      });
  }, []);

  const handleMessageClick = (messageId) => {
    if (expandedMessageId === messageId) {
      setExpandedMessageId(null);
    } else {
      setExpandedMessageId(messageId);
      // Mark read locally
      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg)
      );
      // Persist to server
      fetch(`/api/messages/${messageId}/read`, { method: 'PATCH' }).catch(() => {});
    }
  };

  const handleMarkAllRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
    fetch('/api/messages/read-all', { method: 'PATCH' }).catch(() => {});
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <TopHeader
        title="Inbox"
        showBack={false}
        right={<button style={styles.markAllReadButton} onClick={handleMarkAllRead}>Mark all read</button>}
      />

      <div style={styles.messagesList}>
        {messages.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText}>No messages</p>
          </div>
        ) : (
          messages.map((message) => {
            const isExpanded = expandedMessageId === message.id;
            return (
              <div
                key={message.id}
                style={{
                  ...styles.messageCard,
                  ...(message.isRead ? {} : styles.unreadMessage),
                }}
                onClick={() => handleMessageClick(message.id)}
              >
                <div style={styles.messageHeader}>
                  <h3 style={message.isRead ? styles.messageSender : { ...styles.messageSender, color: theme.colors.oscarBlue }}>
                    {message.sender}
                  </h3>
                  <span style={message.isRead ? styles.messageTime : { ...styles.messageTime, color: theme.colors.oscarBlue }}>
                    {message.time}
                  </span>
                </div>
                <p style={styles.messageSubject}>{message.subject}</p>
                <p style={styles.messageContent}>
                  {isExpanded ? message.fullContent : message.preview}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: theme.colors.oscarGray,
    minHeight: "100vh",
    paddingBottom: "80px",
    fontFamily: theme.font.family,
  },
  markAllReadButton: {
    background: "none",
    border: "none",
    fontSize: "14px",
    color: theme.colors.paleSky,
    cursor: "pointer",
    padding: "0",
  },
  messagesList: {
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  messageCard: {
    backgroundColor: theme.colors.oscarWhite,
    borderRadius: theme.radius.md,
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
    borderLeft: "4px solid transparent",
  },
  unreadMessage: {
    borderLeft: `4px solid ${theme.colors.oscarBlue}`,
  },
  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  messageSender: {
    fontSize: "16px",
    fontWeight: "700",
    color: theme.colors.oscarBlack,
    margin: "0",
  },
  messageTime: {
    fontSize: "13px",
    color: theme.colors.paleSky,
  },
  messageSubject: {
    fontSize: "14px",
    fontWeight: "600",
    color: theme.colors.oscarBlack,
    margin: "0 0 8px 0",
  },
  messageContent: {
    fontSize: "13px",
    color: theme.colors.paleSky,
    margin: "0",
    lineHeight: "1.5",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
  },
  loadingText: {
    fontSize: "16px",
    color: theme.colors.paleSky,
  },
  emptyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
  },
  emptyText: {
    fontSize: "16px",
    color: theme.colors.paleSky,
  },
};

export default InboxScreen;
