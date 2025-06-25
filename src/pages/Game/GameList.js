import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useMusic } from "./MusicProvider";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url("/images/Game/GameBackground.png") no-repeat center center;
  background-size: cover;
  height: 100vh;
  padding: 2vh;
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const HomeIcon = styled(Link)`
  width: 7vw;
  height: 7vh;
  background: url("/images/Game/Gamehome.png") no-repeat center center;
  background-size: contain;
  margin-left: 5vw;
  display: block;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -2vh;
`;

const TitleImage = styled.div`
  width: 40vw;
  height: 30vh;
  background: url("/images/Game/GameMainText.png") no-repeat center center;
  background-size: contain;
  position: relative;
  top: 2vh;
`;

const GameSelection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2vh;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  width: 10vw;
  height: 10vh;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 2vw;
`;

const LeftNavButton = styled(NavButton)`
  background-image: url("/images/Game/Arrow.png");
`;

const RightNavButton = styled(NavButton)`
  background-image: url("/images/Game/Arrow1.png");
`;

const GameIcon1 = styled.div`
  width: 40vw;
  height: 40vw;
  background: url("/images/Game/GameChoice.png") no-repeat center center;
  background-size: contain;
`;

const GameIcon2 = styled(Link)`
  width: 50vw;
  height: 50vw;
  margin-left: 0.5vw;
  margin-right: 0.5vw;
  background: url("/images/Game/GameChoice.png") no-repeat center center;
  background-size: contain;
`;

const GameIcon3 = styled.div`
  width: 40vw;
  height: 40vw;
  background: url("/images/Game/GameChoice.png") no-repeat center center;
  background-size: contain;
`;

const GameTitleButton = styled.button`
  background: #003fe0;
  color: white;
  font-weight: bold;
  border: none;
  width: 40vw;
  padding: 0.5vh;
  border-radius: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 1vh;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  width: 40%;
  position: absolute;
  bottom: 8vh;
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  width: 20vw;
  height: 20vw;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const SettingsButton = styled(FooterButton)`
  background-image: url("/images/Game/GameSetting.png");
`;

const TrophyButton = styled(Link)`
  background-image: url("/images/Game/GameTrophy.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: -0.8vh;
  border: none;
  width: 23vw;
  height: 23vw;
  cursor: pointer;
  display: block;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
`;

// Game Setting 관련 스타일
const SettingsModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  height: auto;
  padding: 8vh;
  background: url("/images/Game/GameSetting2.png") no-repeat center center;
  background-size: contain;
  border: none;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 3vh;
  right: 5vh;
  background: url("/images/Game/CloseSetting.png") no-repeat center center;
  background-size: contain;
  width: 1.2rem;
  height: 1.2rem;
  border: none;
  cursor: pointer;
`;

const SettingsOption = styled.div`
  width: 100%;
  margin: 1.5vh 2vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20vw;
`;

const StyledInput = styled.input`
  width: 75%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: none;
  border-radius: 0.5rem;
  background-color: #e0e0e0;
  &:focus {
    outline: none;
    background-color: #c0c0c0;
  }
`;

const RangeWrapper = styled.div`
  position: relative;
  width: 80%;
  height: 8px;
  background-color: #bfdcff; /* 비활성화된 전체 바 색상 */
  border-radius: 5px;
  margin: 0.5rem 0;
`;

const RangeProgress = styled.div`
  position: absolute;
  height: 100%;
  background-color: #003fe0; /* 활성화된 부분의 색상 */
  border-radius: 5px;
  width: ${(props) => props.width}%; /* 슬라이더 값에 따라 너비 조절 */
`;

const StyledRange = styled.input.attrs({ type: "range" })`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
  padding: 0;
  appearance: none; /* 기본 슬라이더 스타일 제거 */
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 4.7vh;
  height: 2.4vh;
  left: 14vh;
  top: 2.1vh;

  input {
    display: none;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: background-color 0.4s;
    border-radius: 2vh;
    &:before {
      content: "";
      position: absolute;
      height: 1.9vh;
      width: 1.8vh;
      border-radius: 50%;
      left: 0.4vh;
      bottom: 0.25vh;
      background-color: white;
      transition: transform 0.4s;
    }
  }

  input:checked + span {
    background-color: #003fe0;
    &:before {
      transform: translateX(2.2vh);
    }
  }
`;

const RangeSlider = ({ value, onChange }) => (
  <RangeWrapper>
    <RangeProgress width={value} />
    <StyledRange min="0" max="100" value={value} onChange={onChange} />
  </RangeWrapper>
);

const GameList = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [rangeValue1, setRangeValue1] = useState(50);
  const [rangeValue2, setRangeValue2] = useState(50);
  const { pauseMusic, playMusic } = useMusic();
  const audioRef = useRef(new Audio("/GameMusic.mp3")); // 오디오 요소 생성

  const gameTitles = [
    { title: "과일싫은냥냥이", link: "/gamewaiting" },
    { title: "츄르찾아삼만리", link: "/gamewaiting2" },
    { title: "총알무섭다냥", link: "/gamewaiting3" },
    { title: "커져라아토", link: "/gamewaiting4" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRightNavClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gameTitles.length);
  };

  const handleLeftNavClick = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + gameTitles.length) % gameTitles.length
    );
  };

  const toggleSettings = () => setSettingsOpen(!isSettingsOpen);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = rangeValue1 / 100; // 볼륨 값 반영
  }, [rangeValue1]); // rangeValue1이 변경될 때마다 오디오 볼륨 설정

  // 슬라이더 변화 이벤트
  const handleVolumeChange = (e) => {
    setRangeValue1(e.target.value); // 슬라이더 값만 업데이트
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.play(); // 컴포넌트가 처음 렌더링 될 때 음악을 한 번만 재생
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []); // 처음 렌더링 될 때만 실행

  const handleHomeClick = () => {
    pauseMusic();
    audioRef.current.pause(); // 홈으로 이동 시 음악 중지
  };

  return (
    <Container>
      <Header>
        <HomeIcon to="/home" onClick={handleHomeClick} />
      </Header>
      <Body>
        <TitleImage />
        <GameSelection>
          <LeftNavButton onClick={handleLeftNavClick} />
          <GameIcon2 to={gameTitles[currentIndex].link} />
          <RightNavButton onClick={handleRightNavClick} />
        </GameSelection>
        <GameTitleButton>{gameTitles[currentIndex].title}</GameTitleButton>
      </Body>

      <Footer>
        <SettingsButton onClick={toggleSettings} />
        <TrophyButton to="/gameranking" />
      </Footer>

      {isSettingsOpen && (
        <>
          <Overlay onClick={toggleSettings} />
          <SettingsModal>
            <CloseButton onClick={toggleSettings} />
            <SettingsOption>
              <StyledInput type="text" />
            </SettingsOption>
            <SettingsOption>
              <RangeSlider value={rangeValue1} onChange={handleVolumeChange} />
            </SettingsOption>
            <SettingsOption>
              <RangeSlider
                value={rangeValue2}
                onChange={(e) => setRangeValue2(e.target.value)}
              />
            </SettingsOption>
            <SettingsOption>
              <ToggleSwitch>
                <input type="checkbox" />
                <span></span>
              </ToggleSwitch>
            </SettingsOption>
          </SettingsModal>
        </>
      )}
    </Container>
  );
};

export default GameList;
