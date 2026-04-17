import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { motion } from 'framer-motion';
import { Send, Smile, User, Search, MoreVertical, CheckCheck } from 'lucide-react';

const socket = io("https://snj-global-agency-backend.onrender.com");

const Inbox = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const scrollRef = useRef();

    const adminId = 1;

    useEffect(() => {
        const fetchChatList = async () => {
            const res = await axios.get("https://snj-global-agency-backend.onrender.com/api/messages/chat-list");
            setUsers(res.data.users);
        };
        fetchChatList();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            const room = [adminId, selectedUser.id].sort().join("_");
            socket.emit("join_chat", { room });

            const fetchHistory = async () => {
                const res = await axios.get(`https://snj-global-agency-backend.onrender.com/api/messages/history/${adminId}/${selectedUser.id}`);
                setMessages(res.data.messages);
            };
            fetchHistory();
        }
    }, [selectedUser]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });
        return () => socket.off("receive_message");
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const room = [adminId, selectedUser.id].sort().join("_");
        const messageData = {
            room,
            sender_id: adminId,
            receiver_id: selectedUser.id,
            message: newMessage,
            created_at: new Date()
        };

        socket.emit("send_message", messageData);
        await axios.post("https://snj-global-agency-backend.onrender.com/api/messages/send", messageData);

        setNewMessage("");
        setShowEmoji(false);
    };

    const onEmojiClick = (emojiData) => {
        setNewMessage(prev => prev + emojiData.emoji);
    };

    return (
        <div className="flex h-[85vh] bg-white rounded-lg overflow-hidden border border-slate-200 shadow-xl mx-4 my-6 font-['Times_New_Roman',_serif]">
            
            {/* --- SIDEBAR: User List --- */}
            <div className="w-1/3 border-r border-slate-100 bg-[#f8fafc] flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-[28px] font-bold text-[#0B1F3A] uppercase tracking-tighter mb-4 italic">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-[#64748B]" size={18} />
                        <input 
                            className="w-full bg-white border border-slate-200 rounded-sm py-3 pl-10 pr-4 outline-none focus:border-[#0B1F3A] transition-all text-sm font-serif" 
                            placeholder="Search correspondence..." 
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {users.map(user => (
                        <div 
                            key={user.id} 
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center gap-4 p-5 cursor-pointer border-b border-slate-50 transition-all ${selectedUser?.id === user.id ? 'bg-white border-l-4 border-l-[#EAB308]' : 'hover:bg-slate-100/50'}`}
                        >
                            <div className="h-12 w-12 rounded-full bg-[#0B1F3A] flex items-center justify-center text-[#EAB308] font-bold text-lg border border-[#EAB308]/20">
                                {user.full_name[0]}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[#0F172A] font-bold text-[16px]">{user.full_name}</h4>
                                <p className="text-[13px] text-[#64748B] italic truncate leading-[1.6]">Click to view conversation</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- CHAT WINDOW --- */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#0B1F3A] border border-slate-100">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="text-[#0B1F3A] font-bold text-lg leading-none">{selectedUser.full_name}</h3>
                                    <span className="text-[10px] text-[#EAB308] uppercase font-bold tracking-widest italic">Active Session</span>
                                </div>
                            </div>
                            <MoreVertical className="text-[#64748B] cursor-pointer" />
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fafafa]">
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx} 
                                    className={`flex ${msg.sender_id === adminId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-4 shadow-sm text-[16px] leading-[1.6] ${msg.sender_id === adminId ? 'bg-[#0B1F3A] text-white rounded-sm' : 'bg-white text-[#64748B] border border-slate-100 rounded-sm'}`}>
                                        {msg.message}
                                        <div className={`flex items-center gap-1 mt-2 text-[10px] uppercase font-bold tracking-tighter ${msg.sender_id === adminId ? 'justify-end text-[#EAB308]' : 'text-[#94a3b8]'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {msg.sender_id === adminId && <CheckCheck size={12} />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={sendMessage} className="p-6 bg-white flex items-center gap-4 border-t border-slate-100 relative">
                            {showEmoji && (
                                <div className="absolute bottom-24 left-6 z-50 shadow-2xl">
                                    <EmojiPicker theme="light" onEmojiClick={onEmojiClick} />
                                </div>
                            )}
                            <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="text-[#64748B] hover:text-[#0B1F3A] transition-colors">
                                <Smile size={24} />
                            </button>
                            <input 
                                className="flex-1 bg-[#f8fafc] border border-slate-200 rounded-sm py-4 px-6 outline-none focus:border-[#0B1F3A] text-[#0F172A] font-serif italic text-lg shadow-inner"
                                placeholder="Write your response..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="bg-[#EAB308] p-4 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white transition-all shadow-md group">
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#64748B]">
                        <div className="w-24 h-24 bg-[#f8fafc] border border-slate-100 rounded-full flex items-center justify-center mb-6">
                             <Send size={32} className="text-[#0B1F3A]/20" />
                        </div>
                        <h2 className="text-[28px] font-bold text-[#0B1F3A] uppercase tracking-widest italic">Select Correspondence</h2>
                        <p className="text-[16px] mt-2">Choose a candidate from the list to begin auditing messages.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;