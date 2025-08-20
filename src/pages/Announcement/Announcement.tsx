import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

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

const SearchButton = styled.img`
  cursor: pointer;
  width: 4vw;
  position: absolute;
  right: 7vw;
  top: 35%;
  transform: translateY(-50%);
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
  color: black;
  font-weight: bold;
  border: none;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1vh;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -3vh;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5vh 4vw;
  border-bottom: 0.1rem solid #ddd;
  cursor: pointer;
`;

const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemTitle = styled.h2`
  font-size: 1rem;
  margin: 0 0 0.3vh 0;
  color: #333;
`;

const ItemDate = styled.p`
  font-size: 0.8rem;
  color: #999;
  margin: 0;
`;

const Pointer = styled.img`
  width: 3vw;
  height: 3vw;
`;

const Announcement = () => {
  const [tab, setTab] = useState("system");
  const [announcements, setAnnouncements] = useState({
    system: [],
    school: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          tab === "system"
            ? `${SERVER_URL}/notification/system`
            : `${SERVER_URL}/notification/school`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        if (data.is_success) {
          if (tab === "system") {
            setAnnouncements((prev) => ({
              ...prev,
              system: data.payload.systemList.map((item) => ({
                id: item.notificationId,
                title: item.title,
                date: item.createTime,
              })),
            }));
          } else if (tab === "school") {
            window.location.href = data.payload.url;
          }
        }
      } catch (error) {
        console.error("공지사항을 가져오는 중 오류가 발생했습니다.", error);
      }
    };

    fetchAnnouncements();
  }, [tab]);

  const currentAnnouncements = announcements[tab];

  return (
    <Container>
      <Header>
        <Link to="/home">
          <BackButton src="/images/Back_icon.png" alt="Back" />
        </Link>
        <TitleContainer>
          <Title>공지사항</Title>
          <Subtitle>
            총{" "}
            <HighlightText>{currentAnnouncements?.length || 0}</HighlightText>
            건의 공지사항이 있습니다.
          </Subtitle>
        </TitleContainer>
        <SearchButton src="/images/searchwhite_icon.png" alt="Search" />
      </Header>
      <Tabs>
        <Tab active={tab === "system"} onClick={() => setTab("system")}>
          시스템
        </Tab>
        <Tab active={tab === "school"} onClick={() => setTab("school")}>
          학교 공지
        </Tab>
      </Tabs>
      {tab === "system" && (
        <List>
          {currentAnnouncements?.map((item) => (
            <Link
              to="/announcedetail"
              state={{
                notificationId: item.id, // state로 notificationId 전달
                title: item.title,
                date: item.date,
                content: "아무내용이나 적어볼게!",
              }}
              key={item.id}
            >
              <ListItem>
                <ItemContent>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemDate>{item.date}</ItemDate>
                </ItemContent>
                <Pointer src="/images/pointer.png" alt="Details" />
              </ListItem>
            </Link>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Announcement;
