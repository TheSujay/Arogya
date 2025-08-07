import React, { useEffect, useState, useContext,useRef } from "react";
import {
  Heart,
  Heart as HeartFilled,
  Volume2,
  VolumeX,
  Pencil,
  Trash2,
  Send,
  ChevronLeft, ChevronRight
} from "lucide-react";
import {  VideoIcon,Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { AppContext } from "../context/AppContext";

const API = import.meta.env.VITE_BACKEND_URL;

function Modal({ isOpen, onClose, title, items = [] }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full relative">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <button onClick={onClose} className="absolute top-2 right-2">✕</button>
        <ul className="max-h-60 overflow-y-auto mt-2 space-y-1 text-sm">
          {items.length
            ? items.map((u, i) => <li key={i}>{u}</li>)
            : <li className="text-gray-500">No one yet!</li>}
        </ul>
      </div>
    </div>
  );
}

function ConfettiHeart({ x, y, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 0, scale: 2, y: -30 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute text-red-500 pointer-events-none text-2xl"
      style={{ left: x, top: y }}
      onAnimationComplete={onDone}
    >
      ❤️
    </motion.div>
  );
}

const ReelFeed = () => {
  const [reels, setReels] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [editingComment, setEditingComment] = useState({});
  const [mutedReels, setMutedReels] = useState({});
  const [modal, setModal] = useState({ open: false, title: "", items: [] });
  const [confetti, setConfetti] = useState({});
  const { userData } = useContext(AppContext);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  useEffect(() => {
    fetchReels();
    const socket = io(API);
    const events = [
      "reel:updated",
      "reelCommented",
      "reel:commentLoved",
      "reel:commentEdited",
      "reel:commentDeleted",
    ];
    events.forEach(ev => socket.on(ev, fetchReels));
    return () => socket.disconnect();
  }, []);

  async function fetchReels() {
    const res = await fetch(`${API}/api/reels`);
    const data = await res.json();
    setReels(data);
  }

  async function toggleLike(reelId) {
    if (!userData?._id) return;
    await fetch(`${API}/api/reels/${reelId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userData._id }),
    });
    fetchReels();
  }

  async function loveComment(reelId, commentId) {
    if (!userData?._id) return;
    await fetch(`${API}/api/reels/${reelId}/comment/${commentId}/love`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userData._id }),
    });
    fetchReels();
  }

  async function fetchUsernames(ids) {
    if (!ids?.length) return [];
    const res = await fetch(`${API}/api/users?ids=${ids.join(",")}`);
    return res.ok ? await res.json() : [];
  }

  async function postComment(reelId) {
    const comment = commentText[reelId]?.trim();
    if (!userData?._id || !comment) return;
    await fetch(`${API}/api/reels/${reelId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userData._id,
        username: userData.name,
        comment,
      }),
    });
    setCommentText(prev => ({ ...prev, [reelId]: "" }));
    fetchReels();
  }

  async function editComment(reelId, commentId) {
    const newText = editingComment[commentId];
    if (!newText) return;
    await fetch(`${API}/api/reels/${reelId}/comment/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: newText }),
    });
    setEditingComment(prev => ({ ...prev, [commentId]: undefined }));
    fetchReels();
  }

  async function deleteComment(reelId, commentId) {
    await fetch(`${API}/api/reels/${reelId}/comment/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userData._id }),
    });
    fetchReels();
  }

  const toggleMute = (reelId) => {
    const muted = !mutedReels[reelId];
    setMutedReels(prev => ({ ...prev, [reelId]: muted }));
    const video = document.querySelector(`video[data-id="${reelId}"]`);
    if (video) video.muted = muted;
  };

  const handleDoubleTap = (reel, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setConfetti(prev => ({
      ...prev,
      [reel._id]: [...(prev[reel._id] || []), { id, x, y }],
    }));

    toggleLike(reel._id);
  };

  const [visibleCount, setVisibleCount] = useState(4);


  const handleModal = async (title, ids) => {
    const names = await fetchUsernames(ids);
    setModal({ open: true, title, items: names });
  };

  const handleVideoClick = (reelId) => {
    const allVideos = document.querySelectorAll("video");
    allVideos.forEach(v => {
      if (v.dataset.id !== reelId) v.pause();
    });

    const video = document.querySelector(`video[data-id="${reelId}"]`);
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlayingVideoId(reelId);
    } else {
      video.pause();
      setPlayingVideoId(null);
    }
  };

  const scrollRef = useRef();

  useEffect(() => {
  const scrollEl = scrollRef.current;
  if (!scrollEl) return;

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollEl;

    // If user scrolls near the right end
    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      setVisibleCount(prev => {
        const newCount = prev + 4;
        return newCount <= reels.length ? newCount : prev;
      });
    }
  };

  scrollEl.addEventListener('scroll', handleScroll);
  return () => scrollEl.removeEventListener('scroll', handleScroll);
}, [reels.length]);


