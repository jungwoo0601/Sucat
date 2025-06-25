import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url("/images/Game/RankingBackground.png") no-repeat center center;
  background-size: cover;
  height: 80vh;
  padding: 2vh;
  position: relative;
  z-index: 1;
`;

const SquareBox = styled.div`
  position: absolute;
  top: 38vh;
  left: 0;
  width: 100%;
  height: 80%;
  background-color: #def0ff;
  opacity: 0.5;
  z-index: 0;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1vh;
  align-items: center;
`;

const BackButton = styled(Link)`
  width: 5vw;
  height: 5vw;
  margin-top: 1vh;
  background: url("/images/Game/BackArrow.png") no-repeat center center;
  background-size: contain;
  cursor: pointer;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 9.1vh;
  margin-left: -12vh;
  padding: 0 1vw;
`;

const Tab = styled.button`
  background: #ffffff;
  color: #003fe0;
  border: none;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 0.8vh 3vw;
  font-size: 0.8rem;
  cursor: pointer;
  margin: 0 0.1vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: width 0.3s ease, padding 0.3s ease;

  &:nth-child(1) {
    background-color: #003fe0;
    color: #ffffff;
  }

  &:nth-child(2) {
    background-color: #3d74ff;
    color: #ffffff;
  }

  &:nth-child(3) {
    background-color: #003fe0;
    color: #ffffff;
  }

  &:nth-child(4) {
    background-color: #3d74ff;
    color: #ffffff;
  }

  &:nth-child(5) {
    background-color: #003fe0;
    color: #ffffff;
  }

  box-shadow: ${(props) =>
    props.active
      ? "0px -4px 8px rgba(0, 0, 0, 0.1)"
      : "0px 4px 8px rgba(0, 0, 0, 0.05)"};
  width: ${(props) => (props.active ? "30vw" : "10vw")};

  ${(props) =>
    props.active &&
    css`
      overflow: visible;
      white-space: normal;
      text-overflow: clip;
    `}
`;

const RankingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border-radius: 0.8rem;
  padding: 1rem;
  margin: 1rem 0;
  width: 90%;
  position: relative;
  top: 3vh;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

const RankIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background-size: cover;
  margin-right: 1rem;
  ${(props) =>
    props.rank === 1 &&
    css`
      background-image: url("/images/Game/Goldmedal.png");
    `}
  ${(props) =>
    props.rank === 2 &&
    css`
      background-image: url("/images/Game/Silvermedal.png");
    `}
  ${(props) =>
    props.rank === 3 &&
    css`
      background-image: url("/images/Game/Bronzemedal.png");
    `}
`;

const ProfileImage = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #d9eaff;
  margin-right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #333;
`;

const RankText = styled.div`
  flex-grow: 1;
  text-align: left;
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
`;

const ScoreText = styled.div`
  font-size: 1rem;
  color: black;
  font-family: bold;
`;

const RecordBox = styled.div`
  background-color: white;
  border-radius: 0.8rem;
  padding: 2vh;
  margin-top: 3vh;
  box-shadow: 0px 8px 4px rgba(0, 0, 0, 0.5);
  text-align: left;
  width: 80%;
  border: 0.6vh solid blue; /* 진한 테두리 추가 */
  position: relative;
  bottom: 1vh;
`;

const RecordText = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0.3vh;
`;

const GameRanking = () => {
  const [activeTab, setActiveTab] = useState("과일싫다냥");
  const [rankingData, setRankingData] = useState([]);
  const [userGameInfo, setUserGameInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRankingData = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    // 게임 카테고리에 따라 API 엔드포인트의 카테고리 값 설정
    const categoryMap = {
      과일싫다냥: "Fruit",
      츄르찾아삼만리: "Churu",
      총알무섭다냥: "Bullet",
      커져라아토: "Ato",
      뚱냥이의격투: "Monster",
    };

    const category = categoryMap[activeTab] || "Fruit";

    // 첫 번째 API 호출: 개인 랭킹
    axios
      .get(`${SERVER_URL}/api/v1/game/user/ranking?category=${category}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (response.data.status === "OK") {
          setRankingData(response.data.payload.top10Players);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch individual ranking data:", error);
        setError("랭킹 정보를 불러오지 못했습니다.");
        setLoading(false);
      });

    // 두 번째 API 호출: 과 랭킹
    axios
      .get(
        `${SERVER_URL}/api/v1/game/department/ranking?category=${category}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === "OK") {
          setUserGameInfo(response.data.payload.userGameInfo);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch department ranking data:", error);
        setError("과 랭킹 정보를 불러오지 못했습니다.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRankingData();
  }, [activeTab]);

  const games = [
    "과일싫다냥",
    "츄르찾아삼만리",
    "총알무섭다냥",
    "커져라아토",
    "뚱냥이의격투",
  ];

  return (
    <Container>
      <SquareBox />
      <Header>
        <BackButton to="/gamelist" />
        <div />
      </Header>

      <TabsContainer>
        {games.map((game) => (
          <Tab
            key={game}
            active={activeTab === game}
            onClick={() => setActiveTab(game)}
          >
            {activeTab === game ? game : game.charAt(0)}
          </Tab>
        ))}
      </TabsContainer>
      {userGameInfo && (
        <RecordBox>
          <RecordText>개인 랭킹: {userGameInfo.ranking}</RecordText>
          <RecordText>
            개인 점수: {userGameInfo.score.toLocaleString()}
          </RecordText>
          <RecordText>과 랭킹: {userGameInfo.departmentRanking}</RecordText>
        </RecordBox>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        rankingData.map((player, index) => (
          <RankingItem key={player.userId}>
            <RankIcon rank={index + 1} />
            <ProfileImage />
            <RankText>
              {player.userNickname} ({player.department})
            </RankText>
            <ScoreText>{player.score.toLocaleString()}</ScoreText>
          </RankingItem>
        ))
      )}
    </Container>
  );
};

export default GameRanking;
