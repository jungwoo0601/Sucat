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

const UsageRestrictionInfo = () => {
  return (
    <Container>
      <Header>
        <BackButton onClick={() => window.history.back()}>
          <img src="/images/Back_icon.png" alt="Back" />
        </BackButton>
        <HeaderText>이용제한 안내</HeaderText>
      </Header>
      <Content>
        <Title>커뮤니티 이용 제한 안내</Title>
        <Paragraph>
          본 커뮤니티는 모든 사용자가 안전하고 건전한 환경에서 활동할 수 있도록
          다양한 규칙을 적용하고 있습니다. 다음은 이용 제한이 발생할 수 있는
          주요 이유와 사례들입니다.
        </Paragraph>

        <Title>1. 부적절한 콘텐츠 게시</Title>
        <Paragraph>
          욕설, 비방, 인종차별, 성적 콘텐츠 등 다른 사용자에게 불쾌감을 줄 수
          있는 내용을 포함한 게시물은 즉시 삭제되며, 반복적인 게시 시 계정이
          일시 정지되거나 영구 정지될 수 있습니다.
        </Paragraph>

        <Title>2. 스팸 및 광고</Title>
        <Paragraph>
          상업적인 광고, 불필요한 스팸 게시물, 또는 홍보성 링크를 다수 게시하는
          행위는 허용되지 않으며, 발견 시 경고 없이 삭제될 수 있습니다.
        </Paragraph>

        <Title>3. 개인 정보 보호 위반</Title>
        <Paragraph>
          다른 사용자의 개인 정보를 무단으로 수집, 공유, 또는 공개하는 행위는
          엄격히 금지되며, 이에 따라 계정이 즉시 정지될 수 있습니다.
        </Paragraph>

        <Title>4. 기타 규칙 위반</Title>
        <Paragraph>
          본 커뮤니티의 기타 이용 약관이나 운영 정책을 위반하는 경우, 운영팀의
          판단에 따라 경고 조치나 이용 제한이 이루어질 수 있습니다.
        </Paragraph>

        <Paragraph>
          이용 제한에 대한 이의가 있거나 추가적인 문의가 필요하신 경우,
          [문의하기] 페이지를 통해 운영팀에 연락해주시기 바랍니다.
        </Paragraph>
      </Content>
    </Container>
  );
};

export default UsageRestrictionInfo;
