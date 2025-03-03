import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { RiPencilFill } from "react-icons/ri";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// 스타일 컴포넌트 정의
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: auto;
  padding-top: 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #003fe0;
  color: white;
  width: 100%;
  padding: 0.5vh 0;
  z-index: 100;
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

const Content = styled.div`
  margin: 15px;
`;

const EnterInfoText = styled.h2`
  font-size: 2.1vh;
  font-weight: 900;
  color: #003fe0;
  position: relative;
  top: 10%;
  padding-top: 10%;

  @media (max-width: 1023px) {
    font-size: 1.8vh;
  }

  @media (max-width: 767px) {
    font-size: 1.5vh;
  }
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const SchoolName = styled.div`
  background-color: #d9d9d9;
  text-align: center;
  border-radius: 10px;
  padding: 7px;
  width: 100%;
  font-weight: 500;
  font-size: 1.3vh;
`;

const EnterEmail = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  label {
    margin-bottom: 5px;
  }

  .email-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  input[type="text"] {
    padding: 6px;
    margin-right: 10px;
    width: 40%;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  .verification-button {
    padding: 0.8vh;
    border: none;
    border-radius: 5px;
    background-color: #d9d9d9;
    cursor: pointer;
    font-size: 1.4vh;
    width: 28.5%;
    position: relative;
    left: 0.8vh;
  }

  .verification-code-container {
    display: flex;
    align-items: center;
    width: 95%;
  }

  .verification-code-input {
    flex: 1;
    padding: 5px;
    margin-right: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 80%;
  }

  .verify-button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #d9d9d9;
    cursor: pointer;
    width: 30%;
    position: relative;
    left: 1.9vh;
  }
`;

const PasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  label {
    margin-bottom: 5px;
  }

  .widthContainer {
    display: flex;
    width: 100%;
  }

  input {
    padding: 10px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 100%;
    background-color: #f2f2f2;
    font-size: 1.3vh;
  }
`;

const EmailAuto = styled.div`
  white-space: nowrap;
  font-size: 1.5vh;
  position: relative;
  left: -5px;
`;

const SetPhoto = styled.div`
  text-align: center;
  margin-top: 20px;

  p {
    margin-top: 2vh;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const FormGroup = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  flex: display;
  font-size: 10px;

  input {
    padding: 5px;
    border-radius: 5px;
  }
`;

const Label = styled.label`
  display: flex;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1.4vh;

  span {
    color: blue;
  }
`;

const PhotoBox = styled.div`
  position: relative;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 18vh; /* 가로 세로 동일한 크기로 설정 */
  height: 18vh;
  left: 50%;
  transform: translate(-50%);
  border-radius: 15px;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 3vh;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
  }

  .icon {
    width: 40%;
    height: 40%;
  }
`;

const EnterName = styled.div`
  display: flex;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
`;

const StyledButton = styled.button`
  border: none;
  font-size: 2.7vh;
  width: 100%;
  background-color: ${(props) => (props.disabled ? "#d3d3d3" : "#3f51b5")};
  color: white;
  text-decoration: none;
  text-align: center;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  transition: background-color 0.3s;
  position: absolute;
  left: 0%;

  &:disabled {
    background-color: #d3d3d3;
    border-color: #d3d3d3;
    color: #9e9e9e;
  }

  @media (max-width: 1023px) {
    font-size: 2.5vh;
    padding: 2vh 0;
  }

  @media (max-width: 767px) {
    font-size: 2vh;
    padding: 1.8vh 0;
  }
