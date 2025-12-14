import React from 'react';
import { Send } from 'lucide-react';

const MessagesView = () => {
  return (
    <div className="view-container message-layout">
      {/* Sidebar List */}
      <div className="msg-sidebar">
        <h3>Messages</h3>
        <div className="msg-list">
          <div className="msg-item active">
            <div className="avatar">R</div>
            <div className="msg-preview">
              <h4>Dr. Roy</h4>
              <p>Can you check the report?</p>
            </div>
            <span className="msg-time">10:00</span>
          </div>
          <div className="msg-item">
            <div className="avatar">S</div>
            <div className="msg-preview">
              <h4>Sister Ann</h4>
              <p>Patient in Room 3 is ready.</p>
            </div>
            <span className="msg-time">09:45</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <h4>Dr. Roy</h4>
          <span className="online-status">Online</span>
        </div>
        <div className="chat-messages">
          <div className="bubble received">Hi Doctor, did you see the X-Ray?</div>
          <div className="bubble sent">Yes, looking at it right now.</div>
          <div className="bubble received">Great, let me know.</div>
        </div>
        <div className="chat-input-area">
          <input type="text" placeholder="Type a message..." />
          <button className="send-btn"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;