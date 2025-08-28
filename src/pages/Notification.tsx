// Notification.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const BASE_URL = import.meta.env.VITE_SERVER_URL as string;

interface NotificationItemData {
  notifyType: "board" | "friend" | string; // 서버에서 오는 값에 따라 확장 가능
  content: string;
  createdAt: string; // ISO 날짜 문자열
}

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

const Icon = styled.div<{ $type: string }>`
  width: 30px;
  height: 30px;
  background-image: ${({ $type }) =>
    $type === "board"
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

const Notification: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItemData[]>(
    []
  );

  useEffect(() => {
    // 알림 목록 가져오기
    const fetchNotifications = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`${BASE_URL}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        if (data.is_success) {
          setNotifications(data.payload as NotificationItemData[]);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("알림 목록을 불러오는 중 오류 발생:", error.message);
        } else {
          console.error("알림 목록을 불러오는 중 알 수 없는 오류:", error);
        }
      }
    };

    fetchNotifications();

    // SSE (서버발송이벤트) 연결
    const eventSource = new EventSource(`${BASE_URL}/subscribe`);

    eventSource.onmessage = (event: MessageEvent) => {
      const newNotification = JSON.parse(event.data) as NotificationItemData;
      setNotifications((prev) => [...prev, newNotification]);
    };

    eventSource.onerror = (error: Event) => {
      console.error("SSE 연결 중 오류 발생:", error);
      eventSource.close();
    };

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
            <Icon $type={notification.notifyType} />
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
};

export default Notification;
