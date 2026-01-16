import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function CreateActivityModal({ isOpen, onClose, user }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    endTime: "",
    maxParticipants: ""  // ⭐ NEW FIELD
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "activities"), {
        ...formData,
        maxParticipants: formData.maxParticipants
          ? Number(formData.maxParticipants)
          : null, // ⭐ null = unlimited
        createdBy: user.uid,
        creatorName: user.displayName || "Student",
        createdAt: serverTimestamp(),
        participants: {
          [user.uid]: true
        }
      });

      onClose();
      setFormData({
        title: "",
        description: "",
        location: "",
        endTime: "",
        maxParticipants: ""
      });

    } catch (error) {
      console.error("Error creating activity:", error);
      alert("Failed to create activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-card border border-border
                      rounded-2xl p-6 sm:p-8 shadow-xl animate-slideUp">

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-6">
          Create New Activity
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="text-sm text-muted-foreground">Title</label>
            <input
              required
              type="text"
              placeholder="e.g. Hackathon Brainstorming"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Location + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Location</label>
              <input
                required
                type="text"
                placeholder="Library / Room 304"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">End Time</label>
              <input
                required
                type="datetime-local"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          {/* ⭐ NEW: Max Participants */}
          <div>
            <label className="text-sm text-muted-foreground">
              Max Participants (optional)
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 10"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3"
              value={formData.maxParticipants}
              onChange={(e) =>
                setFormData({ ...formData, maxParticipants: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-muted-foreground">Description</label>
            <textarea
              required
              rows="3"
              placeholder="What's the plan?"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-medium hover:opacity-90 transition"
          >
            {loading ? "Posting..." : "Launch Activity"}
          </button>
        </form>
      </div>
    </div>
  );
}
