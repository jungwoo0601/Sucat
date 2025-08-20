import React from "react";
import styled from "styled-components";

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
  justify-content: center;
  background-color: #003fe0;
  color: white;
  width: 100%;
  padding: 1.1vh 0;
  position: fixed;
  top: 0;
  border-bottom: 1px solid #ddd;
  z-index: 10;
`;

const BackButton = styled.button`
  position: absolute;
  left: 5vw;
  top: 1.5vh;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  img {
    width: 0.8rem;
    height: auto;
  }
`;

const HeaderText = styled.h1`
  margin: 0;
  font-size: 1.2rem;
  text-align: center;
  font-weight: bold;
`;

const Content = styled.div`
  margin-top: 7vh;
  padding: 2rem 1rem;
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const TermsOfService = () => {
  return (
    <Container>
      <Header>
        <BackButton onClick={() => window.history.back()}>
          <img src="/images/Back_icon.png" alt="Back" />
        </BackButton>
        <HeaderText>서비스 약관</HeaderText>
      </Header>
      <Content>
        <Title>제 1 조 (목적)</Title>
        <Paragraph>
          본 약관은 귀하가 본 사이트와 서비스(이하 “서비스”)를 이용함에 있어,
          사이트와 귀하의 권리 및 의무를 규정함을 목적으로 합니다.
        </Paragraph>
        <Title>제 2 조 (이용 조건)</Title>
        <Paragraph>
          귀하는 본 약관에 동의함으로써 서비스의 이용 자격을 얻습니다. 서비스는
          성인 사용자만 이용할 수 있습니다.
        </Paragraph>
        <Title>제 3 조 (개인정보의 보호)</Title>
        <Paragraph>
          회사는 귀하의 개인정보를 소중히 다루며, 서비스 제공을 위한 최소한의
          정보를 수집하고 보호하기 위해 최선을 다합니다.
        </Paragraph>
        <Title>제 4 조 (서비스 이용 제한)</Title>
        <Paragraph>
          귀하는 서비스를 불법적이거나 부적절한 목적으로 사용해서는 안 됩니다.
          서비스 이용이 제한될 수 있으며, 이용자의 부정 행위가 발견될 경우 법적
          조치를 취할 수 있습니다.
        </Paragraph>
        <Title>제 5 조 (서비스 약관의 변경)</Title>
        <Paragraph>
          회사는 필요에 따라 본 약관을 수정할 수 있습니다. 약관 변경 시, 서비스
          페이지를 통해 공지하며, 변경된 약관은 공지 후 7일 이내에 적용됩니다.
        </Paragraph>
      </Content>
    </Container>
  );
};

export default TermsOfService;
