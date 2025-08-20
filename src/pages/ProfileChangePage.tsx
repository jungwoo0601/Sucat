import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 1.2em;
  margin: 0;
`;

const Content = styled.div`
  padding: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const InputWrapper = styled.div`
  display: flex;
`;

const NicknameInput = styled.input`
  flex: 1;
  padding: 10px;
  margin-right: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const IntroInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #ccc;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ProfileSection = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 10px;
  background-color: #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;

const BackgroundImage = styled.div`
  width: 90%;
  max-width: 600px;
  height: 550px;
  background-color: #ccc;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
  margin-bottom: 10px;
  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FooterButton = styled.button`
  background-color: #f0f0f0; /* 약간의 회색 */
  border: none;
  color: #3f51b5;
  cursor: pointer;
  width: 40%; /* '이전' 버튼의 너비 */
  padding: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0; /* 약간 더 진한 회색 */
  }
`;

const SaveButton = styled(FooterButton)`
  background-color: #3f51b5;
  color: white;
  width: 60%; /* '정보 저장하기' 버튼의 너비 */

  &:hover {
    background-color: #2e3b8e; /* 저장 버튼에 호버 시 색상 변경 */
  }
`;

const ProfileChangePage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [intro, setIntro] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  // 기존 프로필 데이터를 가져오는 함수
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/profile-data");
        const data = await response.json();
        setNickname(data.nickname);
        setIntro(data.intro);
        setProfileImage(data.profileImage);
        setBackgroundImage(data.backgroundImage);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const checkNickname = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/check-nickname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname }),
      });
      const result = await response.json();
      if (result.exists) {
        alert("이미 사용 중인 닉네임입니다.");
      } else {
        alert("사용 가능한 닉네임입니다.");
      }
    } catch (error) {
      console.error("Error checking nickname:", error);
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(URL.createObjectURL(file));
  };

  const handleBackgroundImageChange = (event) => {
    const file = event.target.files[0];
    setBackgroundImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("intro", intro);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }
    if (backgroundImage) {
      formData.append("backgroundImage", backgroundImage);
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/save-profile`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("프로필 정보가 저장되었습니다.");
        navigate(-1);
      } else {
        alert("저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>&lt;</BackButton>
        <Title>프로필 정보 변경</Title>
        <div style={{ width: "1.5em" }} />
      </Header>
      <Content>
        <InputGroup>
          <Label>닉네임</Label>
          <InputWrapper>
            <NicknameInput
              type="text"
              placeholder="닉네임 입력"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <Button onClick={checkNickname}>중복 확인하기</Button>
          </InputWrapper>
          <p style={{ color: "red", fontSize: "0.8em" }}>
            * 닉네임은 한글과 영문을 포함해 2자 이상 20자 이하로 작성할 수
            있습니다.
          </p>
        </InputGroup>
        <InputGroup>
          <Label>한줄소개</Label>
          <InputWrapper>
            <IntroInput
              type="text"
              placeholder="한줄소개 입력"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
          </InputWrapper>
        </InputGroup>
        <ProfileSection>
          <ProfileImage
            onClick={() => document.getElementById("profileImageInput").click()}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="프로필"
                style={{ borderRadius: "50%", width: "100%", height: "100%" }}
              />
            ) : (
              <span role="img" aria-label="profile">
                📷
              </span>
            )}
          </ProfileImage>
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfileImageChange}
          />
          <Button
            onClick={() => document.getElementById("profileImageInput").click()}
          >
            프로필 사진 변경하기
          </Button>
        </ProfileSection>
        <ProfileSection>
          <BackgroundImage
            imageUrl={backgroundImage}
            onClick={() =>
              document.getElementById("backgroundImageInput").click()
            }
          />
          <input
            id="backgroundImageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleBackgroundImageChange}
          />
          <Button
            onClick={() =>
              document.getElementById("backgroundImageInput").click()
            }
          >
            배경사진 변경하기
          </Button>
        </ProfileSection>
      </Content>
      <Footer>
        <FooterButton onClick={() => navigate(-1)}>이전</FooterButton>
        <SaveButton onClick={handleSave}>정보 저장하기</SaveButton>
      </Footer>
    </Container>
  );
};

export default ProfileChangePage;
