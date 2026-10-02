import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRef } from "react";

/**
 * Nexon — Chat Home Page
 * Responsive React + Tailwind, matching the Lovebirds sage/warm theme.
 *
 * Layout:
 * - Left section (narrower): logo + app name, search bar, scrollable user list
 * - Right section (wider): top bar with active user's dp + name and a close icon,
 *   message thread, and a message input bar
 *
 * Mobile: only one section shows at a time. Tapping a user opens the chat
 * full-screen; the close icon returns to the user list. From md/ up, both
 * sections show side by side, as in the desktop layout.
 */

const USERS = [
  {
    id: 1,
    name: "Ava Whitfield",
    message: "Sounds great, see you then!",
    time: "9:41 AM",
    unread: 2,
    color: "#c8493f",
  },
  {
    id: 2,
    name: "Liam Osei",
    message: "Can you send the file again?",
    time: "9:12 AM",
    unread: 0,
    color: "#eda15b",
  },
  {
    id: 3,
    name: "Priya Nair",
    message: "Haha that's hilarious 😄",
    time: "Yesterday",
    unread: 5,
    color: "#a9c1ae",
  },
  {
    id: 4,
    name: "Marcus Lee",
    message: "Let's catch up this weekend",
    time: "Yesterday",
    unread: 0,
    color: "#d9435e",
  },
  {
    id: 5,
    name: "Sofia Marchetti",
    message: "Typing…",
    time: "Mon",
    unread: 1,
    color: "#7c9268",
  },
  {
    id: 6,
    name: "Noah Kim",
    message: "Thanks for the update",
    time: "Mon",
    unread: 0,
    color: "#e0596e",
  },
];

const SAMPLE_MESSAGES = [
  { id: 1, from: "them", text: "Hey! How's the design coming along?", time: "9:30 AM" },
  { id: 2, from: "me", text: "Almost done, just polishing the chat screen now.", time: "9:32 AM" },
  { id: 3, from: "them", text: "Nice, can't wait to see it.", time: "9:33 AM" },
  { id: 4, from: "me", text: "Sending it over in a bit 👍", time: "9:35 AM" },
  { id: 5, from: "them", text: "Sounds great, see you then!", time: "9:41 AM" },
];

