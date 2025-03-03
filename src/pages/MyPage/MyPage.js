import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

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
  background-color: #003fe0;
  color: white;
  padding: 3.2vw;
`;

const BackButton = styled(Link)`
  position: absolute;
  left: 5vw;
  background: none;
  border: none;
  cursor: pointer;
  img {
    width: 0.7rem;
    height: auto;
  }
`;

const Placeholder = styled.div`
  width: 1.5em;
  flex: 0 0 auto;
`;

const Title = styled.h1`
  flex: 1 1 auto;
  text-align: center;
  font-size: 1.1rem;
  margin: 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit; // 부모 요소의 색상을 사용
  &:hover {
    color: inherit; // 링크에 hover될 때도 색상 유지
  }
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
  background-image: url(${(props) =>
    props.imageUrl || "/images/default_profile.png"});
  background-size: cover;
  background-position: center;
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

function MyPage() {
  const [profileName, setProfileName] = useState("");
  const [profileIntro, setProfileIntro] = useState("");
  const [profileDepartment, setProfileDepartment] = useState("");
  const [profile, setProfile] = useState(""); // 프로필 이미지 URL 상태
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    axios
      .get(`${SERVER_URL}/api/v1/users/myProfile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (response.data.is_success) {
          setProfileName(response.data.payload.nickname);
          setProfileIntro(response.data.payload.intro);
          setProfileDepartment(response.data.payload.department);
          setProfile(response.data.payload.imageUrl);
        }
      })
      .catch(() => {
        console.error("프로필 정보를 불러오지 못했습니다.");
      });
  }, []);

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      alert("로그아웃 처리됨");
      navigate("/"); // 페이지 이동
    }
  };

  return (
    <Container>
      <Header>
        <BackButton to="/home">
          <img src="/images/Back_icon.png" alt="Back" />
        </BackButton>
        <Title>마이페이지</Title>
        <Placeholder />
      </Header>
      <ProfileSection>
        {/* 동적 프로필 이미지 렌더링 */}
        <ProfilePic imageUrl={profile} />
        <Username>{profileName}</Username>
        <UserInfo>{profileDepartment}</UserInfo>
        <UserInfo>{profileIntro}</UserInfo>
      </ProfileSection>
      <Menu>
        <MenuButton>
          <StyledLink to="/mypost">내가 쓴 글</StyledLink>
        </MenuButton>
        <MenuButton>
          <StyledLink to="/mycomment">댓글을 달았던 게시글</StyledLink>
        </MenuButton>
        <MenuButton>
          <StyledLink to="/myscrap">스크랩한 게시글</StyledLink>
        </MenuButton>
        <MenuButton>
          <StyledLink to="/announcement">공지사항</StyledLink>
        </MenuButton>
      </Menu>

      <Section>
        <SectionTitle>프로필</SectionTitle>
        <ListName>
          <StyledLink to="/profilechange">프로필, 닉네임 변경</StyledLink>
        </ListName>

        <SectionTitle>일반</SectionTitle>
        <GeneralRow>
          <ListName>
            <StyledLink to="/changepw">비밀번호 변경</StyledLink>
          </ListName>
        </GeneralRow>
        <GeneralRow>
          <ListName>
            <StyledLink to="/inquiry">문의하기</StyledLink>
          </ListName>
        </GeneralRow>
        <GeneralRow>
          <ListName>
            <StyledLink to="/termsofservice">서비스 약관</StyledLink>
          </ListName>
        </GeneralRow>
        <GeneralRow>
          <ListName>
            <StyledLink to="/privacypolicy">개인정보처리방침</StyledLink>
          </ListName>
        </GeneralRow>
        <GeneralRow>
          <ListName>
            <StyledLink to="/opensourcelicenses">오픈소스 라이센스</StyledLink>
          </ListName>
        </GeneralRow>
        <GeneralRow>
          <ListName>
            <StyledLink to="/restrictioninfo">이용제한 안내</StyledLink>
          </ListName>
        </GeneralRow>
        <ButtonRow>
          <MenuButton onClick={handleLogout}>로그아웃</MenuButton>
        </ButtonRow>
      </Section>
    </Container>
  );
}

export default MyPage;
