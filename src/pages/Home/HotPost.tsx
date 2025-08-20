import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const HotPostContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 1.5vh 3vw;
  border: 0.2vw solid red;
  border-radius: 2vw;
  margin: 2vh 0;
  transform: translateY(1vh);
  width: 80vw;
  cursor: pointer;
`;

const HotLabel = styled.div`
  color: red;
  font-weight: bold;
  font-size: 3vw;
  margin-right: 2vw;
`;

const HotTitle = styled.div`
  flex: 1;
  font-weight: normal;
  font-size: 3vw;
`;

const HotLikes = styled.div`
  display: flex;
  font-size: 3vw;
  align-items: center;
`;

const LikeIcon = styled.img`
  width: 3vw;
  height: auto;
  margin-right: 1vw;
`;

function HotPost({ hotPost }) {
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 핫 포스트 클릭 시 게시글로 이동
  const handleClick = () => {
    if (hotPost && hotPost.boardId) {
      navigate(`/post/${hotPost.boardId}`); // 해당 게시글로 이동
    }
  };

  if (!hotPost) return null; // 핫 포스트가 없으면 렌더링하지 않음

  return (
    <HotPostContainer onClick={handleClick}>
      {" "}
      {/* 핫 포스트 클릭 이벤트 */}
      <HotLabel>Now HOT!</HotLabel>
      <HotTitle>{hotPost.title}</HotTitle>
      <HotLikes>
        <LikeIcon src="/images/like_icon.png" alt="좋아요 아이콘" />
        <span>{hotPost.likeCount}</span>
      </HotLikes>
    </HotPostContainer>
  );
}

export default HotPost;
