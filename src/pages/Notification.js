import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Styled-components
const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  border: 1px solid #d3d3d3;
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #003fe0;
  color: white;
  padding: 10px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const BackIcon = styled.img`
  width: 3vw;
  height: auto;
  margin-left: 1vh;
  margin-top: 0.5vh;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.2em;
  margin-top: 0.5vh;
  position: absolute;
  right: 20vh;
`;

const Notifications = styled.div`
  padding: 10px;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #d3d3d3;
`;

const Icon = styled.div`
  width: 30px;
  height: 30px;
  background-image: ${({ type }) =>
    type === "board"
      ? "url(https://image.flaticon.com/icons/png/512/889/889140.png)"
      : "url(https://image.flaticon.com/icons/png/512/1077/1077114.png)"};
  background-size: cover;
  margin-right: 10px;
`;

const TextContainer = styled.div`
  flex: 1;
`;

const NotificationText = styled.p`
  margin: 0 0 5px 0;
`;

const NotificationTime = styled.span`
  font-size: 0.8em;
  color: #888;
`;

function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // API에서 알림 목록을 가져오는 함수
    const fetchNotifications = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // 토큰을 로컬스토리지에서 가져옴
        const response = await fetch(`${BASE_URL}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더로 토큰 전달
          },
        });
        const data = await response.json();
        if (data.is_success) {
          setNotifications(data.payload); // 성공 시 알림 목록을 상태로 설정
        }
      } catch (error) {
        console.error("알림 목록을 불러오는 중 오류 발생:", error);
      }
    };

    // SSE로 실시간 알림 구독 설정
    const eventSource = new EventSource(`${BASE_URL}/subscribe`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 중 오류 발생:", error);
      eventSource.close(); // 오류가 발생하면 연결 종료
    };

    // 컴포넌트 언마운트 시 SSE 연결 종료
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <BackIcon src="/images/Back_icon.png" alt="뒤로가기" />
        </BackButton>
        <Title>알림</Title>
      </Header>
      <Notifications>
        {notifications.map((notification, index) => (
          <NotificationItem key={index}>
            <Icon type={notification.notifyType} />
            <TextContainer>
              <NotificationText>{notification.content}</NotificationText>
              <NotificationTime>
                {new Date(notification.createdAt).toLocaleString()}
              </NotificationTime>
            </TextContainer>
          </NotificationItem>
        ))}
      </Notifications>
    </Container>
  );
}

export default Notification;
