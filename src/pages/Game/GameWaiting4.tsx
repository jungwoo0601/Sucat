import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useMusic } from "./MusicProvider";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url("/images/Game/GameBackground.png") no-repeat center center;
  background-size: cover;
  height: 100vh;
  padding: 2vh;
  position: relative;
  z-index: 1;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 1vh;
  z-index: 3;
`;

const BackButton = styled(Link)`
  width: 7vw;
  height: 7vw;
  margin-top: 1vh;
  background: url("/images/Game/BackArrow.png") no-repeat center center;
  background-size: contain;
  cursor: pointer;
  z-index: 3;
`;

const TopImage = styled.div`
  width: 30vw;
  height: 30vw;
  background: url("/images/Game/GameChoice.png") no-repeat center center;
  background-size: contain;
  margin-top: 2vh;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 10rem;
  width: 100%;
  height: 30%;
  padding: 10vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 6vh;
  position: absolute;
  top: 20vh;
`;

const TitleButton = styled.button`
  background: #003fe0;
  color: white;
  font-weight: bold;
  border: none;
  padding: 1vh 2vw;
  border-radius: 0.8rem;
  font-size: 1rem;
  cursor: pointer;
  margin: 1vh;
  width: 30%;
  z-index: 10;
`;

const InstructionText = styled.p`
  font-size: 0.9rem;
  text-align: center;
  font-weight: 999;
  margin-top: 3vh;
  margin-bottom: 20vh;
  z-index: 10;
`;

const InstructionImage = styled.div`
  width: 60%;
  height: 20%;
  background: url("/images/Game/GameInstruction4.png") no-repeat center center;
  background-size: contain;
  margin-top: 9vh;
  margin-bottom: 2vh;
  position: absolute;
  top: 32vh;
`;

const StartButton = styled.button`
  background: #003fe0;
  color: white;
  font-weight: 999;
  border: none;
  padding: 1vh 6vw;
  border-radius: 1rem;
  font-size: 2rem;
  cursor: pointer;
  margin-bottom: 3vh;
  margin-top: 9vh;
  z-index: 10;
`;

const Footer = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 5vh;
`;

const RankTitle = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
  margin-bottom: 2vh;
`;

const RankList = styled.div`
  display: flex;
  overflow-x: auto;
  width: 100%;
  gap: 1vw;
  padding: 1vh;
  &::-webkit-scrollbar {
    display: none; /* 스크롤바 숨기기 */
  }
`;

const RankText = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: white;
  margin-right: 1vw;
`;

const RankLine = styled.div`
  flex-grow: 1;
  height: 2px;
  background-color: white;
`;

const RankItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 1rem;
  padding: 1vh;
  min-width: 20vw;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.div`
  width: 5vw;
  height: 5vw;
  border-radius: 50%;
  background-color: #d9eaff;
  margin-bottom: 1vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #333;
`;

const RankName = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5vh;
`;

const RankScore = styled.div`
  font-size: 0.8rem;
  color: #003fe0;
`;

const GameContainer = styled.div`
  width: 100%;
  height: 80%;
  display: ${({ showGame }) => (showGame ? "block" : "none")};
`;

const GameWaiting4 = () => {
  const [showGame, setShowGame] = useState(false);
  const [top10Players, setTop10Players] = useState([]);
  const { pauseMusic, playMusic } = useMusic();

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/api/v1/game/user/ranking?category=Ato`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response.data.status === "OK") {
          setTop10Players(response.data.payload.top10Players);
        }
      } catch (error) {
        console.error("Failed to fetch ranking data:", error);
      }
    };

    fetchRankingData();
  }, []);

  const handleStartGame = () => {
    setShowGame(true);
    pauseMusic();
  };

  const handleCloseGame = () => {
    setShowGame(false);
    playMusic();
  };
  return (
    <>
      <Container>
        <Header>
          <BackButton to="/gamelist" onClick={handleCloseGame} />
        </Header>
        {!showGame && (
          <>
            <TopImage />
            <ContentBox />
            <InstructionImage />
            <TitleButton>커져라아토</TitleButton>
            <InstructionText>
              수원대의 마스코트 아토가 점점 커진대요! <br />
              많이 많이 커지게 해주세요!
            </InstructionText>
            <StartButton onClick={handleStartGame}>START</StartButton>
          </>
        )}
        {showGame && (
          <GameContainer showGame={showGame}>
            <iframe
              title="UnityGame"
              src="/Ato/index.html"
              style={{
                position: "absolute",
                top: "11%",
                left: "-0.2%",
                right: "0",
                bottom: "0",
                width: "100vw",
                height: "88vh",
              }}
            />
          </GameContainer>
        )}
        {!showGame && (
          <Footer>
            <RankTitle>
              <RankText>RANK</RankText>
              <RankLine />
            </RankTitle>
            <RankList>
              {top10Players.map((player, index) => (
                <RankItem key={player.userId}>
                  <ProfileImage>{player.userNickname.charAt(0)}</ProfileImage>
                  <RankName>{player.userNickname}</RankName>
                  <RankScore>Score: {player.score}</RankScore>
                  <RankScore>Rank: {index + 1}</RankScore>
                </RankItem>
              ))}
            </RankList>
          </Footer>
        )}
      </Container>
    </>
  );
};

export default GameWaiting4;
