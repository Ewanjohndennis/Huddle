import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
    deleteField
} from "firebase/firestore";
import { auth, db } from "../firebase";
import CreateActivityModal from "./CreateActivityModal";
import ActivityCard from "./ActivityCard";
import { useNavigate } from "react-router-dom";

// 🔹 Simple Toast Component
const Toast = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-primary-foreground/10 backdrop-blur-md">
                <span className="bg-primary-foreground/10 p-1 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </span>
                <span className="font-bold text-sm tracking-wide">{message}</span>
                <button onClick={onClose} className="ml-2 text-primary-foreground/60 hover:text-primary-foreground transition-opacity">✕</button>
            </div>
        </div>
    );
};

function Dashboard({ user }) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activities, setActivities] = useState([]); // Raw data from DB
    const [loading, setLoading] = useState(true);

    // 🔔 Notification State
    const [notification, setNotification] = useState(null);

    // 🧠 Ref to track previous active IDs to detect expiration
    const prevActiveIds = useRef(new Set());

    const [tick, setTick] = useState(0);

    const displayName = user?.displayName?.split(" ")[0] || "Student";

    const onJoinOrLeave = async (activityId, action) => {
        const ref = doc(db, "activities", activityId);
        const userId = user.uid;

        if (action === "join") {
            await updateDoc(ref, { [`participants.${userId}`]: true });
        } else if (action === "leave") {
            await updateDoc(ref, { [`participants.${userId}`]: deleteField() });
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // 📡 1. Real-time Listener
    useEffect(() => {
        const q = query(collection(db, "activities"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            }));
            setActivities(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ⏰ 2. Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTick(t => t + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 🧹 3. Filter Logic (Derived State)
    const now = new Date();
    const activeActivities = activities.filter(a => {
        if (!a.endTime) return true;
        const end = a.endTime.toDate ? a.endTime.toDate() : new Date(a.endTime);
        return end > now;
    });

    // 🕵️ 4. Expiration Detection Logic
    useEffect(() => {
        // Create a set of currently active IDs
        const currentActiveIds = new Set(activeActivities.map(a => a.id));

        // Skip the check on the very first render (when prev is empty)
        if (prevActiveIds.current.size > 0) {
            // Check if any ID that was previously active is MISSING now
            for (let id of prevActiveIds.current) {
                if (!currentActiveIds.has(id)) {
                    // It expired! Find the title from the raw list
                    const expiredItem = activities.find(a => a.id === id);
                    const title = expiredItem?.title || "An activity";

                    // Show Notification
                    setNotification(`'${title}' has ended.`);
                }
            }
        }

        // Update ref for next render
        prevActiveIds.current = currentActiveIds;

    }, [tick, activeActivities, activities]); // Run whenever filtering happens

    // Auto-hide notification after 4 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <div className="min-h-screen bg-background p-4 sm:p-8 relative overflow-hidden text-foreground">

            {/* ✅ Custom Toast Notification */}
            <Toast message={notification} onClose={() => setNotification(null)} />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] 
                    bg-primary/10 rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] 
                    bg-muted/20 rounded-full blur-[160px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Welcome,{" "}
                            <span className="bg-clip-text text-transparent 
                                bg-gradient-to-r from-primary to-accent">
                                {displayName}
                            </span>
                        </h1>
                        <p className="text-muted-foreground">
                            See what’s happening on campus right now.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 md:flex-none bg-primary text-primary-foreground
                                hover:bg-primary/90 px-6 py-3 rounded-xl font-medium transition"
                        >
                            + Create Activity
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-5 py-3 rounded-xl border border-red-500/30 
                                text-red-400 hover:bg-red-500/10 transition font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
                    Live on Campus
                </h2>

                {loading ? (
                    <div className="text-center text-muted-foreground py-20">
                        Loading feeds...
                    </div>
                ) : activeActivities.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-2xl border border-border">
                        <div className="text-5xl mb-4">😴</div>
                        <h3 className="text-xl font-bold">It's quiet... too quiet.</h3>
                        <p className="text-muted-foreground">Be the first to start an activity!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeActivities.map((activity) => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                user={user}
                                onJoinOrLeave={onJoinOrLeave}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CreateActivityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
            />
        </div>
    );
}

export default Dashboard;