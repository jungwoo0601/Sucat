// Loginpage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

const Container = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: "Arial, sans-serif";
  color: black;
  padding: 2vw;
  box-sizing: border-box;
  position: relative;

  @media (min-width: 1024px) {
    transform: scale(1);
    transform-origin: top left;
  }
`;

const Header = styled.div`
  transform: translate(-8vw, -2.5vh);
`;

const Title = styled.h1`
  color: #003fe0;
  font-size: 12vw;
  font-family: sans-serif;
  font-weight: 900;
  position: absolute;
  transform: translate(-20vw, -22vh);

  @media (min-width: 1024px) {
    font-size: 6vw;
    transform: translate(-12vw, -14vh);
  }
`;

const Subtitle = styled.h2`
  font-size: 3.2vw;
  color: #333;
  font-weight: bold;
  transform: translate(-20vw, -21vh);

  @media (min-width: 1024px) {
    font-size: 1.5vw;
    transform: translate(-12vw, -9vh);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  max-width: 110%;
  position: relative;
  transform: translateY(-35vw);

  @media (min-width: 1024px) {
    transform: translateY(-17.5vw);
  }
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 4.5vw;
  margin-bottom: 4vw;
  border: 0.2vw solid #000000;
  border-radius: 3vw;
  font-size: 2.6vw;
  box-sizing: border-box;
  background-color: white;

  @media (min-width: 1024px) {
    padding: 2.25vw;
    margin-bottom: 2vw;
    border-radius: 1.5vw;
    font-size: 1.3vw;
  }
`;

const CatImage = styled.img`
  position: absolute;
  top: 3.8vw;
  left: 85%;
  transform: translate(-50%, -100%);
  width: 17vw;
  height: auto;

  @media (min-width: 1024px) {
    top: 1.9vw;
    width: 8.5vw;
  }
`;

const LoginButton = styled.button`
  width: 95%;
  padding: 3.5vw;
  background-color: #003fe0;
  color: white;
  border: none;
  border-radius: 3vw;
  font-size: 3vw;
  font-family: sans-serif;
  cursor: pointer;
  transform: translateY(47vh);

  @media (min-width: 1024px) {
    padding: 1.75vw;
    border-radius: 1.5vw;
    font-size: 1.5vw;
    transform: translateY(19vh);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2vw;
  font-size: 3vw;
  position: absolute;
  transform: translate(1.5vh, 46vh);

  @media (min-width: 1024px) {
    font-size: 1.5vw;
    transform: translate(0.9vh, 18.5vh);
  }
`;

const FooterLink = styled.a`
  color: #007bff;
  text-decoration: none;
  margin: 0 1vw;
  cursor: pointer;

  @media (min-width: 1024px) {
    margin: 0 0.5vw;
  }
`;

const Divider = styled.span`
  margin: 0 10vw;

  @media (min-width: 1024px) {
    margin: 0 5vw;
  }
`;

const Loginpage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      // 응답 헤더와 토큰 값 출력
      console.log("Response Headers:", response.headers);
      const accessToken = response.headers.get("Authorization");

      console.log("Access Token:", accessToken);

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        alert("로그인 성공!");
        navigate("/home");
      } else {
        alert("로그인 실패: 토큰이 발급되지 않았습니다.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("로그인 중 오류 발생:", error.message);
      } else {
        console.error("알 수 없는 오류 발생:", error);
      }
      alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleJoin = () => {
    navigate("/joinpage");
  };

  const handleFindPw = () => {
    navigate("/findpw");
  };

  return (
    <Container>
      <Header>
        <Title>SUCAT!</Title>
        <Subtitle>대학 생활의 또 다른 시작,</Subtitle>
      </Header>
      <Form onSubmit={handleLogin}>
        <InputContainer>
          <CatImage src="./images/SucatLogo.png" alt="Cat" />
          <Input
            placeholder="아이디 입력"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </InputContainer>
        <Input
          placeholder="비밀번호 입력"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <LoginButton type="submit">로그인</LoginButton>
      </Form>
      <Footer>
        <FooterLink onClick={handleJoin}>회원가입</FooterLink>
        <Divider>|</Divider>
        <FooterLink onClick={handleFindPw}>비밀번호 찾기</FooterLink>
      </Footer>
    </Container>
  );
};

export default Loginpage;
