import { useState, useEffect } from "react";
import TopHeader from "../components/layout/TopHeader";

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

  // Fetch messages when component mounts
  useEffect(() => {
    // TODO: Replace this with actual data
    const fetchMessages = async () => {
      setLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Sample messages data - will be replaced with dynamic data (API call)
      const mockMessages = [
        {
          id: "1",
          sender: "Robert Brown",
          subject: "Consultation Note",
          preview: "Patient seen for tachycardia. Recommend dosage adjustment. Lorem...",
          fullContent:
            "Patient seen for tachycardia. Recommend dosage adjustment. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          time: "10:30 AM",
          isRead: false,
        },
        {
          id: "2",
          sender: "Robert Brown",
          subject: "Consultation Note",
          preview: "Patient seen for tachycardia. Recommend dosage adjustment.",
          fullContent:
            "Patient seen for tachycardia. Recommend dosage adjustment. Complete follow-up examination scheduled for next week.",
          time: "10:30 AM",
          isRead: false,
        },
        {
          id: "3",
          sender: "Robert Brown",
          subject: "Consultation Note",
          preview: "Patient seen for tachycardia. Recommend dosage adjustment.",
          fullContent:
            "Patient seen for tachycardia. Recommend dosage adjustment. Blood pressure is stable.",
          time: "10:30 AM",
          isRead: true,
        },
        {
          id: "4",
          sender: "Robert Brown",
          subject: "Consultation Note",
          preview: "Patient seen for tachycardia. Recommend dosage adjustment.",
          fullContent:
            "Patient seen for tachycardia. Recommend dosage adjustment. Patient responded well to treatment.",
          time: "10:30 AM",
          isRead: true,
        },
      ];

      setMessages(mockMessages);
      setLoading(false);
    };

    fetchMessages();
  }, []);

  const handleMessageClick = (messageId) => {
    // Toggle expand/collapse
    if (expandedMessageId === messageId) {
      setExpandedMessageId(null);
    } else {
      setExpandedMessageId(messageId);
      // Mark message as read when expanded
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    }
  };

  const handleMarkAllRead = () => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
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
      {/* Header */}
      <TopHeader
        title="Inbox"
        showBack={false}
        right={<button style={styles.markAllReadButton} onClick={handleMarkAllRead}>Mark all read</button>}
      />

      {/* Messages List */}
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
                  <h3 style={styles.messageSender}>{message.sender}</h3>
                  <span style={styles.messageTime}>{message.time}</span>
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
    backgroundColor: "#E8E8E8",
    minHeight: "100vh",
    paddingBottom: "80px",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #E0E0E0",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#000000",
    margin: "0",
  },
  markAllReadButton: {
    background: "none",
    border: "none",
    fontSize: "14px",
    color: "#8E8E93",
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
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
    borderLeft: "4px solid transparent",
  },
  unreadMessage: {
    borderLeft: "4px solid #007AFF",
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
    color: "#000000",
    margin: "0",
  },
  messageTime: {
    fontSize: "13px",
    color: "#8E8E93",
  },
  messageSubject: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
    margin: "0 0 8px 0",
  },
  messageContent: {
    fontSize: "13px",
    color: "#666666",
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
    color: "#8E8E93",
  },
  emptyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#8E8E93",
  },
};

export default InboxScreen;
