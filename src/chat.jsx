import { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import EmojiPicker from "emoji-picker-react";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

const ROOM_ID = "mec-general";

export default function Chat({ user, activityTitle }) {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [gifs, setGifs] = useState([]);

  const username = user?.displayName || "Anonymous";
  const userEmail = user?.email || "";

  const chatBoxRef = useRef(null);

  /* 🔹 Fetch messages */
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("roomId", "==", ROOM_ID),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  /* 🔹 Auto-scroll */
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, showEmoji, showGif]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "messages"), {
      roomId: ROOM_ID,
      sender: username,
      email: userEmail,
      text: text.trim(),
      createdAt: serverTimestamp(),
      type: "text"
    });

    setText("");
    setShowEmoji(false);
  };

  const sendGif = async (url) => {
    await addDoc(collection(db, "messages"), {
      roomId: ROOM_ID,
      sender: username,
      email: userEmail,
      gifUrl: url,
      createdAt: serverTimestamp(),
      type: "gif"
    });

    setShowGif(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">

      {/* HEADER */}
      <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border
                         flex items-center px-4 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-full hover:bg-muted transition"
          >
            ←
          </button>

          <div>
            <h2 className="font-bold text-foreground leading-tight">
              {activityTitle || "Huddle Chat"}
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-xs text-muted-foreground">
                Live discussion
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* CHAT AREA */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-4 space-y-4
                   bg-gradient-to-b from-background to-card"
      >
        {messages.map((m) => {
          const isMe = m.email === userEmail;

          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] md:max-w-[60%]
                               flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && (
                  <span className="text-xs text-muted-foreground mb-1 ml-1">
                    {m.sender}
                  </span>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl text-sm shadow
                  ${isMe
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                  {m.gifUrl && (
                    <img
                      src={m.gifUrl}
                      alt="GIF"
                      className="rounded-lg mt-2 max-w-full"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto relative">

          {(showEmoji || showGif) && (
            <div className="absolute bottom-full mb-3 bg-card border border-border
                            rounded-2xl shadow-xl overflow-hidden w-full max-w-sm">
              {showEmoji && (
                <EmojiPicker
                  theme="dark"
                  onEmojiClick={(e) => setText(prev => prev + e.emoji)}
                  width="100%"
                  height={300}
                />
              )}
            </div>
          )}

          <div className="flex items-end gap-2 bg-muted p-2 rounded-xl
                          border border-border focus-within:border-primary transition">
            <button
              onClick={() => {
                setShowEmoji(v => !v);
                setShowGif(false);
              }}
              className="p-2 text-muted-foreground hover:text-primary"
            >
              🙂
            </button>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent resize-none outline-none
                         text-foreground py-2 max-h-32"
              rows={1}
            />

            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="p-2 bg-primary text-primary-foreground
                         rounded-lg disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
