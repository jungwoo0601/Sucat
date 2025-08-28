// MyPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

const Container = styled.div`
  max-width: 100vw;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #3f51b5;
  color: white;
  padding: 10px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
  flex: 0 0 auto;
`;

const Placeholder = styled.div`
  width: 1.5em;
  flex: 0 0 auto;
`;

const Title = styled.h1`
  flex: 1 1 auto;
  text-align: center;
  font-size: 1.2em;
  margin: 0;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #d3d3d3;
  flex-direction: column;
`;

const ProfilePic = styled.div`
  width: 80px;
  height: 80px;
  background-color: #d3d3d3;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const Username = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 1.2em;
  text-align: center;
`;

const UserInfo = styled.p`
  margin: 0;
  font-size: 0.9em;
  color: #888;
  text-align: center;
`;

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  flex-wrap: wrap;
`;

const MenuButton = styled.button`
  flex: 1 1 calc(50% - 10px);
  margin: 5px;
  padding: 10px;
  background-color: white;
  border: 1px solid #d3d3d3;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1em;
  font-weight: bold;
  background-color: #f4f4f4;
  padding: 15px;
  margin: 0;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  right: 15px;
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span<{ $checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;

  &::before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  ${({ $checked }) =>
    $checked &&
    `
    background-color: #3f51b5;

    &::before {
      transform: translateX(20px);
    }
  `}
`;

const ListName = styled.p`
  position: relative;
  left: 15px;
  padding: 3px;
`;

const GeneralRow = styled.div`
  padding: 0px 0px;
  border-bottom: 2px solid #d3d3d3;

  &.top {
    border-top: 2px solid #d3d3d3;
    border-bottom: none;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const MyPage: React.FC = () => {
  const navigate = useNavigate();

  const [friendAlert, setFriendAlert] = useState<boolean>(false);
  const [postAlert, setPostAlert] = useState<boolean>(false);
  const [rankAlert, setRankAlert] = useState<boolean>(true);
  const [publicName, setPublicName] = useState<boolean>(true);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        alert("로그아웃 되었습니다.");
        navigate("/");
      } else {
        alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("로그아웃 요청 중 오류:", error.message);
      } else {
        console.error("알 수 없는 오류:", error);
      }
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>&lt;</BackButton>
        <Title>마이페이지</Title>
        <Placeholder />
      </Header>
      <ProfileSection>
        <ProfilePic />
        <Username>닉네임</Username>
        <UserInfo>흥흥홍 이메일@example.com 20210718</UserInfo>
      </ProfileSection>
      <Menu>
        <MenuButton>내가 쓴 글</MenuButton>
        <MenuButton>내가 쓴 댓글</MenuButton>
        <MenuButton>스크랩한 글</MenuButton>
        <MenuButton>공지사항</MenuButton>
      </Menu>
      <Section>
        <SectionTitle>알림설정</SectionTitle>
        <SettingRow>
          <ListName>친구추가 알림</ListName>
          <Switch>
            <Input
              type="checkbox"
              checked={friendAlert}
              onChange={() => setFriendAlert(!friendAlert)}
            />
            <Slider $checked={friendAlert} />
          </Switch>
        </SettingRow>
        <SettingRow>
          <ListName>게시글 관련 알림</ListName>
          <Switch>
            <Input
              type="checkbox"
              checked={postAlert}
              onChange={() => setPostAlert(!postAlert)}
            />
            <Slider $checked={postAlert} />
          </Switch>
        </SettingRow>
        <SettingRow>
          <ListName>게임 순위 변동 알림</ListName>
          <Switch>
            <Input
              type="checkbox"
              checked={rankAlert}
              onChange={() => setRankAlert(!rankAlert)}
            />
            <Slider $checked={rankAlert} />
          </Switch>
        </SettingRow>
      </Section>
      <Section>
        <SectionTitle>프로필</SectionTitle>
        <SettingRow>
          <ListName>게임 명령에서 닉네임 공개</ListName>
          <Switch>
            <Input
              type="checkbox"
              checked={publicName}
              onChange={() => setPublicName(!publicName)}
            />
            <Slider $checked={publicName} />
          </Switch>
        </SettingRow>
        <GeneralRow className="top">
          <ListName>
            <Link to="/profilechange">프로필, 닉네임, 전화번호 변경</Link>
          </ListName>
        </GeneralRow>
        <GeneralRow className="top">
          <ListName>
            <Link to="/profilepreview">내 프로필 미리</Link>
          </ListName>
        </GeneralRow>
      </Section>
      <Section>
        <SectionTitle>일반</SectionTitle>
        <GeneralRow>
          <ListName>비밀번호 변경</ListName>
        </GeneralRow>
        <GeneralRow>
          <ListName>문의하기</ListName>
        </GeneralRow>
        <GeneralRow>
          <ListName>서비스 약관</ListName>
        </GeneralRow>
        <GeneralRow>
          <ListName>개인정보처리방침</ListName>
        </GeneralRow>
        <GeneralRow>
          <ListName>오픈소스 라이센스</ListName>
        </GeneralRow>
        <GeneralRow>
          <ListName>이용제한 안내</ListName>
        </GeneralRow>
        <ButtonRow>
          <MenuButton onClick={handleLogout}>로그아웃</MenuButton>
          <MenuButton onClick={() => alert("회원탈퇴 기능")}>
            회원탈퇴
          </MenuButton>
        </ButtonRow>
      </Section>
    </Container>
  );
};

export default MyPage;
