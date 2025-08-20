import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;
  background-color: #ffffff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #003fe0;
  color: white;
  width: 100%;
  padding: 0.5vh 0;
  position: fixed;
  top: 0;
`;

const BackButton = styled(Link)`
  position: absolute;
  left: 5vw;
  top: 1.8vh;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  text-decoration: none;
  img {
    width: 1.3vh;
    height: auto;
  }
`;

const HeaderText = styled.h1`
  margin: 1vh 0;
  font-size: 3.5vh;
  text-align: center;

  @media (max-width: 1023px) {
    font-size: 2vh;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #333;
  text-align: left;
  width: 90%;
  margin: 5vh 0 0.5vh;
`;

const InputContainer = styled.div`
  width: 90%;
  margin-bottom: 2vh;

  input {
    width: 90%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 0.8rem;
    margin-top: 0.5vh;
  }
`;

const Footer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: auto;
`;

const ActionButton = styled(Link)`
  border: none;
  font-size: 2.7vh;
  width: 100%;
  background-color: ${(props) => (props.enabled ? "#3f51b5" : "#d3d3d3")};
  color: white;
  text-decoration: none;
  text-align: center;
  position: fixed;
  bottom: 0;
  display: block;
  padding: 2vh 0;

  @media (max-width: 1023px) {
    font-size: 2.5vh;
    padding: 2vh 0;
  }

  @media (max-width: 767px) {
    font-size: 2vh;
    padding: 1.8vh 0;
  }
`;

const Notice = styled.p`
  text-align: center;
  color: #999;
  font-size: 0.8rem;
  margin-top: 2vh;
`;

const ChangePw = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const isPasswordMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;

  const handleChangePassword = async () => {
    if (!isPasswordMatch) {
      alert("Passwords do not match!");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("You are not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/users/change/password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password successfully changed.");
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(`Failed to change password: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during password change:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton to="/mypage">
          <img src="./images/Back_icon.png" alt="back" />
        </BackButton>
        <HeaderText>비밀번호 변경</HeaderText>
      </Header>

      <Subtitle>본인 확인을 위해 현재 비밀번호를 입력해주세요</Subtitle>
      <InputContainer>
        <input
          type="password"
          placeholder="현재 비밀번호 입력"
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
        />
      </InputContainer>

      <Subtitle>변경할 비밀번호를 입력해주세요</Subtitle>
      <InputContainer>
        <input
          type="password"
          placeholder="변경할 비밀번호 입력"
          value={newPassword}
          onChange={handleNewPasswordChange}
        />
      </InputContainer>

      <Subtitle>확인을 위해 비밀번호를 한번 더 입력해주세요</Subtitle>
      <InputContainer>
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </InputContainer>

      <Notice>비밀번호를 변경하면 일주일 동안 변경하실 수 없습니다.</Notice>

      <Footer>
        <ActionButton
          as="button"
          onClick={handleChangePassword}
          enabled={isPasswordMatch}
        >
          확인
        </ActionButton>
      </Footer>
    </Container>
  );
};

export default ChangePw;