function Avatar({ name, color, size = "w-11 h-11", textSize = "text-sm" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`${size} ${textSize} rounded-full flex items-center justify-center text-white font-medium shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center ">
      {/* <div className="w-9 h-9 rounded-full bg-[#a9c1ae] flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
          <path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4.6 3.45A.5.5 0 0 1 2.6 19V5a1 1 0 0 1 1-1z" />
        </svg>
      </div>
      <span className="font-serif italic text-xl text-gray-700 hidden sm:inline">Nexon</span> */}
      <img className="w-40" src="\images\Logo_tag tr.png" alt="" />
    </div>
  );
}

export default function Chat() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [conversationId, setConversationId] = useState("");
  const messagesEndRef = React.useRef(null);

  const [users, setUsers] = useState([]);
  const { setUser, socket, user, token, getCurrentUser,setToken } = useContext(AuthContext);
  const [sendError, setSendError] = useState("");
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [onlineUsers, setOnlineUsers] = useState([]);




  // React.useEffect(() => {
  //     const viewport = window.visualViewport;

  //     if (!viewport) return;

  //     const handleViewportResize = () => {
  //         const keyboardIsOpen =
  //             window.innerHeight - viewport.height > 150;

  //         setKeyboardOpen(keyboardIsOpen);

  //         if (keyboardIsOpen) {
  //             setKeyboardHeight(viewport.height);
  //         }
  //     };

  //     handleViewportResize();

  //     viewport.addEventListener("resize", handleViewportResize);

  //     return () => {
  //         viewport.removeEventListener("resize", handleViewportResize);
  //     };
  // }, []);



  //   useEffect(() => {
  //     const handleResize = () => {
  //         document.documentElement.style.setProperty(
  //             "--app-height",
  //             `${window.visualViewport?.height || window.innerHeight}px`
  //         );
  //     };

  //     handleResize();

  //     window.visualViewport?.addEventListener("resize", handleResize);

  //     return () => {
  //         window.visualViewport?.removeEventListener("resize", handleResize);
  //     };
  // }, []);




  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );
  const activeUser = USERS.find((u) => u.id === selectedId);

  const handleSend = async () => {


    const text = draft.trim();
    if (!text) return;


    try {

      if (!conversationId) {
        return;
      }
      if (!socket) {
        setSendError("socket is not connected");
        return;
      }

      setSendError("");

      socket.emit("sendMessage", { conversationId, text })
      setDraft("");



    } catch (error) {
      console.error(error.message);

    }
    setDraft("");
    // setTimeout(() => {
    inputRef.current?.focus({
      preventScroll: true
    });
    // }, 0);
  };

  // React.useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  React.useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
    });
}, [messages]);

React.useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const observer = new ResizeObserver(() => {
        container.scrollTop = container.scrollHeight;
    });

    observer.observe(container);

    return () => {
        observer.disconnect();
    };
}, [selectedId]);

React.useEffect(() => {
    if (!keyboardOpen) return;

    const container = messagesContainerRef.current;

    if (!container) return;

    const scrollToBottom = () => {
        container.scrollTop = container.scrollHeight;
    };

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scrollToBottom();

            setTimeout(() => {
                scrollToBottom();
            }, 100);
        });
    });
}, [keyboardOpen]);
  // --------------------------------------------------

  const getUsers = async () => {
    const token1 = localStorage.getItem("token")



    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token1}`
        }
      })
      const data = await response.json();


      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setUsers(data.users)



    } catch (error) {

      return
    }
  }

  const getMessages = async () => {
    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/message/${conversationId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("FETCH START");

      const data = await response.json();
      if (!response.ok) {
        setMessages([]);
        return;
      }
      setMessages(data.messages);



    } catch (error) {
      return;
    }
  }

  const createConnection = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId: id })
      })
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      await getCurrentUser();


    } catch (error) {

    }
  }

  const isAlreadyAdded = (userId) => {
    return user.friends.some((conversation) =>
      conversation.participants.some(
        (participant) => participant._id === userId
      )
    );
  };
  const leaveAllConversations = async () => {
    if (!socket) {
      return;
    }
    if (!token) {
      return;
    }

    await socket.emit("closeConversations", conversationId);
    setSelectedId(null);
    setConversationId("");
  }


  useEffect(() => {
    getUsers();
  }, [])

  useEffect(() => {
    if (!conversationId) {
      return;
    }
    getMessages();

  }, [conversationId])

  useEffect(() => {
    if (!socket || !conversationId) {
      return;
    }
    socket.emit("joinConversation", conversationId);


  }, [socket, conversationId])

  useEffect(() => {



    if (!socket) {
      return;
    }

    const handeNewMessage = (message) => {
      console.log(message);

      setMessages((prevMessage) => [
        ...prevMessage,
        message
      ])
    }


    socket.on("newMessage", handeNewMessage);

    socket.on("onlineUsers", (users) => {
    setOnlineUsers(users);
});

socket.on("userOnline", (userId) => {
    setOnlineUsers((prev) => {
        if (prev.includes(userId)) {
            return prev;
        }

        return [...prev, userId];
    });
});

socket.on("userOffline", (userId) => {
    setOnlineUsers((prev) =>
        prev.filter((id) => id !== userId)
    );
});

    socket.on("sidebarUpdate", (data) => {

      setUser((prevUser) => ({
        ...prevUser,

        friends: prevUser.friends.map((conversation) => {

          if (conversation._id === data.conversationId) {
            return {
              ...conversation,
              lastMessage: data.lastMessage,
              updatedAt: data.updatedAt
            };
          }

          return conversation;
        })
      }));

    });

    socket.on("unreadCleared", (data) => {

      setUser((prevUser) => ({
        ...prevUser,

        friends: prevUser.friends.map((conversation) => {

          if (conversation._id === data.conversationId) {
            return {
              ...conversation,
              unreadCount: 0
            };
          }

          return conversation;
        })
      }));

    });


    socket.on("messageNotification", (data) => {

      setUser((prevUser) => ({
        ...prevUser,

        friends: prevUser.friends.map((conversation) => {

          if (conversation._id === data.conversationId) {
            return {
              ...conversation,
              unreadCount: data.unreadCount
            };
          }

          return conversation;
        })
      }));

    });

    return () => {
      socket.off("newMessage", handeNewMessage);
      socket.off("sidebarUpdate");
      socket.off("unreadCleared");
      socket.off("messageNotification");
      socket.off("onlineUsers");
socket.off("userOnline");
socket.off("userOffline");
    }


  }, [socket]);


