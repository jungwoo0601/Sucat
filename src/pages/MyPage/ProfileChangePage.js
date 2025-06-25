import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
  background-color: #f0f0f0;
  border: none;
  color: #3f51b5;
  cursor: pointer;
  width: 40%;
  padding: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const SaveButton = styled(FooterButton)`
  background-color: #003fe0;
  color: white;
  width: 60%;

  &:hover {
    background-color: #2e3b8e;
  }
`;

const ProfileChangePage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [initialNickname, setInitialNickname] = useState(""); // 초기 닉네임 상태 추가
  const [intro, setIntro] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${SERVER_URL}/api/v1/users/change/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const result = await response.json();

        if (result.is_success) {
          setNickname(result.payload.nickname);
          setInitialNickname(result.payload.nickname); // 초기 닉네임 설정
          setIntro(result.payload.intro);
          setProfileImage(result.payload.imageName);
        } else {
          console.error("API 호출에 실패했습니다:", result.message);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const checkNickname = async () => {
    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/users/nickname/duplication?nickname=${nickname}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      alert(
        result.is_success === true
          ? "사용 가능한 닉네임입니다."
          : "다른 이용자가 사용 중인 닉네임이거나 이미 본인의 닉네임입니다."
      );
    } catch (error) {
      console.error("Error checking nickname:", error);
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const blob = new Blob([file], { type: file.type });
      setProfileImage(URL.createObjectURL(blob));
    }
  };

  const handleBackgroundImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const blob = new Blob([file], { type: file.type });
      setBackgroundImage(URL.createObjectURL(blob));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    // nickname이 초기 닉네임과 다를 때만 추가
    const profileData = {
      intro: intro,
      ...(nickname !== initialNickname && { nickname: nickname }), // 닉네임이 초기값과 다를 때만 추가
    };

    formData.append(
      "userProfileUpdateRequest",
      new Blob([JSON.stringify(profileData)], { type: "application/json" })
    );

    // 프로필 이미지 Blob 형태로 추가
    if (profileImage) {
      const response = await fetch(profileImage);
      const blob = await response.blob();
      formData.append("image", blob, "profileImage.jpg");
    }

    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/users/change/profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.is_success) {
        alert("프로필 정보가 저장되었습니다.");
        navigate(-1);
      } else {
        alert(`저장 중 오류가 발생했습니다: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("프로필 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
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
              value={nickname || ""}
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
              value={intro || ""}
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
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span>프로필 이미지</span>
            )}
          </ProfileImage>
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfileImageChange}
          />
          <p>프로필 사진</p>
        </ProfileSection>
        <ProfileSection>
          <BackgroundImage
            imageUrl={backgroundImage || ""}
            onClick={() =>
              document.getElementById("backgroundImageInput").click()
            }
          >
            {!backgroundImage && <span>배경 이미지</span>}
          </BackgroundImage>
          <input
            id="backgroundImageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleBackgroundImageChange}
          />
          <p>배경 사진</p>
        </ProfileSection>
      </Content>
      <Footer>
        <FooterButton onClick={() => navigate(-1)}>취소</FooterButton>
        <SaveButton onClick={handleSave}>저장하기</SaveButton>
      </Footer>
    </Container>
  );
};

export default ProfileChangePage;
