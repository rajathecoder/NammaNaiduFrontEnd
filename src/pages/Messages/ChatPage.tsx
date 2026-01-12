import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Loading from '../../components/common/Loading';
import verifiedBadge from '../../assets/images/verified-badge.png';

// Mock data for chat history
const MOCK_CHATS: Record<string, any> = {
    '1': {
        name: 'Keerthana M',
        avatar: 'K',
        online: true,
        messages: [
            { id: 1, text: 'Hi, I saw your profile and found it interesting.', sender: 'them', time: '10:30 AM' },
            { id: 2, text: 'Hello! Thank you. I liked your profile too.', sender: 'me', time: '10:32 AM' },
            { id: 3, text: 'That is great to hear! What do you do for work?', sender: 'them', time: '10:33 AM' }
        ]
    },
    '2': {
        name: 'Mansi',
        avatar: 'M',
        online: false,
        messages: [
            { id: 1, text: 'Hi there!', sender: 'me', time: 'Yesterday' },
            { id: 2, text: 'Hello! How are you?', sender: 'them', time: 'Yesterday' },
            { id: 3, text: 'I am good, thanks. Sure, let\'s connect this weekend.', sender: 'them', time: 'Yesterday' }
        ]
    }
};

const ChatPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [messageInput, setMessageInput] = useState('');
    const [chatData, setChatData] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simulate fetching chat data
        if (id && MOCK_CHATS[id]) {
            setChatData(MOCK_CHATS[id]);
        } else {
            // Fallback for demo if id doesn't match mock data
            setChatData({
                name: 'User',
                avatar: 'U',
                online: false,
                messages: []
            });
        }
    }, [id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatData]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: messageInput,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatData((prev: any) => ({
            ...prev,
            messages: [...prev.messages, newMessage]
        }));
        setMessageInput('');
    };

    if (!chatData) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading message="Loading chat..." size="medium" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto my-5">
                <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-120px)]">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                        <button className="mr-4 border-none bg-transparent text-2xl text-gray-600 cursor-pointer p-0 md:hidden" onClick={() => navigate('/messages')}>
                            ←
                        </button>
                        <div className="flex items-center flex-1">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 relative text-gray-700 font-semibold">
                                {chatData.avatar}
                                {chatData.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <h3 className="m-0 text-base text-gray-800">{chatData.name}</h3>
                                    {chatData.profileveriffied === 1 && (
                                        <div className="flex items-center gap-0.5" title="Verified">
                                            <img src={verifiedBadge} alt="Verified" className="w-3.5 h-3.5" />
                                            <span className="text-xs font-semibold text-blue-600">Verified</span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-green-500">{chatData.online ? 'Online' : 'Offline'}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">📞</button>
                            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">📹</button>
                            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">⋮</button>
                        </div>
                    </div>

                    <div className="flex-1 p-5 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                        {chatData.messages.map((msg: any) => (
                            <div key={msg.id} className={`max-w-[70%] py-3 px-4 rounded-xl relative text-sm leading-snug ${msg.sender === 'me' ? 'self-end bg-red-500 text-white rounded-br-sm shadow-sm' : 'self-start bg-white text-gray-800 rounded-bl-sm shadow-sm'}`}>
                                <div>{msg.text}</div>
                                <div className="text-xs mt-1 opacity-70 text-right">{msg.time}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="p-4 bg-white border-t border-gray-200 flex items-center gap-2.5" onSubmit={handleSendMessage}>
                        <button type="button" className="bg-transparent border-none text-xl cursor-pointer text-gray-600 p-2 rounded-full transition-all duration-200 hover:bg-gray-100">📎</button>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            className="flex-1 py-3 px-5 border border-gray-200 rounded-full outline-none text-sm bg-gray-50 focus:bg-white focus:border-red-500"
                        />
                        <button type="submit" className="bg-transparent border-none text-xl cursor-pointer text-red-500 p-2 rounded-full transition-all duration-200 hover:bg-red-50 hover:rotate-0 hover:scale-110">➤</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