const isOnline =
    selectedId &&
    onlineUsers.includes(selectedId._id);


  //-----------------------------------------------------

  return (
    <div className="w-full h-dvh flex flex-row bg-white overflow-hidden"

    >
      {/* Left section — users */}
      <div className={`w-full sm:w-[260px] md:w-[300px] lg:w-[340px] flex flex-col border-r border-gray-100 shrink-0 ${selectedId ? "hidden sm:flex" : "flex"
        }`}>
        {/* Logo */}
        <div className="px-2 sm:px-4 py-4 border-b border-gray-100 flex items-center  justify-between">
          <Logo />
          <img className="h-10 mr-2 cursor-pointer" src="\images\logout.png" alt="" onClick={()=>{
            setToken("");
            localStorage.removeItem("token");
            setUser("");
          }} />
        </div>

        {/* Search bar */}
        <div className="px-2 sm:px-4 py-3  sm:block">
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-gray-50 rounded-full pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a9c1ae]/40"
            />
          </div>
        </div>
        {/* <div className="px-2 py-3 flex justify-center sm:hidden">
          <button
            aria-label="Search users"
            className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div> */}

        {/* filteredUsers list */}

        {query &&
          <div className=" overflow-y-auto">
            {filteredUsers.map((u) => {

              return (
                <button
                  key={u._id}
                  // onClick={() => {
                  //   setConversationId(conversation._id)
                  //   setSelectedId(otherUser);
                  // }}
                  className={`w-full flex items-center gap-3 px-2 sm:px-4 py-3 justify-center sm:justify-start text-left transition-colors bg-[#a9c1ae]/15 hover:bg-gray-50"
                  }`}
                >
                  <Avatar name={u.name} color={u.color} />
                  <div className="flex-1 min-w-0  sm:block">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>

                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                       <p className="text-xs text-gray-400 truncate">{u.username}</p> 

                    </div>
                  </div>

                  {
                    isAlreadyAdded(u._id) ? (
                      <div></div>
                    ) : (

                      <div className="text-sm font-sm bg-white px-2 py-1 border-1 rounded-md text-gray-800 truncate" onClick={() => {
                        createConnection(u._id)
                      }} >+ Add</div>
                    )

                  }
                </button>
              )
            })}
            {filteredUsers.length === 0 && (
              <p className="text-center text-xs text-gray-400 mt-6 hidden sm:block">No users found</p>
            )}
          </div>
        }


        {/* filteredUsers list  end */}


        {/* User list */}


        <div className="flex-1 overflow-y-auto">
          {user.friends.map((conversation) => {
            const otherUser = conversation.participants.find(
              participant => participant._id !== user._id
            );
            return (
              <button
                key={conversation._id}
                onClick={() => {
                  setConversationId(conversation._id)
                  setSelectedId(otherUser);
                }}
                className={`w-full flex items-center gap-3 px-2 sm:px-4 py-3 justify-center sm:justify-start text-left transition-colors ${selectedId === conversation._id ? "bg-[#a9c1ae]/15" : "hover:bg-gray-50"
                  }`}
              >
                <Avatar name={otherUser.name} color={otherUser.color} />
                <div className="flex-1 min-w-0 sm:block">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800 truncate">{otherUser.name}</p>
                    <span className="text-[11px] text-gray-400 shrink-0">{new Date(conversation.updatedAt).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true
                    })}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">

                    {conversation.unreadCount > 0 ? (<p className="text-xs text-gray-400 truncate">New Message</p>) : <p className="text-xs text-gray-400 truncate">{conversation.lastMessage}</p>

                    }
                    {/* <p className="text-xs text-gray-400 truncate">{conversation.lastMessage}</p> */}
                    {/* {user.unread > 0 && (
                    <span className="bg-[#c8493f] text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center shrink-0 px-1">
                      {user.unread}
                    </span>
                  )} */}

                    {conversation.unreadCount > 0 && (
                      <span className="bg-[#c8493f] text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center shrink-0 px-1">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}

        </div>
      </div>

      {/* Right section — chat */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden  ${selectedId ? "flex" : "hidden sm:flex"
        }`}>
        {selectedId ? (
          <>
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={selectedId.name} color={selectedId.color} size="w-9 h-9" textSize="text-xs" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{selectedId.name}</p>
                  <p className="text-[11px] text-[#7c9268] flex items-center gap-1"> {isOnline ? (<><p className="bg-green-400 w-2 h-2 rounded-full"></p> <p>Online</p></> ): "Offline"}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  leaveAllConversations();

                }}
                aria-label="Close chat"
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}

            <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4 space-y-3 bg-gray-50/50">
              {messages.map((m) => (

                <div key={m._id} className={`flex ${m.senderId === user._id ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] sm:max-w-[60%] px-4 py-2 rounded-2xl text-sm ${m.senderId === user._id
                      ? "bg-[#a9c1ae] text-white rounded-br-sm"
                      : "bg-white text-gray-700 border border-gray-100 rounded-bl-sm"
                      }`}
                  >
                    <p>{m.text}</p>
                    <p
                      className={`text-[10px] mt-1 ${m.senderId === user._id ? "text-white/70" : "text-gray-400"
                        }`}
                    >
                      {new Date(m.updatedAt).toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}

            <div className="px-4 md:px-6 py-3 border-t border-gray-100 shrink-0">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                onFocus={() => {
                  setKeyboardOpen(true);
                }}
              >
                <input
                  type="text"
                  ref={inputRef}
                  value={draft}

                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a9c1ae]/40"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!draft.trim()}
                  className={`w-10 h-10 rounded-full bg-[#a9c1ae] flex items-center justify-center shrink-0 transition-opacity ${draft.trim() ? "opacity-100 hover:bg-[#96af9b] cursor-pointer" : "opacity-40 cursor-not-allowed"
                    }`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                    <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}