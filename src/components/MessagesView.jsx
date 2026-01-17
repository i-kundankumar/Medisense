import React, { useState, useEffect, useRef } from 'react';
import { Send, User, FileText, Eye, X } from 'lucide-react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import logo from "../assets/logo.png";

const MessagesView = ({ currentUser, initialSelectedUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(initialSelectedUser || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [viewingPrescription, setViewingPrescription] = useState(null);

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

  useEffect(() => {
    if (initialSelectedUser) {
      setSelectedUser(initialSelectedUser);
    }
  }, [initialSelectedUser]);

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
              <p style={{ padding: '20px', color: '#888', fontSize: '14px' }}>No users found.</p>
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

                  if (msg.type === 'prescription' && msg.content) {
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} my-3`}>
                        <div className={`max-w-[280px] w-full bg-white rounded-2xl overflow-hidden shadow-sm border ${isMe ? 'border-blue-200' : 'border-gray-200'}`}>
                          {/* Card Header */}
                          <div className={`px-4 py-3 border-b ${isMe ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50/50 border-gray-100'} flex items-center gap-3`}>
                            <div className={`p-2 rounded-xl ${isMe ? 'bg-blue-500 text-white shadow-blue-200' : 'bg-white text-blue-600 shadow-sm border border-gray-100'}`}>
                              <FileText size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prescription</p>
                              <p className="text-sm font-bold text-slate-800 truncate">{msg.content.diagnosis || 'General'}</p>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-4">
                            <div className="space-y-2 mb-4">
                              {msg.content.medications?.slice(0, 3).map((med, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs">
                                  <div className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0"></div>
                                  <div>
                                    <span className="font-semibold text-slate-700">{med.name}</span>
                                    <span className="text-slate-400 ml-1">{med.dosage}</span>
                                  </div>
                                </div>
                              ))}
                              {(msg.content.medications?.length > 3) && (
                                <p className="text-[10px] font-medium text-slate-400 pl-3">+ {msg.content.medications.length - 3} more items</p>
                              )}
                            </div>

                            <button
                              onClick={() => setViewingPrescription(msg.content)}
                              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isMe
                                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                                }`}
                            >
                              <Eye size={14} /> View Prescription
                            </button>
                          </div>

                          {/* Card Footer */}
                          <div className="px-4 pb-2 text-[10px] text-slate-400 flex justify-between items-center">
                            <span>Dr. {msg.content.doctorName?.split(' ')[0]}</span>
                            <span>{msg.createdAt ? formatTime(msg.createdAt) : '...'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

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

      {/* Prescription View Modal */}
      {viewingPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileText size={16} className="text-blue-600" /> Prescription View
              </h3>
              <button onClick={() => setViewingPrescription(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white relative">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <img src={logo} alt="" className="w-80 h-80 object-contain grayscale" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-8 relative z-10">
                <div>
                  <img src={logo} alt="Medisense" className="h-20 w-auto object-contain" />
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-serif font-bold text-blue-900">Dr. {viewingPrescription.doctorName}</h3>
                  <p className="text-sm text-slate-600 font-medium">General Physician</p>
                  <p className="text-sm text-slate-500">Reg. No: {viewingPrescription.doctorRegId || 'N/A'}</p>
                  <p className="text-sm text-slate-500 mt-1">{new Date(viewingPrescription.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-8 relative z-10 px-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</h4>
                <p className="text-lg font-medium text-slate-900">{viewingPrescription.diagnosis}</p>
              </div>

              {/* Rx */}
              <div className="flex-1 relative z-10 px-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-4xl font-serif font-bold text-blue-900 italic">Rx</span>
                </div>
                <div className="space-y-6 pl-2">
                  {viewingPrescription.medications?.map((med, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-blue-200">
                      <div className="flex justify-between items-baseline">
                        <p className="font-bold text-slate-900 text-lg">{med.name} <span className="text-sm font-normal text-slate-500 ml-2">{med.dosage}</span></p>
                      </div>
                      <p className="text-sm text-slate-600 mt-1 font-medium">
                        {med.frequency} <span className="mx-2 text-gray-300">•</span> {med.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {viewingPrescription.notes && (
                <div className="mt-8 pt-6 border-t border-dashed border-gray-200 relative z-10 px-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Advice / Notes</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{viewingPrescription.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-16 pt-8 flex justify-between items-end relative z-10">
                <div className="text-xs text-slate-400">
                  <p className="font-bold text-blue-900">Medisense Healthcare</p>
                  <p>Digital Prescription</p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-40 mb-2 flex items-end justify-center">
                    <span className="font-serif italic text-2xl text-blue-900 opacity-80">Dr. {viewingPrescription.doctorName.split(' ')[0]}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 border-t border-slate-300 pt-2 px-8 uppercase tracking-wide">Doctor's Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesView;
