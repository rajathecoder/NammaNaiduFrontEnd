import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import verifiedBadge from '../../assets/images/verified-badge.png';

// Mock data for messages list
const MOCK_CONVERSATIONS = [
    {
        id: '1',
        name: 'Keerthana M',
        avatar: 'K',
        lastMessage: 'Hi, I saw your profile and found it interesting.',
        time: '10:30 AM',
        unread: 2,
        online: true,
        pinned: false
    },
    {
        id: '2',
        name: 'Mansi',
        avatar: 'M',
        lastMessage: 'Sure, let\'s connect this weekend.',
        time: 'Yesterday',
        unread: 0,
        online: false,
        pinned: false
    },
    {
        id: '3',
        name: 'Dhanalakshmi',
        avatar: 'D',
        lastMessage: 'Thank you for your interest.',
        time: 'Yesterday',
        unread: 0,
        online: true,
        pinned: false
    },
    {
        id: '4',
        name: 'Ramya',
        avatar: 'R',
        lastMessage: 'Can you share more details about your family?',
        time: '2 days ago',
        unread: 1,
        online: false,
        pinned: true
    }
];

// Mock data for chat history
const MOCK_CHATS: Record<string, any> = {
    '1': {
        name: 'Keerthana M',
        avatar: 'K',
        online: true,
        messages: [
            { id: 1, text: 'Hi, I saw your profile and found it interesting.', sender: 'them', time: '10:30 AM', read: true },
            { id: 2, text: 'Hello! Thank you. I liked your profile too.', sender: 'me', time: '10:32 AM', read: true },
            { id: 3, text: 'That is great to hear! What do you do for work?', sender: 'them', time: '10:33 AM', read: true }
        ]
    },
    '2': {
        name: 'Mansi',
        avatar: 'M',
        online: false,
        messages: [
            { id: 1, text: 'Hi there!', sender: 'me', time: 'Yesterday', read: true },
            { id: 2, text: 'Hello! How are you?', sender: 'them', time: 'Yesterday', read: true },
            { id: 3, text: 'I am good, thanks. Sure, let\'s connect this weekend.', sender: 'them', time: 'Yesterday', read: true }
        ]
    }
};

