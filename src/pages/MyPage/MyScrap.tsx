import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Styled Components
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

const BackButton = styled(Link)`
  position: absolute;
  left: 5vw;
  top: 1.5vh;
  background: none;
  border: none;
  text-decoration: none;

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
  color: white;
`;

const PostList = styled.div`
  margin-top: 7vh;
  width: 100%;
  padding: 0 1rem;
`;

const PostItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
`;

const ProfileIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #d3d3d3;
  margin-right: 10px;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const ContentText = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
`;

const Title = styled.p`
  font-weight: bold;
  margin: 0;
  color: #333;
`;

const Description = styled.p`
  margin: 0;
  color: #666;
`;

const TimeText = styled.p`
  font-size: 0.8rem;
  color: #999;
  white-space: nowrap;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  margin: 0 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
`;

const MoreOptions = styled.img`
  width: 1rem;
  height: auto;
  cursor: pointer;
`;

const NoscrapsMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #999;
  margin-top: 20vh;
`;

const Myscrap = () => {
  const [scraps, setscraps] = useState([]);

  useEffect(() => {
    const fetchscraps = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/v1/scrap/my`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 로컬 스토리지에서 토큰 가져오기
          },
        });
        const data = await response.json();
        if (data.is_success) {
          // payload가 null이거나 빈 배열인 경우 처리
          if (!data.payload || data.payload.length === 0) {
            setscraps([]); // 빈 배열로 설정
          } else {
            setscraps(data.payload); // API 응답 데이터를 상태에 저장
          }
        }
      } catch (error) {
        console.error("내가 스크랩한 게시물을 가져오는 중 오류 발생:", error);
      }
    };

    fetchscraps(); // 컴포넌트가 마운트될 때 API 요청
  }, []);

  return (
    <Container>
      <Header>
        <BackButton to="/mypage">
          <img src="/images/Back_icon.png" alt="Back" />
        </BackButton>
        <HeaderText>내가 스크랩한 글</HeaderText>
      </Header>
      <PostList>
        {scraps.length === 0 ? (
          <NoscrapsMessage>스크랩한 글이 없습니다.</NoscrapsMessage>
        ) : (
          scraps.map((scrap) => (
            <Link to={`/post/${scrap.boardId}`}>
              <PostItem key={scrap.boardId}>
                <ContentContainer>
                  <ProfileIcon
                    src="/images/default_profile.png"
                    alt="Profile"
                  />
                  <ContentText>
                    <Title>{scrap.title}</Title>

                    <Description>{scrap.content}</Description>
                  </ContentText>
                </ContentContainer>

                <ActionsContainer>
                  <TimeText>
                    {new Date(scrap.createdAt).toLocaleString()}
                  </TimeText>
                  <ActionButton>
                    <img src="/images/like_icon.png" alt="Likes" />{" "}
                    {scrap.likeCount}
                  </ActionButton>
                  <ActionButton>
                    <img src="/images/comment_icon.png" alt="Comments" />{" "}
                    {scrap.commentCount}
                  </ActionButton>
                  <MoreOptions src="/images/scrap_icon.png" alt="More" />
                </ActionsContainer>
              </PostItem>
            </Link>
          ))
        )}
      </PostList>
    </Container>
  );
};

export default Myscrap;