const scroll = (direction) => {
  if (scrollRef.current) {
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8; // scroll by 80% of the container width
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  }
};


  return (
    <section className="p-4">
      <div className="text-center mb-12">
  <div className="flex justify-center items-center gap-3 mb-3">
    <div className="p-3 bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-pink-500 rounded-full border border-purple-300/50 backdrop-blur-sm shadow-lg">
      <VideoIcon className="w-6 h-6 text-white" />
    </div>
    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 bg-clip-text text-transparent">
      Arogya Reels
    </h2>
  </div>
  <p className="text-gray-600 text-sm">
    Short, inspiring clips to motivate your wellness journey.
  </p>
</div>

      <div className="relative">
  {/* Scroll Arrows */}
  <button
    onClick={() => scroll("left")}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 hover:bg-white p-2 rounded-full shadow"
  >
    <ChevronLeft />
  </button>

  {/* Scrollable Reel Container */}
  <div
    ref={scrollRef}
    className="flex overflow-x-auto gap-4 no-scrollbar scroll-smooth px-10"
    style={{ scrollBehavior: "smooth" }}
  >
    {reels.slice(0, visibleCount).map(reel => (
      <motion.div
        key={reel._id}
        className="relative bg-black rounded-lg w-64 flex-shrink-0 overflow-hidden"
      >
        <div onDoubleClick={(e) => handleDoubleTap(reel, e)} className="relative">
          <video
            data-id={reel._id}
            src={reel.videoUrl}
            poster={reel.thumbnailUrl}
            muted={mutedReels[reel._id] ?? false}
            loop
            playsInline
            className="w-full h-96 object-cover cursor-pointer"
            onClick={() => handleVideoClick(reel._id)}
            autoPlay={playingVideoId === reel._id}
          />
          <AnimatePresence>
            {(confetti[reel._id] || []).map(c => (
              <ConfettiHeart
                key={c.id}
                x={c.x}
                y={c.y}
                onDone={() =>
                  setConfetti(prev => ({
                    ...prev,
                    [reel._id]: prev[reel._id].filter(o => o.id !== c.id),
                  }))
                }
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="absolute top-2 right-2 space-y-2 text-white">
          <button onClick={() => toggleMute(reel._id)}>
            {mutedReels[reel._id] ? <VolumeX /> : <Volume2 />}
          </button>
          <motion.button whileTap={{ scale: 1.3 }} onClick={() => toggleLike(reel._id)}>
            {reel.likedBy?.includes(userData._id)
              ? <HeartFilled className="text-red-500" />
              : <Heart />}
          </motion.button>
          <button onClick={() => handleModal("Liked by", reel.likedBy)}>
            <span className="text-xs">{reel.likedBy?.length || 0}</span>
          </button>
        </div>

        <div className="bg-gray-900 text-white p-2 text-xs flex flex-col justify-end h-40">
          <div className="flex-1 overflow-y-auto mb-1 space-y-1 pr-1">
            {reel.comments?.map((c) => (
              <div key={c._id} className="flex justify-between items-start">
                <div className="flex-1">
                  <b>{c.username}</b>:{" "}
                  {editingComment[c._id] !== undefined ? (
                    <input
                      value={editingComment[c._id]}
                      onChange={(e) =>
                        setEditingComment(prev => ({
                          ...prev,
                          [c._id]: e.target.value,
                        }))
                      }
                      className="text-black text-xs px-1 rounded w-full"
                    />
                  ) : (
                    <span>{c.comment}</span>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      className="text-red-400"
                      onClick={() => loveComment(reel._id, c._id)}
                    >
                      {c.lovedBy?.includes(userData._id)
                        ? <HeartFilled size={12} />
                        : <Heart size={12} />}
                    </button>
                    <span className="text-gray-400 text-[10px]">
                      {c.lovedBy?.length || 0}
                    </span>
                  </div>
                </div>
                {userData?._id === c.userId && (
                  <div className="flex gap-1 ml-2 mt-1">
                    {editingComment[c._id] !== undefined ? (
                      <button onClick={() => editComment(reel._id, c._id)}>Save</button>
                    ) : (
                      <button onClick={() => setEditingComment({ [c._id]: c.comment })}>
                        <Pencil size={12} />
                      </button>
                    )}
                    <button onClick={() => deleteComment(reel._id, c._id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <input
              placeholder="Add comment..."
              value={commentText[reel._id] || ""}
              onChange={e =>
                setCommentText(prev => ({
                  ...prev,
                  [reel._id]: e.target.value,
                }))
              }
              className="flex-1 text-black text-xs p-1 rounded"
            />
            <button onClick={() => postComment(reel._id)}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    ))}
    
  </div>

  {/* Right Scroll Arrow */}
  <button
    onClick={() => scroll("right")}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 hover:bg-white p-2 rounded-full shadow"
  >
    <ChevronRight />
  </button>
</div>




      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.title}
        items={modal.items}
      />
    </section>
  );
};

export default ReelFeed;
