import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useParams, useLocation } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Styled Components
const Container = styled.div`
  background-color: white;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1vh 2vw;
  background: linear-gradient(90deg, #003fe0 100%, #00227a 100%);
  position: relative;
  height: 17vh;
  z-index: 1;
`;

const BackButton = styled.img`
  cursor: pointer;
  width: 2.5vw;
  position: absolute;
  left: 3vw;
  top: 35%;
  margin-left: 1vh;
  transform: translateY(-50%);
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: -5vh;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  margin-left: -23vh;
  margin-top: 3.2vh;
`;

const Subtitle = styled.p`
  font-size: 0.8rem;
  color: #fffefe;
  margin: 0.1vh 11.8vh 0 0;
`;

const HighlightText = styled.span`
  color: #ff3364;
`;

const Content = styled.div`
  padding: 1vh 3vw;
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
  margin-top: -4vh;
  background-color: #f9f9f9;
  height: 78vh;
`;

const AnnouncementTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1vh;
  margin-bottom: 1vh;
  white-space: nowrap;
`;

const AnnouncementTitle = styled.h2`
  font-size: 1rem;
  font-weight: bold;
`;

const AnnouncementDate = styled.p`
  font-size: 0.8rem;
  color: #999;
  margin-left: 1vw; /* 제목과 날짜 사이의 간격 조정 */
`;

const AnnouncementContent = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #333;
`;

const AnnouncementImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 20px;
`;

const BackButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`;

const BackButtonText = styled.button`
  background-color: white;
  color: black;
  width: 100%;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  padding: 1.5vh 0;
  cursor: pointer;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  top: -4.3vh;
  z-index: 2;
  color: black;
  width: 100%;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.7vh 0;
  font-size: 0.9rem;
  background-color: ${(props) => (props.active ? "white" : "#CAD9FF")};
  color: ${(props) => (props.active ? "#003fe0" : "#333")};
  border: none;
  border-radius: 10px 10px 0 0;
  cursor: not-allowed;
  transition: background-color 0.3s;
  margin-top: 1vh;
`;

const AnnounceDetail = () => {
  const { state } = useLocation(); // location에서 state를 받아옴
  const notificationId = state?.notificationId; // notificationId를 가져옴
  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
    createTime: "",
    imageNames: [], // 기본값을 빈 배열로 설정
  });

  useEffect(() => {
    const fetchAnnouncementDetail = async () => {
      try {
        const response = await fetch(
          `${SERVER_URL}/notification/${notificationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        console.log("API Response:", data.payload); // API 응답을 디버깅용으로 출력
        if (data.is_success) {
          setAnnouncement(data.payload || {}); // 데이터가 없을 경우를 대비한 안전한 설정
        }
      } catch (error) {
        console.error("Error fetching announcement details:", error);
      }
    };

    if (notificationId) {
      fetchAnnouncementDetail(); // notificationId가 있을 때만 API 요청
    }
  }, [notificationId]);

  return (
    <Container>
      <Header>
        <Link to="/announcement">
          <BackButton src="/images/Back_icon.png" alt="Back" />
        </Link>
        <TitleContainer>
          <Title>공지사항</Title>
          <Subtitle>
            작성일: <HighlightText>{announcement.createTime}</HighlightText>
          </Subtitle>
        </TitleContainer>
      </Header>
      <Tabs>
        <Tab active={true}>시스템</Tab>
        <Tab active={false}>학교 공지</Tab>
      </Tabs>
      <Content>
        <AnnouncementTitleRow>
          <AnnouncementTitle>{announcement.title}</AnnouncementTitle>
          <AnnouncementDate>{announcement.createTime}</AnnouncementDate>
        </AnnouncementTitleRow>
        <AnnouncementContent>{announcement.content}</AnnouncementContent>
        {Array.isArray(announcement.imageNames) &&
          announcement.imageNames.map((imageName, index) => (
            <AnnouncementImage
              key={index}
              src={`${SERVER_URL}/images/${imageName}`}
              alt={`announcement-${index}`}
            />
          ))}
      </Content>
      <BackButtonContainer>
        <Link to="/announcement">
          <BackButtonText>돌아가기</BackButtonText>
        </Link>
      </BackButtonContainer>
    </Container>
  );
};

export default AnnounceDetail;
