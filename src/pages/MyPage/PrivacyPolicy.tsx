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

const PrivacyPolicy = () => {
  return (
    <Container>
      <Header>
        <BackButton onClick={() => window.history.back()}>
          <img src="/images/Back_icon.png" alt="Back" />
        </BackButton>
        <HeaderText>개인정보처리방침</HeaderText>
      </Header>
      <Content>
        <Title>제 1 조 (개인정보의 처리 목적)</Title>
        <Paragraph>
          본 서비스는 회원가입, 상담, 서비스 제공을 위한 개인정보를 수집합니다.
          귀하의 개인정보는 서비스 제공 이외의 목적으로 사용되지 않습니다.
        </Paragraph>
        <Title>제 2 조 (개인정보의 처리 및 보유 기간)</Title>
        <Paragraph>
          수집된 개인정보는 서비스 제공 기간 동안 보유되며, 법령에 따른
          보존기간이 경과한 후에는 안전하게 파기됩니다.
        </Paragraph>
        <Title>제 3 조 (개인정보의 제3자 제공)</Title>
        <Paragraph>
          회사는 귀하의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만
          법령의 규정에 의한 경우에는 예외로 합니다.
        </Paragraph>
        <Title>제 4 조 (개인정보 처리의 위탁)</Title>
        <Paragraph>
          회사는 서비스 제공을 위해 개인정보 처리를 타인에게 위탁할 수 있으며,
          이 경우 사전에 귀하에게 고지하고 동의를 받습니다.
        </Paragraph>
        <Title>제 5 조 (정보주체와 법정대리인의 권리·의무 및 행사방법)</Title>
        <Paragraph>
          귀하는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 삭제를
          요청할 수 있습니다. 이를 위해 고객센터로 문의해 주시기 바랍니다.
        </Paragraph>
        <Title>제 6 조 (개인정보의 안전성 확보 조치)</Title>
        <Paragraph>
          회사는 귀하의 개인정보 보호를 위해 관리적, 기술적, 물리적 안전성 확보
          조치를 취하고 있습니다.
        </Paragraph>
      </Content>
    </Container>
  );
};

export default PrivacyPolicy;
