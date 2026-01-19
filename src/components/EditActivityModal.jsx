import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function EditActivityModal({ isOpen, onClose, activityId, currentData }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        endTime: ""
    });

    // 🔹 Load existing data when modal opens
    useEffect(() => {
        if (currentData) {
            setFormData({
                title: currentData.title || "",
                description: currentData.description || "",
                location: currentData.location || "",
                endTime: currentData.endTime || ""
            });
        }
    }, [currentData, isOpen]);

    if (!isOpen) return null;

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const activityRef = doc(db, "activities", activityId);

            await updateDoc(activityRef, {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                endTime: formData.endTime
            });

            onClose(); // Close modal
        } catch (error) {
            console.error("Error updating activity:", error);
            alert("Failed to update activity");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 animate-slide-up border border-border">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-primary mb-6">✏️ Edit Activity</h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Title</label>
                        <input
                            required
                            type="text"
                            className="input-modern"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Location</label>
                            <input
                                required
                                type="text"
                                className="input-modern"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground mb-1 block">End Time</label>
                            <input
                                required
                                type="datetime-local"
                                className="input-modern text-muted-foreground"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                        <textarea
                            required
                            rows="3"
                            className="input-modern resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:bg-muted transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}