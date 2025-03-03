import React from "react";
import styled from "styled-components";

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

const LicenseItem = styled.div`
  margin-bottom: 1.5rem;
`;

const LicenseTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const LicenseText = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const OpenSourceLicenses = () => {
  return (
    <Container>
      <Header>
        <BackButton onClick={() => window.history.back()}>
          <img src="/images/Back_icon.png" alt="Back" />
        </BackButton>
        <HeaderText>오픈소스 라이센스</HeaderText>
      </Header>
      <Content>
        <Title>사용된 오픈소스 라이브러리</Title>

        <LicenseItem>
          <LicenseTitle>1. React</LicenseTitle>
          <LicenseText>
            - License: MIT
            <br />- Repository:{" "}
            <a
              href="https://github.com/facebook/react"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/facebook/react
            </a>
          </LicenseText>
        </LicenseItem>

        <LicenseItem>
          <LicenseTitle>2. Styled-components</LicenseTitle>
          <LicenseText>
            - License: MIT
            <br />- Repository:{" "}
            <a
              href="https://github.com/styled-components/styled-components"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/styled-components/styled-components
            </a>
          </LicenseText>
        </LicenseItem>

        <LicenseItem>
          <LicenseTitle>3. React Router</LicenseTitle>
          <LicenseText>
            - License: MIT
            <br />- Repository:{" "}
            <a
              href="https://github.com/remix-run/react-router"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/remix-run/react-router
            </a>
          </LicenseText>
        </LicenseItem>

        {/* 필요에 따라 추가적인 오픈소스 라이브러리를 여기에 추가할 수 있습니다. */}
      </Content>
    </Container>
  );
};

export default OpenSourceLicenses;
