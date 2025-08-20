import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Styled components
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #fff;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem;
  background-color: #fff;
  z-index: 2;
  position: relative;
  left: 0vh;
  border-bottom: 0.1px solid #000;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20vh;
`;

const Avatar = styled.img`
  background-color: #ccc;
  border-radius: 50%;
  width: 9vw;
  height: 9vw;
  margin-left: 0vh;
  margin-right: 2vh;
`;

const UserName = styled.h2`
  font-size: 1rem;
  margin-left: -0.1rem;
`;

const Department = styled.p`
  font-size: 0.7rem;
  color: gray;
  margin-top: -1vh;
`;

const BackButton = styled.img`
  width: 3vw;
  height: auto;
  position: relative;
  left: 1vh;
  cursor: pointer;
`;

const ChatBackgroundWrapper = styled.div`
  height: 85vh;
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 1;
`;

const ChatBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/images/Chat/ChatBackground.png");
  background-size: 100% 140%;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 1;
  z-index: 5;
  height: 100%;
`;

const MessageContainer = styled.div`
  flex: 1;
  padding: 0.8rem;
  overflow-y: auto;
  z-index: 2;
  position: relative;
  margin-bottom: 7vh;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.1vh;
  justify-content: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  background-color: ${(props) => (props.isSender ? "#003FE0" : "#EAEAEA")};
  color: ${(props) => (props.isSender ? "white" : "black")};
  font-size: 0.9rem;
  padding: 0.8rem;
  border-radius: 1rem;
  max-width: 60vw;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 2.3rem;
  background-color: #fff;
  border-top: 0.1rem solid #ddd;
  z-index: 2;
  width: 90%;
  position: fixed;
  bottom: 0;
  left: -1.8vh;
`;

const InputWrapper = styled.div`
  position: absolute;
  left: 50%;
  bottom: 1vh;
  transform: translateX(-50%);
  width: 78%;
  display: flex;
  align-items: center;
  background-color: #eaeaea;
  border-radius: 2rem;
  padding: 0 1rem;
`;

const InputField = styled.input`
  flex: 1;
  padding: 1rem 1rem 1rem 3rem;
  border: none;
  border-radius: 2rem;
  background-color: #eaeaea;
  font-size: 1rem;
  outline: none;
`;

const PlusButton = styled.img`
  position: absolute;
  left: 1.3rem;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
`;

const SendButton = styled.img`
  position: absolute;
  right: 1.3rem;
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
`;

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const messagesEndRef = useRef(null); // 새로운 ref 생성
  const stompClient = useRef(null);

  useEffect(() => {
    if (!roomId) {
      console.error("Room ID is missing.");
      navigate("/friendpage");
    } else {
      openChatRoom(roomId);
      connectToWebSocket(roomId);
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          console.log("WebSocket 연결 종료");
        });
      }
    };
  }, [roomId, navigate]);

  useEffect(() => {
    scrollToBottom(); // 메시지가 업데이트될 때마다 호출
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const openChatRoom = async (roomId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${SERVER_URL}/api/v1/chatrooms/${roomId}/open?size=30`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.is_success) {
        console.log(
          "불러온 정보",
          JSON.stringify(response.data.payload, null, 2)
        );

        const { chatRoomMessageResponseDtoList, currentUser, receiver } =
          response.data.payload;

        setCurrentUserId(currentUser.userId);
        setCurrentUser(currentUser);
        setReceiver(receiver);

        // 메시지를 시간 순으로 정렬
        const formattedMessages = chatRoomMessageResponseDtoList
          .map((msg) => ({
            messageId: msg.messageId,
            content: msg.content,
            senderId: msg.senderId,
            sendTime: msg.sendTime,
            isSender: msg.senderId === currentUser.userId,
          }))
          .sort((a, b) => new Date(a.sendTime) - new Date(b.sendTime)); // 시간 순으로 정렬

        setMessages(formattedMessages);
      } else {
        console.error("Failed to fetch chat room details.");
      }
    } catch (error) {
      console.error("Error opening chat room:", error);
    }
  };

  const connectToWebSocket = (roomId) => {
    const socket = new SockJS(`${SERVER_URL}/stomp/chat`);
    stompClient.current = Stomp.over(socket);
    const accessToken = localStorage.getItem("accessToken");

    stompClient.current.connect(
      {
        Authorization: `Bearer ${accessToken}`,
      },
      (frame) => {
        console.log("WebSocket 연결 성공:", frame);

        stompClient.current.subscribe(`/sub/chats/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              content: newMessage.content,
              senderId: newMessage.senderId,
              sendTime: newMessage.sendTime,
              isSender: newMessage.senderId === currentUserId,
            },
          ]);
        });
      },
      (error) => {
        console.error("WebSocket 연결 실패:", error);
      }
    );
  };

  const sendMessage = async () => {
    if (input.trim() !== "" && stompClient.current) {
      const messageData = {
        senderId: currentUserId,
        content: input,
      };

      const accessToken = localStorage.getItem("accessToken");

      stompClient.current.send(
        `/pub/chats/messages/${roomId}`,
        {
          Authorization: `Bearer ${accessToken}`,
        },
        JSON.stringify(messageData)
      );

      setInput(""); // 입력 필드 초기화

      // Fetch the latest messages after sending a new message
      await openChatRoom(roomId);
    }
  };

  return (
    <ChatContainer>
      <Header>
        <Link to="/friendpage">
          <BackButton src="/images/Game/BackArrow.png" alt="Go back" />
        </Link>
        <ProfileSection>
          <Avatar
            style={{ marginLeft: "2vh" }}
            src={receiver?.profileImageName || "/images/defaultProfile.png"}
            alt={receiver?.nickname || "Receiver"}
          />
          <div>
            <UserName>{receiver?.nickname || "Receiver"}</UserName>
            <Department>
              {receiver?.department || "Unknown Department"}
            </Department>
          </div>
        </ProfileSection>
      </Header>
      <ChatBackgroundWrapper>
        <ChatBackground />
      </ChatBackgroundWrapper>
      <MessageContainer>
        {messages.map((message, index) => (
          <Message key={index} isSender={message.isSender}>
            {!message.isSender && (
              <Avatar
                src={receiver?.profileImageName || "/images/defaultProfile.png"}
                alt="Receiver Avatar"
              />
            )}
            <MessageBubble isSender={message.isSender}>
              {message.content}
            </MessageBubble>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessageContainer>
      <InputContainer>
        <InputWrapper>
          <PlusButton src="/images/Chat/PlusButton.png" alt="Plus" />
          <InputField
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <SendButton
            src="/images/Chat/SendButton.png"
            alt="Send"
            onClick={sendMessage}
          />
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatPage;
