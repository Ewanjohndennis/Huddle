import { useNavigate } from "react-router-dom";

export default function ActivityCard({ activity, user, onJoinOrLeave }) {
  const navigate = useNavigate();
const participants = activity.participants || {};
const participantCount = Object.keys(participants).length;
const max = activity.maxParticipants || Infinity;
const isFull = participantCount >= max;
const hasJoined = !!participants[user.uid];


  const formatTime = (value) => {
    if (!value) return "--";
    const d = value.toDate ? value.toDate() : new Date(value);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="rounded-2xl p-6 flex flex-col gap-4 
                    bg-card border border-border 
                    hover:border-primary/40 transition">

      {/* TOP STATUS */}
      <div className="flex justify-between items-start">
        <span
          className={`text-xs px-2 py-1 rounded-md font-bold 
          ${isFull 
            ? "bg-red-500/10 text-red-400 border border-red-500/20"
            : "bg-primary/20 text-primary border border-primary/30"
          }`}
        >
          {isFull ? "FULL" : "OPEN"}
        </span>

        <span className="text-muted-foreground text-xs">
          Ends at {formatTime(activity.endTime)}
        </span>
      </div>

      {/* TITLE + DESCRIPTION */}
      <div>
        <h3 className="text-xl font-bold text-foreground">
          {activity.title}
        </h3>

        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
          {activity.description}
        </p>
      </div>

      {/* PARTICIPANT COUNT */}
     <div className="text-xs text-muted-foreground mb-2">
  {max === Infinity
    ? `👥 ${participantCount} joined`
    : `👥 ${participantCount} / ${max} joined`}
</div>


      {/* FOOTER */}
      <div className="flex justify-between items-center border-t border-border pt-4">
        {/* Creator */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full 
                          bg-primary/30 border border-primary/40
                          flex items-center justify-center 
                          text-[10px] font-bold text-primary-foreground">
            {activity.creatorName?.charAt(0)}
          </div>

          <span className="text-xs text-muted-foreground">
            {activity.creatorName}
          </span>

          <span className="text-[10px] px-2 py-0.5 rounded-full
                           bg-accent/20 text-accent border border-accent/30">
            Creator
          </span>
        </div>

        {/* JOIN / LEAVE / CHAT */}
{hasJoined ? (
  <div className="flex gap-2">
    <button
      onClick={() => navigate(`/chat/${activity.id}`)}
      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
    >
      Chat
    </button>

    <button
      onClick={() => onJoinOrLeave(activity.id, "leave")}
      className="bg-red-500 text-white px-4 py-2 rounded-lg"
    >
      Leave
    </button>
  </div>
) : (
  <button
    disabled={isFull}
    onClick={() => onJoinOrLeave(activity.id, "join")}
    className={`px-4 py-2 rounded-lg text-white
        ${isFull ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:opacity-90"}
    `}
  >
    {isFull ? "Full" : "Join"}
  </button>
)}

      </div>
    </div>
  );
}
