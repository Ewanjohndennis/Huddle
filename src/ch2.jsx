import { useEffect, useState, useRef } from "react";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    getDoc,
    deleteDoc // Imported deleteDoc
} from "firebase/firestore";
import EmojiPicker from "emoji-picker-react";
import { db } from "./firebase";
import { useNavigate, useParams } from "react-router-dom";
import EditActivityModal from "./components/EditActivityModal";

export default function Chat({ user }) {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [activeTab, setActiveTab] = useState("emoji");
    const [gifs, setGifs] = useState([]);
    const [gifSearch, setGifSearch] = useState("");

    // 🔹 State for Activity Data & Menu
    const [activityData, setActivityData] = useState(null); // Store full object
    const [showMenu, setShowMenu] = useState(false); // Toggle for 3-dot menu
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const username = user?.displayName || "Anonymous";
    const userEmail = user?.email || "";
    const userId = user?.uid;

    const chatBoxRef = useRef(null);
    const inputRef = useRef(null);

    // 🔹 Check if current user is the creator
    const isCreator = activityData && userId === activityData.createdBy;

    /* 🔹 Fetch Activity Details (Real-time to catch edits) */
    useEffect(() => {
        if (!roomId) return;

        // Changed to onSnapshot so title updates live if edited
        const unsub = onSnapshot(doc(db, "activities", roomId), (doc) => {
            if (doc.exists()) {
                setActivityData(doc.data());
            } else {
                // If doc deleted while in chat, redirect
                navigate("/dashboard");
            }
        });

        return () => unsub();
    }, [roomId, navigate]);

    /* 🔹 Fetch messages */
    useEffect(() => {
        if (!roomId) return;
        const messagesRef = collection(db, "activities", roomId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [roomId]);

    /* 🔹 Auto-scroll */
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, showPicker, activeTab, gifs]);

    /* 🔹 Ensure Keyboard is HIDDEN on Load */
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    }, []);

    // 🔹 Delete Activity Logic
    const handleDeleteActivity = async () => {
        if (confirm("Are you sure you want to delete this activity? This cannot be undone.")) {
            try {
                await deleteDoc(doc(db, "activities", roomId));
                navigate("/dashboard");
            } catch (error) {
                console.error("Error deleting activity:", error);
                alert("Could not delete activity.");
            }
        }
    };

    const sendMessage = async () => {
        if (!text.trim() || !roomId) return;
        await addDoc(collection(db, "activities", roomId, "messages"), {
            sender: username,
            email: userEmail,
            text: text.trim(),
            createdAt: serverTimestamp(),
            type: "text"
        });
        setText("");
        inputRef.current?.focus();
        setShowPicker(false);
    };

    const sendGif = async (url) => {
        if (!roomId) return;
        await addDoc(collection(db, "activities", roomId, "messages"), {
            sender: username,
            email: userEmail,
            gifUrl: url,
            createdAt: serverTimestamp(),
            type: "gif"
        });
        setShowPicker(false);
    };

    const searchGifs = async (q) => {
        const apiKey = import.meta.env.VITE_GIPHY_KEY;
        if (!apiKey) return;
        const queryTerm = q.trim() || "trending";
        try {
            const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${queryTerm}&limit=20`);
            const data = await res.json();
            setGifs(data.data || []);
        } catch (error) {
            console.error("Error fetching GIFs", error);
        }
    };

    const togglePicker = (tab) => {
        if (showPicker && activeTab === tab) {
            setShowPicker(false);
            inputRef.current?.focus();
        } else {
            setShowPicker(true);
            setActiveTab(tab);
            inputRef.current?.blur();
        }
    };

    const handleInputFocus = () => {
        setShowPicker(false);
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden"
            onClick={() => showMenu && setShowMenu(false)} // Close menu if clicking elsewhere
        >

            {/* HEADER */}
            <header className="h-16 shrink-0 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 rounded-full hover:bg-muted transition"
                    >
                        ←
                    </button>

                    <div>
                        <h2 className="font-bold leading-tight truncate max-w-[200px]">
                            {activityData?.title || "Huddle Chat"}
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <span className="text-xs text-muted-foreground">
                                Live chat
                            </span>
                        </div>
                    </div>
                </div>

                {/* 🔹 3-DOT MENU (Only for Creator) */}
                {isCreator && (
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent closing immediately
                                setShowMenu(!showMenu);
                            }}
                            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 16a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4z" />
                            </svg>
                        </button>

                        {/* Dropdown Content */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-slide-up">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-muted transition flex items-center gap-2"
                                >
                                    ✏️ Edit Activity
                                </button>
                                <button
                                    onClick={handleDeleteActivity}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-destructive/10 text-destructive transition flex items-center gap-2"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* CHAT MESSAGES */}
            <div
                ref={chatBoxRef}
                className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4
                   bg-gradient-to-b from-background to-card"
            >
                {messages.map((m) => {
                    const isMe = m.email === userEmail;

                    return (
                        <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] md:max-w-[60%]
                               flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                {!isMe && (
                                    <span className="text-xs text-muted-foreground mb-1 ml-1">
                                        {m.sender}
                                    </span>
                                )}

                                <div
                                    className={`px-4 py-2 rounded-2xl text-sm shadow break-words
                                    ${isMe
                                            ? "bg-primary text-primary-foreground rounded-br-sm"
                                            : "bg-card border border-border rounded-bl-sm"
                                        }`}
                                >
                                    {m.text}
                                    {m.gifUrl && (
                                        <img
                                            src={m.gifUrl}
                                            alt="GIF"
                                            className="rounded-lg mt-2 w-full h-auto object-cover bg-black/20"
                                            loading="lazy"
                                            onLoad={() => {
                                                if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* INPUT AREA */}
            <div className="shrink-0 p-3 bg-card border-t border-border z-20 relative">
                <div className="flex items-end gap-2 bg-muted p-2 rounded-xl border border-border focus-within:border-primary transition-colors">

                    <button
                        onClick={() => togglePicker("emoji")}
                        className={`p-2 transition-colors ${showPicker && activeTab === 'emoji' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        🙂
                    </button>

                    <button
                        onClick={() => togglePicker("gif")}
                        className={`p-2 text-xs font-bold border border-transparent rounded-lg h-10 w-10 flex items-center justify-center transition-all ${showPicker && activeTab === 'gif'
                            ? 'bg-primary/20 text-primary border-primary/20'
                            : 'text-muted-foreground hover:text-primary'
                            }`}
                    >
                        GIF
                    </button>

                    <textarea
                        ref={inputRef}
                        value={text}
                        onFocus={handleInputFocus}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent text-foreground resize-none outline-none py-2 max-h-32 min-h-[40px] text-sm sm:text-base placeholder:text-muted-foreground"
                        rows={1}
                        autoComplete="off"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={!text.trim()}
                        className="p-2 bg-primary text-primary-foreground rounded-lg
                         disabled:opacity-50 font-medium transition-opacity"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* DRAWER */}
            <div
                className={`shrink-0 bg-card border-t border-border overflow-hidden transition-all duration-300 ease-in-out ${showPicker ? "h-[320px]" : "h-0"
                    }`}
            >
                <div className="h-full w-full" style={{ visibility: showPicker ? 'visible' : 'hidden' }}>
                    <div className={`h-full w-full ${activeTab === 'emoji' ? 'block' : 'hidden'}`}>
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={(e) => setText(prev => prev + e.emoji)}
                            width="100%"
                            height="100%"
                            previewConfig={{ showPreview: false }}
                            autoFocusSearch={false}
                        />
                    </div>

                    <div className={`h-full w-full flex flex-col p-3 ${activeTab === 'gif' ? 'block' : 'hidden'}`}>
                        <div className="relative mb-3 shrink-0">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
                            <input
                                type="text"
                                value={gifSearch}
                                onChange={(e) => {
                                    setGifSearch(e.target.value);
                                    searchGifs(e.target.value);
                                }}
                                placeholder="Search Giphy..."
                                className="w-full bg-muted text-foreground border border-border rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                autoComplete="off"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0">
                            {gifs.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-2">
                                    {gifs.map(g => (
                                        <div
                                            key={g.id}
                                            onClick={() => sendGif(g.images.fixed_height.url)}
                                            className="relative aspect-video group cursor-pointer overflow-hidden rounded-lg bg-muted"
                                        >
                                            <img
                                                src={g.images.fixed_height_small.url}
                                                alt={g.title}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    {activeTab === 'gif' ? "Searching..." : "No GIFs found"}
                                </div>
                            )}
                        </div>
                        <div className="shrink-0 text-[10px] text-center text-muted-foreground mt-1">
                            Powered by GIPHY
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 EDIT MODAL INJECTION */}
            <EditActivityModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                activityId={roomId}
                currentData={activityData}
            />

        </div>
    );
}