import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

const MessagesView = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- FIX: Reset state when switching users (Logout/Login) ---
  useEffect(() => {
    setSelectedUser(null);
    setMessages([]);
  }, [currentUser?.uid]);

  // 1. Fetch Users (Opposite Role) - Realtime
  useEffect(() => {
    if (!currentUser) return;
    
    const usersRef = collection(db, "users");
    // If doctor, fetch patients. If patient, fetch doctors.
    const targetRole = currentUser.role === 'doctor' ? 'patient' : 'doctor';
    const q = query(usersRef, where("role", "==", targetRole));
    
    // Changed to onSnapshot for realtime updates of the user list
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 2. Listen for Messages - Realtime
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    // Create a unique chat ID based on both User IDs (sorted to ensure consistency)
    const chatId = [currentUser.uid, selectedUser.id].sort().join("_");
    
    const messagesRef = collection(db, "messages");
    
    // --- FIX: Removed orderBy from Firestore query ---
    // This ensures messages load even if the specific composite index is missing
    // and prevents pending messages (with null timestamp) from disappearing.
    const q = query(
      messagesRef, 
      where("chatId", "==", chatId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // --- FIX: Sort Client-Side ---
      // Handle null timestamps (pending writes) by treating them as "now"
      msgs.sort((a, b) => {
        const tA = a.createdAt ? a.createdAt.toMillis() : Date.now();
        const tB = b.createdAt ? b.createdAt.toMillis() : Date.now();
        return tA - tB;
      });

      setMessages(msgs);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser]);

  // 3. Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !currentUser) return;

    const chatId = [currentUser.uid, selectedUser.id].sort().join("_");

    try {
      await addDoc(collection(db, "messages"), {
        chatId,
        senderId: currentUser.uid,
        receiverId: selectedUser.id,
        text: newMessage,
        createdAt: serverTimestamp()
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    // Handle Firestore Timestamp or Date objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <style>{`
        .message-layout { display: flex; height: calc(100vh - 140px); gap: 20px; }
        .msg-sidebar { width: 300px; background: white; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .msg-list { flex: 1; overflow-y: auto; margin-top: 15px; }
        .msg-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .msg-item:hover { background: #f3f4f6; }
        .msg-item.active { background: #eff6ff; border-left: 3px solid #3b82f6; }
        .avatar { width: 40px; height: 40px; background: #e0e7ff; color: #3730a3; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .chat-area { flex: 1; background: white; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 2px 4px rgba(0,0,0,0.05); overflow: hidden; }
        .chat-header { padding: 15px 20px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; background: #fff; }
        .online-status { font-size: 12px; color: #10b981; font-weight: 500; }
        .chat-messages { flex: 1; padding: 20px; overflow-y: auto; background: #f9fafb; display: flex; flex-direction: column; gap: 10px; }
        .bubble { max-width: 70%; padding: 10px 15px; border-radius: 12px; font-size: 14px; line-height: 1.4; position: relative; }
        .bubble.sent { align-self: flex-end; background: #3b82f6; color: white; border-bottom-right-radius: 2px; }
        .bubble.received { align-self: flex-start; background: white; border: 1px solid #e5e7eb; color: #1f2937; border-bottom-left-radius: 2px; }
        .msg-meta-time { font-size: 10px; opacity: 0.7; margin-left: 8px; display: inline-block; }
        .chat-input-area { padding: 15px; background: white; border-top: 1px solid #f0f0f0; display: flex; gap: 10px; }
        .chat-input-area input { flex: 1; padding: 10px 15px; border: 1px solid #e5e7eb; border-radius: 20px; outline: none; transition: border-color 0.2s; }
        .chat-input-area input:focus { border-color: #3b82f6; }
        .send-btn { width: 40px; height: 40px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: background 0.2s; }
        .send-btn:hover { background: #2563eb; }
        .send-btn:disabled { background: #9ca3af; cursor: not-allowed; }
      `}</style>
      <div className="view-container message-layout">
        {/* Sidebar List */}
        <div className="msg-sidebar">
          <h3>{currentUser?.role === 'doctor' ? 'My Patients' : 'Available Doctors'}</h3>
          <div className="msg-list">
            {users.length === 0 ? (
              <p style={{padding: '20px', color: '#888', fontSize: '14px'}}>No users found.</p>
            ) : (
              users.map(user => (
                <div 
                  key={user.id} 
                  className={`msg-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="avatar">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                  <div className="msg-preview">
                    <h4>{user.fullName}</h4>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedUser ? (
            <>
              <div className="chat-header">
                <h4>{selectedUser.fullName}</h4>
                <span className="online-status">Active Now</span>
              </div>
              
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 mt-10">No messages yet. Say hello! 👋</div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.uid;
                  return (
                    <div key={msg.id} className={`bubble ${isMe ? 'sent' : 'received'}`}>
                      {msg.text}
                      <span className="msg-meta-time">{msg.createdAt ? formatTime(msg.createdAt) : '...'}</span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <User size={48} className="mb-4 opacity-20" />
              <p>Select a user from the sidebar to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagesView;