`;

// Joinpage2 컴포넌트 정의
function Joinpage2() {
  const [email, setEmail] = useState(""); // 이메일 입력란
  const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증
  const [verificationCodeInput, setVerificationCodeInput] = useState(""); // 사용자가 입력한 인증번호
  const [password, setPassword] = useState(""); // 비번 입력
  const [passwordConfirm, setPasswordConfirm] = useState(""); // 비번 확인 입력
  const [name, setName] = useState(""); // 이름 입력
  const [nickname, setNickname] = useState(""); // 닉네임 입력
  const [dupliCheck, setDupliCheck] = useState(false); // 닉네임 중복 확인
  const [major, setMajor] = useState(""); // 학과 상태 추가
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 추가
  const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지
  const [allChecked, setAllChecked] = useState(false); // 버튼 활성화 시키는 조건
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (
      emailVerified &&
      password === passwordConfirm &&
      password.length >= 6 &&
      name.trim() !== "" &&
      nickname.trim() !== "" &&
      dupliCheck && // 닉네임 중복 확인이 완료되어야 함
      major !== ""
    ) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [
    emailVerified,
    password,
    passwordConfirm,
    name,
    nickname,
    dupliCheck, // 닉네임 중복 확인을 조건에 포함
    major,
  ]);

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
            body: JSON.stringify({
              email: fullEmail,
            }),
          }
        );

        const data = await response.json();

        if (data.is_success) {
          alert("인증번호가 발송되었습니다.");
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

    if (verificationCodeInput.trim() === "") {
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
            code: verificationCodeInput.trim(),
          }),
        });

        const data = await response.json();

        if (data.is_success) {
          setEmailVerified(true);
          alert("이메일 인증이 완료되었습니다.");
        } else {
          alert(`인증 실패: ${data.message}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("이메일 인증 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleNicknameCheck = async () => {
    if (nickname.trim() === "") {
      alert("닉네임을 입력해주세요");
      return;
    }
    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/users/nickname/duplication?nickname=${encodeURIComponent(
          nickname
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.is_success) {
        alert("닉네임 사용 가능");
        setDupliCheck(true);
      } else {
        alert("이미 존재하는 닉네임입니다");
        setDupliCheck(false);
      }
    } catch (error) {
      console.error("닉네임 확인 중 오류 발생:", error);
      alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file); // 원본 파일을 상태에 저장
      setPreviewImage(URL.createObjectURL(file)); // 미리보기 이미지를 설정
    }
  };

  const handleSignup = async () => {
    const formData = new FormData();

    // JSON 데이터를 문자열로 변환하여 'request' 키에 추가
    const jsonData = JSON.stringify({
      email: `${email.trim()}@suwon.ac.kr`, // 사용자가 입력한 이메일
      password: password, // 사용자가 입력한 비밀번호
      name: name, // 사용자가 입력한 이름
      nickname: nickname, // 사용자가 입력한 닉네임
      department: major, // 사용자가 선택한 학과
    });

    // 프로필 이미지 추가
    if (profileImage) {
      formData.append("profileImage", profileImage); // 원본 파일을 FormData에 추가
    }

    // JSON 데이터를 FormData에 추가
    formData.append(
      "request",
      new Blob([jsonData], { type: "application/json" })
    );

    try {
      const response = await fetch(`${SERVER_URL}/api/v1/users/signup`, {
        method: "POST",
        body: formData, // multipart/form-data으로 전송됩니다.
      });

      const data = await response.json();
      console.log(data);

      if (data.is_success) {
        alert("회원가입이 완료되었습니다.");
        navigate("/"); // 회원가입이 성공하면 로그인 페이지로 이동
      } else if (data.errors) {
        // 서버에서 받은 오류 메시지를 처리
        const errorMessages = data.errors.map(
          (error) => `${error.field}: ${error.reason}`
        );
        alert(`회원가입 실패:\n${errorMessages.join("\n")}`);
      } else {
        alert(`회원가입 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <Header>
        <BackButton to="/Joinpage">
          <img src="./images/Back_icon.png" alt="back" />
        </BackButton>
        <HeaderText>회원가입</HeaderText>
      </Header>
      <Container>
        <Content>
          <EnterInfoText>로그인 정보를 입력해주세요.</EnterInfoText>
          <FormGroup>
            <Label>
              학교명 <span>*</span>
            </Label>
            <CenterContainer>
              <SchoolName>수원대학교</SchoolName>
            </CenterContainer>
          </FormGroup>
          <FormGroup>
            <Label>
              수원대 전자메일 주소(ID) <span>*</span>
            </Label>
            <EnterEmail>
              <div className="email-container">
                <input
                  type="text"
                  placeholder="Example : xxxxx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={emailVerified} // 이메일 인증 성공 시 입력 필드 비활성화
                />
                <EmailAuto>@ suwon.ac.kr</EmailAuto>
                <button
                  className="verification-button"
                  onClick={handleEmailVerification}
                >
                  인증번호 받기
                </button>
              </div>
              <div className="verification-code-container">
                <input
                  className="verification-code-input"
                  type="text"
                  placeholder="인증번호를 입력해주세요"
                  value={verificationCodeInput}
                  onChange={(e) => setVerificationCodeInput(e.target.value)}
                />
                <button
                  className="verify-button"
                  onClick={handleVerificationCodeCheck}
                >
                  확인
                </button>
              </div>
            </EnterEmail>
          </FormGroup>
          <FormGroup>
            <Label>
              비밀번호 <span>*</span>
            </Label>
            <PasswordContainer>
              <div className="widthContainer">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="widthContainer">
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
            </PasswordContainer>
          </FormGroup>

          <SetPhoto>
            <PhotoBox>
              {previewImage ? (
                <img src={previewImage} alt="프로필 미리보기" />
              ) : (
                <img
                  src="./images/Camera_icon.png"
                  alt="Camera"
                  className="icon"
                />
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </PhotoBox>
            <p onClick={handlePhotoClick}>
              프로필 사진(옵션)
              <RiPencilFill />
            </p>
          </SetPhoto>

          <FormGroup>
            <Label>
              본인 이름 <span>*</span>
            </Label>
            <EnterName>
              <input
                style={{ width: "100%" }}
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </EnterName>
          </FormGroup>
          <FormGroup>
            <Label>
              닉네임 <span>*</span>
            </Label>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                placeholder="10글자 제한"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={{ flex: 1, marginRight: "5px" }}
              />
              <button
                onClick={handleNicknameCheck}
                style={{ borderRadius: "1vh" }}
              >
                중복 확인
              </button>
            </div>
          </FormGroup>

          <FormGroup>
            <Label>
              학과 선택 <span>*</span>
            </Label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            >
              <option value="">학과를 선택하세요</option>
              <option value="인문학부">인문학부</option>
              <option value="외국어학부">외국어학부</option>
              <option value="법행정학부">법행정학부</option>
              <option value="미디어커뮤니케이션학과">
                미디어커뮤니케이션학과
              </option>
              <option value="소방행정학과_야간">소방행정학과_야간</option>
              <option value="경제학부">경제학부</option>
              <option value="경영학부">경영학부</option>
              <option value="호텔관광학부">호텔관광학부</option>
              <option value="바이오화학산업학부">바이오화학산업학부</option>
              <option value="건설환경에너지공학부">건설환경에너지공학부</option>
              <option value="건축도시부동산학부">건축도시부동산학부</option>
              <option value="산업및기계공학부">산업및기계공학부</option>
              <option value="반도체공학과">반도체공학과</option>
              <option value="전기전자공학부">전기전자공학부</option>
              <option value="화학공학_신소재공학부">
                화학공학_신소재공학부
              </option>
              <option value="데이터과학부">데이터과학부</option>
              <option value="컴퓨터학부">컴퓨터학부</option>
              <option value="정보통신학부">정보통신학부</option>
              <option value="간호학과">간호학과</option>
              <option value="아동가족복지학과">아동가족복지학과</option>
              <option value="의류학과">의류학과</option>
              <option value="식품영양학과">식품영양학과</option>
              <option value="스포츠과학부">스포츠과학부</option>
              <option value="조형예술학부">조형예술학부</option>
              <option value="디자인학부">디자인학부</option>
              <option value="아트앤테크놀로지작곡과">
                아트앤테크놀로지작곡과
              </option>
              <option value="성악과">성악과</option>
              <option value="피아노과">피아노과</option>
              <option value="관현악과">관현악과</option>
              <option value="국악과">국악과</option>
              <option value="아트앤엔터테인먼트학부">
                아트앤엔터테인먼트학부
              </option>
              <option value="자유전공학부">자유전공학부</option>
            </select>

            <p style={{ color: "red", fontSize: "1vh" }}>
              * 학과는 가입한 후 변경할 수 없습니다.
            </p>
          </FormGroup>
        </Content>
      </Container>
      <ButtonContainer>
        <StyledButton primary disabled={!allChecked} onClick={handleSignup}>
          회원가입 완료
        </StyledButton>
      </ButtonContainer>
    </div>
  );
}

export default Joinpage2;
