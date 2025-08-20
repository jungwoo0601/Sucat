import React, { useEffect, useState } from "react";
import styled from "styled-components";

const PostContainer = styled.div`
  border-bottom: 0.1rem solid #ddd;
  padding: 0.3rem 0;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateX(0.5rem);
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileIcon = styled.img`
  width: 30px;
  height: auto;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const PostTime = styled.div`
  color: gray;
  font-size: 0.75rem;
`;

const PostIcons = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  margin-right: 0.6rem;
  transform: translate(-10px, 57px);
`;

const PostIcon = styled.img`
  width: 0.8rem;
  height: auto;
  margin-left: 1rem;
  transform: translate(-2px);
`;

const PostBody = styled.div`
  padding: 0.7rem 0; // padding을 축소
  transform: translateX(2%);
`;

const PostTitle = styled.span`
  font-weight: bold;
  font-size: 1rem;
`;

const PostContent = styled.div`
  color: gray;
  font-size: 0.875rem;
`;

function Post({
  author,
  time,
  title,
  content,
  likeCount,
  commentCount,
  scrapCount,
  postId,
}) {
  const [isScrapedByUser, setIsScrapedByUser] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 스크랩 상태 가져오기
    const savedScrapStatus = localStorage.getItem(`scrap_${postId}`);
    if (savedScrapStatus) {
      setIsScrapedByUser(JSON.parse(savedScrapStatus));
    }
  }, [postId]);

  return (
    <PostContainer>
      <PostHeader>
        <AuthorInfo>
          <ProfileIcon src="/images/profile_icon.png" alt="프로필" />
          <div>
            <div>{author}</div>
            <PostTime>{time}</PostTime>
          </div>
        </AuthorInfo>
        <PostIcons>
          <PostIcon src="/images/like_icon.png" alt="좋아요" />
          <span>{likeCount}</span>
          <PostIcon src="/images/comment_icon.png" alt="댓글" />
          <span>{commentCount}</span>
          <PostIcon
            src={
              isScrapedByUser
                ? "/images/Fillscrap.png" // 스크랩된 경우
                : "/images/scrap_icon.png"
            }
            alt="스크랩"
          />
          <span>{scrapCount}</span>
        </PostIcons>
      </PostHeader>
      <PostBody>
        <PostTitle>{title}</PostTitle>
        <PostContent>{content}</PostContent>
      </PostBody>
    </PostContainer>
  );
}

export default Post;
