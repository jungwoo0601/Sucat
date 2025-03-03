import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// Styled Components (이전과 동일)
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
  color: black;
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
  margin-left: 0.5vh;
`;

const Title = styled.p`
  font-weight: bold;
  margin: 0;
  color: #333;
  position: relative;
  top: 1.6vh;
`;

const Description = styled.p`
  margin: 0;
  color: #666;
  position: relative;
  top: 2vh;
`;

const TimeText = styled.p`
  font-size: 0.7rem;
  color: #999;
  white-space: nowrap;
  position: relative;
  top: 2vh;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  width: 40vh;
  height: auto;
`;

const StyledButton = styled.button`
  background: none;
  border: 0.1vh solid #003fe0;
  padding: 0.3vh;
  border-radius: 0.8vh;
  width: 5vh;
  height: 3.5vh;
  cursor: pointer;
  margin-right: 1vh;
  position: relative;
  right: 1vh;
  top: 3.2vh;
  font-size: 0.9rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  margin: -0.1vh;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
  position: relative;
  left: 10.5vh;
  top: -1vh;
`;

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/v1/boards/my`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 토큰을 로컬스토리지에서 가져옴
          },
        });
        const data = await response.json();
        if (data.is_success) {
          // 데이터를 최신 날짜 기준으로 내림차순 정렬
          const sortedPosts = data.payload.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPosts(sortedPosts);
        }
      } catch (error) {
        console.error("내가 작성한 게시물을 가져오는 중 오류 발생:", error);
      }
    };

    fetchMyPosts(); // 컴포넌트가 마운트될 때 데이터를 가져옴
  }, []);

  // 게시글 상세 페이지로 이동하는 함수
  const goToPostDetail = (boardId) => {
    navigate(`/post/${boardId}`); // 게시글 상세 페이지로 이동
  };

  // 게시글 수정 페이지로 이동하는 함수
  const MoveToReWrite = (boardId) => {
    navigate("/rewrite", { state: { postId: boardId } }); // 게시글 수정 페이지로 이동하며 postId 상태 전달
  };

  // 게시글 삭제 함수
  const remove = async (boardId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`${SERVER_URL}/api/v1/boards/${boardId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const result = await response.json();
        if (result.is_success) {
          alert("게시글이 성공적으로 삭제되었습니다.");
          // 게시글 삭제 후 화면에서 제거
          setPosts(posts.filter((post) => post.boardId !== boardId));
        } else {
          alert("게시글 삭제에 실패했습니다: " + result.message);
        }
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Container>
      <Header>
        <BackButton to="/mypage">
          <img src="/images/Back_icon.png" alt="Back" />
        </BackButton>
        <HeaderText>내가 쓴 글</HeaderText>
      </Header>
      <PostList>
        {posts.map((post) => (
          <PostItem key={post.boardId}>
            <ContentContainer onClick={() => goToPostDetail(post.boardId)}>
              <ProfileIcon src="/images/default_profile.png" alt="Profile" />
              <ContentText>
                <Title>{post.title}</Title>
                <Description>{post.content}</Description>
                <TimeText>
                  {new Date(post.createdAt).toLocaleString()}{" "}
                </TimeText>
              </ContentText>
            </ContentContainer>
            <ActionsContainer>
              <ActionButton>
                <img src="/images/like_icon.png" alt="Likes" /> {post.likeCount}
              </ActionButton>
              <ActionButton>
                <img src="/images/comment_icon.png" alt="Comments" />
                {post.commentCount}
              </ActionButton>
              <ActionButton>
                <img src="/images/scrap_icon.png" alt="Scrap" />
                {post.scrapCount}
              </ActionButton>
              <StyledButton button onClick={() => MoveToReWrite(post.boardId)}>
                수정
              </StyledButton>
              <StyledButton onClick={() => remove(post.boardId)}>
                삭제
              </StyledButton>
            </ActionsContainer>
          </PostItem>
        ))}
      </PostList>
    </Container>
  );
};

export default MyPost;
