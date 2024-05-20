import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MinimizeIcon from "@mui/icons-material/Minimize";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import axios from "axios";

const ChatComponent = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(true);
  const [chatOpenTime, setChatOpenTime] = useState(null);
  const [initialMessageDisplayed, setInitialMessageDisplayed] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0); 

  const apiUrl = process.env.REACT_APP_API_URL;

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const originalTitle = useRef(document.title);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBotTyping(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isBotTyping && !initialMessageDisplayed) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          botMessage: "Hello! How can I assist you today?",
          timestamp: new Date(),
        },
      ]);
      setInitialMessageDisplayed(true);
    }
  }, [isBotTyping, initialMessageDisplayed]);

  useEffect(() => {
    if (!isChatOpen && newMessagesCount > 0) {
      document.title = `(${newMessagesCount}) New messages`;
    } else {
      document.title = originalTitle.current;
    }
  }, [newMessagesCount, isChatOpen]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setChatOpenTime(new Date());
      setNewMessagesCount(0); 
    } else {
      setChatOpenTime(null);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMsg = () => {
    if (!message.trim()) {
      return;
    }
    setIsBotTyping(true);

    axios
      .post(`http://localhost:5001/responses`, { message })
      .then((response) => {
        console.log(response.data);
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            userMessage: message,
            botMessage: response.data.message,
            timestamp: new Date(),
          },
        ]);

        setMessage("");

        if (!isChatOpen) {
          setNewMessagesCount((prevCount) => prevCount + 1); 
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      })
      .finally(() => {
        setIsBotTyping(false);
        scrollToBottom();
      });
  };

  const getChatOpenLabel = () => {
    if (!chatOpenTime) return null;

    const today = moment();
    const yesterday = moment().subtract(1, "days");

    if (moment(chatOpenTime).isSame(today, "day")) {
      return `Today ${moment(chatOpenTime).format("h:mm A")}`;
    } else if (moment(chatOpenTime).isSame(yesterday, "day")) {
      return `Yesterday ${moment(chatOpenTime).format("h:mm A")}`;
    } else {
      return `${moment(chatOpenTime).format("dddd h:mm A")}`;
    }
  };

  return (
    <div className="chat-body">
      <div className={` ${isChatOpen ? "chat" : "invisible"}`}>
        <div className="contact bar">
          <div className="pic bot"></div>
          <div className="name">Chat Bot</div>

          <div className="seen">{getChatOpenLabel()}</div>
          <div className="minimize-button" onClick={toggleChat}>
            <MinimizeIcon />
          </div>
        </div>
        <div className="messages" id="chat">
          {chatHistory.map((item, index) => (
            <React.Fragment key={index}>
              {item.userMessage && (
                <div>
                  <span className=" message-timestamp user-timestamp">
                    {moment(item.timestamp).format("LT")}
                  </span>
                  <div className="message user">{item.userMessage}</div>
                </div>
              )}
              {item.botMessage && (
                <div>
                  <span className=" message-timestamp bot-timestamp">
                    {moment(item.timestamp).format("LT")}
                  </span>
                  <div className="message bot">{item.botMessage}</div>
                </div>
              )}
            </React.Fragment>
          ))}
          {isBotTyping && (
            <div className="message bot">
              <div className="typing typing-1"></div>
              <div className="typing typing-2"></div>
              <div className="typing typing-3"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="input">
          <input
            ref={inputRef}
            placeholder="Type your message here!"
            type="text"
            value={message}
            onChange={handleMessageChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMsg();
              }
            }}
          />
          <SendIcon onClick={handleSendMsg} />
        </div>
      </div>
      <button onClick={toggleChat} className="chatButton">
        {isChatOpen ? <CloseIcon /> : <ChatBubbleIcon />}
        {!isChatOpen && newMessagesCount > 0 && (
          <span className="notification-badge">{newMessagesCount}</span>
        )}
      </button>
    </div>
  );
};

export default ChatComponent;
