import React, { useState, useEffect } from 'react';

interface Chat {
  id: number;
  userA: { id: number; name: string; userCode: string };
  userB: { id: number; name: string; userCode: string };
  lastMessage: string;
  lastMessageDate: string;
  messageCount: number;
}

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
}

const ChatLogs: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => {
      setChats([
        {
          id: 1,
          userA: { id: 1, name: 'Sundararajan', userCode: 'NN#00001' },
          userB: { id: 2, name: 'Kalaivani', userCode: 'NN#00002' },
          lastMessage: 'Hello, how are you?',
          lastMessageDate: '2024-09-23 10:30 AM',
          messageCount: 15,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setMessages([
        { id: 1, senderId: 1, senderName: 'Sundararajan', message: 'Hello!', timestamp: '2024-09-23 10:00 AM' },
        { id: 2, senderId: 2, senderName: 'Kalaivani', message: 'Hi there!', timestamp: '2024-09-23 10:05 AM' },
        { id: 3, senderId: 1, senderName: 'Sundararajan', message: 'How are you?', timestamp: '2024-09-23 10:10 AM' },
        { id: 4, senderId: 2, senderName: 'Kalaivani', message: 'I am good, thank you!', timestamp: '2024-09-23 10:15 AM' },
      ]);
    }
  }, [selectedChat]);

  const handleExportPDF = () => {
    alert('Exporting chat to PDF...');
    // TODO: Implement PDF export
  };

  const totalPages = Math.ceil(chats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedChats = chats.slice(startIndex, endIndex);

  if (loading) return <div className="chat-loading">Loading chats...</div>;

  return (
    <div className="chat-logs-page">
      <div className="chat-header">
        <h1>Messaging & Chat Logs</h1>
        {selectedChat && (
          <button onClick={handleExportPDF} className="btn-export">📄 Export PDF</button>
        )}
      </div>

      <div className="chat-content">
        <div className="chats-list">
          <h2>Chat List</h2>
          {paginatedChats.length === 0 ? (
            <div className="no-chats">No chats found</div>
          ) : (
            paginatedChats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? 'selected' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="chat-users">
                  <div className="user-info">
                    <strong>{chat.userA.name}</strong> ↔ <strong>{chat.userB.name}</strong>
                  </div>
                  <div className="user-codes">
                    {chat.userA.userCode} ↔ {chat.userB.userCode}
                  </div>
                </div>
                <div className="chat-preview">
                  <p>{chat.lastMessage}</p>
                  <span className="chat-meta">
                    {chat.messageCount} messages • {chat.lastMessageDate}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedChat && (
          <div className="messages-panel">
            <div className="panel-header">
              <h2>
                {selectedChat.userA.name} ↔ {selectedChat.userB.name}
              </h2>
            </div>
            <div className="messages-timeline">
              {messages.map(msg => (
                <div key={msg.id} className={`message-item ${msg.senderId === selectedChat.userA.id ? 'user-a' : 'user-b'}`}>
                  <div className="message-header">
                    <strong>{msg.senderName}</strong>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {chats.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, chats.length)} of {chats.length} chats
            </div>
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="pagination-btn"
              >
                ← Previous
              </button>
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="pagination-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLogs;

