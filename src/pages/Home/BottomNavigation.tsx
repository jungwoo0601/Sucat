import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const BottomNavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  background-color: #fff;
  border-top: 3px solid #ddd;
  position: fixed;
  bottom: 0;
  width: 100%;
  border-radius: 15px 15px 0 0;
`;

const NavButton = styled(Link)`
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
`;

const NavIcon = styled.img`
  height: auto;
`;

const NavText = styled.div`
  padding-top: 0.5vh;
`;

function BottomNavigation() {
  return (
    <BottomNavContainer>
      <NavButton to="/home">
        <NavIcon src="/images/home_icon.png" alt="홈" width="60%" />
        <NavText size="0.8rem">홈</NavText>
      </NavButton>
      <NavButton to="/gamelist">
        <NavIcon src="/images/game_icon.png" alt="게임" width="65%" />
        <NavText size="0.8rem">게임</NavText>
      </NavButton>
      <NavButton to="/chatpage">
        <NavIcon src="/images/chat.png" alt="공지사항" width="65%" />
        <NavText size="0.8rem">채팅</NavText>
      </NavButton>
      <NavButton to="/announcement">
        <NavIcon
          src="/images/announcement_icon.png"
          alt="공지사항"
          width="40%"
        />
        <NavText size="0.8rem">공지사항</NavText>
      </NavButton>
      <NavButton to="/Mypage">
        <NavIcon src="/images/mypage_icon.png" alt="마이페이지" width="33%" />
        <NavText size="0.8rem">마이페이지</NavText>
      </NavButton>
    </BottomNavContainer>
  );
}

export default BottomNavigation;
