import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
  width: 100%; /* 부모 요소 기준 */
  max-width: 100vw; /* 가로 확장 방지 */
  padding: 0.5vh 0;
  position: fixed;
  top: 0;
  box-sizing: border-box; /* 패딩 포함 크기 고정 */
  z-index: 100; /* 다른 요소 위로 배치 */
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

const Notice = styled.p`
  text-align: center;
  position: relative;
  left: -21%;
  top: 5%;
  margin-bottom: 3vh;
  font-size: 0.9rem;
  color: #003fe0;
  font-weight: 900;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #333;
  text-align: left;
  width: 90%;
  margin: 5vh 0 0.5vh; /* 상단 마진을 줄임 */
`;

const EmailInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  position: relative;
  left: 3.5vw;
  margin-top: 0.5vh;

  Button {
    width: 28%;
    position: absolute;
    right: 5vw;
  }
`;

const InputLabel = styled.span`
  font-size: 1rem;
  color: #333;
  margin-left: 1vw;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.8rem;
  width: 30%;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #cfcfcf;
  color: #000;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  min-width: 100px;
  font-weight: bold;
  font-size: 0.8rem;
`;

const CodeInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
  margin-top: 0.5vh; /* 상단 마진을 줄임 */
`;

const VerificationCodeInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  flex: 1;
  margin-right: 10px;
`;

const PWInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 243%;
  margin-top: 1vh;
  margin-left: -10vw;

  input {
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 0.8rem;
    width: 35%;
    margin-bottom: 1vh;
    margin-left: 10vw;
  }
`;

const Footer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 4vh;
`;

const CompleteButton = styled(Link)`
  border: none;
  font-size: 2.7vh;
  width: 100%; /* 부모 요소 기준 */
  max-width: 100vw; /* 가로 확장 방지 */
  background-color: ${(props) => (props.enabled ? "#3f51b5" : "#d3d3d3")};
  color: white;
  text-decoration: none;
  text-align: center;
  position: fixed;
  bottom: 0;
  display: block;
  padding: 2vh 0;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    font-size: 2.5vh;
    padding: 2vh 0;
  }

  @media (max-width: 767px) {
    font-size: 2vh;
    padding: 1.8vh 0;
  }
`;

const FindPw = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [serverCode, setServerCode] = useState(""); // Code from server
  const [isVerified, setIsVerified] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL; // Replace with your server URL

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
    if (e.target.value === serverCode) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  };

  const handleButtonClick = () => {
    if (isVerified) {
      setIsButtonClicked(true);
      setShowPasswordFields(true);
    }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const isPasswordMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;

  const handleEmailVerification = async () => {
    if (email.trim() === "") {
      alert("이메일을 입력해주세요");
    } else {
      const fullEmail = `${email.trim()}@suwon.ac.kr`;

      try {
        const response = await fetch(
          `${SERVER_URL}/api/v1/verification/email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: fullEmail }),
          }
        );

        const data = await response.json();

        if (data.is_success) {
          alert("인증번호가 발송되었습니다.");
          setServerCode(data.code); // Set serverCode to the code from server
        } else {
          alert(`인증번호 발송 실패: ${data.message}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("인증번호 발송 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleVerificationCodeCheck = async () => {
    const fullEmail = `${email.trim()}@suwon.ac.kr`;

    if (verificationCode.trim() === "") {
      alert("인증번호를 입력해주세요");
    } else {
      try {
        const response = await fetch(`${SERVER_URL}/api/v1/verification/code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: fullEmail,
            code: verificationCode.trim(),
          }),
        });

        const data = await response.json();

        if (data.is_success) {
          setIsVerified(true);
          alert("이메일 인증이 완료되었습니다.");
          setShowPasswordFields(true);
        } else {
          alert(`인증 실패: ${data.message}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("이메일 인증 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handlePasswordChange = async () => {
    if (!isVerified || !isPasswordMatch) {
      alert("이메일 인증과 비밀번호 확인이 필요합니다.");
      return;
    }

    const fullEmail = `${email.trim()}@suwon.ac.kr`;
    const payload = {
      email: fullEmail,
      password: newPassword,
    };

    try {
      const response = await fetch(`${SERVER_URL}/api/v1/users/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.is_success) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/"); // 성공적으로 변경 후 페이지 이동
      } else {
        alert(`비밀번호 변경 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton to="/">
          <img src="./images/Back_icon.png" alt="back" />
        </BackButton>
        <HeaderText>비밀번호 찾기</HeaderText>
      </Header>

      <Notice>귀하의 이메일을 입력해주세요.</Notice>

      <Subtitle>수원대 전자메일 주소</Subtitle>
      <EmailInputContainer>
        <Input
          type="email"
          placeholder="Example : xxxxxx"
          value={email}
          onChange={handleEmailChange}
        />
        <InputLabel>@ suwon.ac.kr</InputLabel>
        <Button onClick={handleEmailVerification}>메일 인증</Button>
      </EmailInputContainer>

      <Subtitle>학교 이메일로 발송된 인증번호를 입력해주세요.</Subtitle>
      <CodeInputContainer>
        <VerificationCodeInput
          type="text"
          placeholder="인증코드 입력"
          value={verificationCode}
          onChange={handleCodeChange}
        />
        <Button onClick={handleVerificationCodeCheck}>확인</Button>
      </CodeInputContainer>

      {showPasswordFields && (
        <>
          <Subtitle>새로운 비밀번호를 입력해주세요.</Subtitle>
          <PWInputContainer>
            <Input
              type="password"
              placeholder="새로운 비밀번호 입력"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </PWInputContainer>
        </>
      )}

      <Footer>
        <CompleteButton
          onClick={handlePasswordChange}
          enabled={isVerified && isPasswordMatch}
        >
          변경완료
        </CompleteButton>
      </Footer>
    </Container>
  );
};

export default FindPw;