const MessagesList = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [conversations] = useState(MOCK_CONVERSATIONS);
    const [activeFilter, setActiveFilter] = useState('All');

    // Chat state
    const [messageInput, setMessageInput] = useState('');
    const [chatData, setChatData] = useState<any>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const [isChatListMinimized, setIsChatListMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const chatMenuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
            if (chatMenuRef.current && !chatMenuRef.current.contains(event.target as Node)) {
                setShowChatMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Load chat data when ID changes
    useEffect(() => {
        if (id) {
            if (MOCK_CHATS[id]) {
                setChatData(MOCK_CHATS[id]);
            } else {
                setChatData({
                    name: 'User',
                    avatar: 'U',
                    online: false,
                    messages: []
                });
            }
        } else {
            setChatData(null);
        }
    }, [id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (chatData) {
            scrollToBottom();
        }
    }, [chatData]);

    const handleChatClick = (chatId: string) => {
        navigate(`/messages/${chatId}`);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: messageInput,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
        };

        setChatData((prev: any) => ({
            ...prev,
            messages: [...prev.messages, newMessage]
        }));
        setMessageInput('');
    };

    const filteredConversations = conversations.filter(conv => {
        if (activeFilter === 'Unread') return conv.unread > 0;
        return true;
    });

    const chatBackgroundUrl = "/matrimony_chat_background_1767129611670.png";

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex flex-col font-['Outfit',sans-serif]">
            <Header />
            <div className="flex-1 w-full flex overflow-hidden h-[calc(100vh-80px)] bg-white shadow-2xl relative">

                {/* Left Sidebar - Chat List */}
                <div className={`
                    ${isChatListMinimized ? 'w-[80px]' : 'w-[32%] min-w-[340px]'} 
                    border-r border-gray-200 flex flex-col bg-white transition-all duration-300 relative z-20
                `}>
                    {/* Sidebar Header */}
                    <div className="h-[70px] px-4 bg-[#f0f2f5] flex items-center justify-between border-b border-gray-100">
                        {!isChatListMinimized ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FB34AA] to-[#C204E7] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-200 ring-2 ring-white">
                                        JD
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 m-0 tracking-tight">Chats</h2>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-all text-gray-500 hover:text-gray-800">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                    <div className="relative" ref={menuRef}>
                                        <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-all text-gray-500 hover:text-gray-800">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                        </button>
                                        {showMenu && (
                                            <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 min-w-[180px] z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                                <button className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">New Group</button>
                                                <button className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Settings</button>
                                                <hr className="my-1 border-gray-100" />
                                                <button className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Archived</button>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => setIsChatListMinimized(true)} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-all text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button onClick={() => setIsChatListMinimized(false)} className="w-10 h-10 mx-auto rounded-full hover:bg-gray-200 flex items-center justify-center transition-all text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                            </button>
                        )}
                    </div>

                    {!isChatListMinimized && (
                        <>
                            {/* Search & Filters */}
                            <div className="px-4 py-3 bg-white border-b border-gray-50">
                                <div className="relative group">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#C204E7] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search messages..."
                                        className="w-full py-3 pl-12 pr-4 bg-gray-100 focus:bg-white border-transparent focus:border-[#C204E710] rounded-2xl text-[15px] font-medium outline-none transition-all focus:ring-4 focus:ring-[#C204E705]"
                                    />
                                </div>
                                <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                                    {['All', 'Unread', 'Favorites'].map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeFilter === filter
                                                    ? 'bg-[#1a1a1a] text-white shadow-lg shadow-gray-200'
                                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chat List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {filteredConversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        className={`flex px-4 py-4 cursor-pointer transition-all border-b border-gray-50 relative group ${id === conv.id ? 'bg-[#f0f2f5]' : 'bg-white hover:bg-gray-50'
                                            }`}
                                        onClick={() => handleChatClick(conv.id)}
                                    >
                                        <div className="relative mr-4 shrink-0">
                                            <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#FB34AA] to-[#C204E7] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-[#FB34AA10] group-hover:scale-105 transition-transform duration-300">
                                                {conv.avatar}
                                            </div>
                                            {conv.online && (
                                                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25D366] border-4 border-white rounded-full shadow-sm"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <h3 className="font-black text-gray-800 text-[16px] m-0 truncate">{conv.name}</h3>
                                                </div>
                                                <span className={`text-[11px] font-bold ${conv.unread > 0 ? 'text-[#C204E7]' : 'text-gray-400'}`}>{conv.time}</span>
                                            </div>
                                            <div className="flex justify-between items-center gap-3">
                                                <p className={`text-[13px] truncate m-0 flex-1 leading-tight ${conv.unread > 0 ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'}`}>
                                                    {conv.lastMessage}
                                                </p>
                                                {conv.unread > 0 && (
                                                    <span className="bg-[#C204E7] text-white text-[10px] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full font-black animate-pulse">
                                                        {conv.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {isChatListMinimized && (
                        <div className="flex-1 flex flex-col items-center py-6 gap-6 overflow-y-auto">
                            {conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    onClick={() => handleChatClick(conv.id)}
                                    className={`relative cursor-pointer group transition-all ${id === conv.id ? 'scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-[#f0f2f5] flex items-center justify-center font-black text-[#1a1a1a] shadow-sm border border-gray-100">
                                        {conv.avatar}
                                    </div>
                                    {conv.unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C204E7] rounded-full border-2 border-white"></span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side - Chat Window */}
                <div className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden">
                    {id && chatData ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-[70px] px-6 bg-[#f0f2f5]/90 backdrop-blur-md flex items-center justify-between border-b border-gray-200 z-10 sticky top-0">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-[15px] bg-white flex items-center justify-center shadow-sm border border-gray-100 font-black text-gray-800 text-lg">
                                            {chatData.avatar}
                                        </div>
                                        {chatData.online && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#25D366] border-[3px] border-[#f0f2f5] rounded-full"></span>}
                                    </div>
                                    <div>
                                        <h3 className="m-0 text-[17px] font-black text-gray-900 leading-tight">{chatData.name}</h3>
                                        <p className={`m-0 text-[11px] font-bold uppercase tracking-wider ${chatData.online ? 'text-[#25D366]' : 'text-gray-400'}`}>
                                            {chatData.online ? 'Online now' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
                                    <button className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg></button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4 relative">
                                {/* Matrimony Doodle Background */}
                                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url(${chatBackgroundUrl})`, backgroundSize: '400px' }} />

                                <div className="flex flex-col gap-2 relative z-10 w-full max-w-4xl mx-auto">
                                    <div className="text-center my-6">
                                        <span className="bg-white/50 backdrop-blur-sm text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-5 py-2 rounded-full border border-white/50 shadow-sm">Today</span>
                                    </div>

                                    {chatData.messages.map((msg: any) => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                            <div className={`
                                                relative max-w-[75%] px-4 py-3 rounded-2xl shadow-sm
                                                ${msg.sender === 'me'
                                                    ? 'bg-gradient-to-br from-[#FB34AA] to-[#C204E7] text-white rounded-tr-none'
                                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}
                                            `}>
                                                <p className="text-[15px] font-medium leading-relaxed m-0 mb-1">{msg.text}</p>
                                                <div className="flex items-center justify-end gap-1 px-1">
                                                    <span className={`text-[10px] font-bold uppercase ${msg.sender === 'me' ? 'text-white/80' : 'text-gray-400'}`}>{msg.time}</span>
                                                    {msg.sender === 'me' && (
                                                        <svg className="w-3.5 h-3.5 text-white/90" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" /></svg>
                                                    )}
                                                </div>
                                                {/* Tail Effect */}
                                                <div className={`absolute top-0 ${msg.sender === 'me' ? '-right-2 text-[#C204E7]' : '-left-2 text-white'}`}>
                                                    <svg width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d={msg.sender === 'me' ? "M0 0 L12 0 L0 12 Z" : "M0 0 L12 0 L12 12 Z"} /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Message Input Container */}
                            <div className="px-6 py-6 bg-white border-t border-gray-100 z-10">
                                <form className="max-w-4xl mx-auto flex items-center gap-4 bg-gray-50 p-2 rounded-[24px] border border-gray-200 shadow-inner" onSubmit={handleSendMessage}>
                                    <button type="button" className="w-12 h-12 rounded-2xl hover:bg-white flex items-center justify-center text-gray-400 transition-all hover:shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>
                                    <input
                                        type="text"
                                        placeholder="Type your message here..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        className="flex-1 py-3 px-4 bg-transparent border-none text-[15px] font-medium outline-none text-gray-800 placeholder:text-gray-400"
                                    />
                                    <button type="button" className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-gray-400 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim()}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg ${messageInput.trim() ? 'bg-gradient-to-br from-[#FB34AA] to-[#C204E7] shadow-[#FB34AA30] scale-100' : 'bg-gray-300 scale-95 cursor-not-allowed opacity-50'}`}
                                    >
                                        <svg className="w-6 h-6 rotate-45" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center max-w-sm px-6">
                                <div className="w-24 h-24 bg-white rounded-[40px] shadow-xl shadow-gray-200 flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce transition-all">✨</div>
                                <h3 className="m-0 mb-3 text-2xl font-black text-gray-900 leading-tight">Your Inbox is Ready</h3>
                                <p className="m-0 text-gray-400 font-bold text-sm">Select a conversation from the left to start connecting with your potential life partner.</p>
                                <button onClick={() => navigate('/matches')} className="mt-8 px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:shadow-2xl hover:-translate-y-1 transition-all">Find New Matches</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesList;
