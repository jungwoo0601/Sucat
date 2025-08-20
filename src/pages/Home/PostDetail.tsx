import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// 스타일 정의
const Container = styled.div`
  max-width: 100vw;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  background-color: #003fe0;
  color: white;
  padding: 2vh;
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const BackIcon = styled.img`
  width: 2.5vw;
  height: auto;
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 4vw;
  margin: 0;
`;

const PostContent = styled.div`
  position: relative;
  padding: 4vh 4vw 2vh 4vw;
  border-bottom: 0.3rem solid #ccc;
  border-radius: 1rem;
`;

const PostOptionsButton = styled.img`
  position: absolute;
  top: 4.5vh;
  right: 6vw;
  width: 6vw;
  height: auto;
  cursor: pointer;
`;

const OptionsMenu = styled.div`
  position: absolute;
  top: 8vh;
  right: 5vw;
  left: 58vw;
  background-color: white;
  border: 0.1rem solid #ddd;
  border-radius: 1rem;
  box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  padding: 1rem 2rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const PostAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorPic = styled.div`
  width: 10vw;
  height: 10vw;
  background-color: #ccc;
  border-radius: 50%;
  margin-right: 3vw;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.p`
  margin: 0;
  font-size: 0.9rem;
  font-weight: bold;
`;

const PostDate = styled.p`
  margin: 0;
  margin-top: 0.5vh;
  font-size: 0.75rem;
  color: gray;
`;

const PostText = styled.div`
  margin-top: 1rem;
`;

const PostImages = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 2vh; /* 위쪽 여백을 vh로 설정 */
  gap: 2vw; /* 이미지 간격을 vw로 설정 */
  overflow-x: auto;
  padding-bottom: 1vh;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const PostImage = styled.img`
  width: 100vw; /* 이미지 너비 */
  height: 20vh; /* 이미지 높이 */
  border-radius: 2vw; /* 둥근 모서리 */
  object-fit: cover; /* 비율 유지 */
  box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.15); /* 그림자 효과 */
`;

const PostActions = styled.div`
  display: flex;
  justify-content: left;
  margin-top: 2vh;
  gap: 2vw;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ActionIcon = styled.img`
  width: 4vw;
  height: auto;
  margin-right: 1vw;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const CommentsSection = styled.div`
  padding: 2vh 4vw;
  flex-grow: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2vh;
  padding: 2vh;
  background-color: #f9f9f9;
  border-radius: 1rem;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const CommentText = styled.p`
  margin: 1vh 0 0 0;
`;

const CommentDate = styled.p`
  margin: 0;
  font-size: 1rem;
  color: gray;
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1vh;
`;

const CommentInputSection = styled.div`
  display: flex;
  padding: 2vh;
  background-color: white;
  border-top: 0.1rem solid #ccc;
  border-radius: 1rem 1rem 0 0;
`;

const CommentInput = styled.input`
  flex-grow: 1;
  padding: 1.5vh;
  border: 0.1rem solid #ccc;
  border-radius: 1rem;
  margin-right: 2vw;
`;

const CommentSubmit = styled.button`
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1.5vh 3vw;
  cursor: pointer;
`;

// Modal의 배경 오버레이 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.05); /* 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

// Modal의 내용 박스 스타일
const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1vh;
  text-align: center;
  box-shadow: 0 0.8vh 0.8vh rgba(0, 0, 0, 0.2);
  z-index: 11;
`;

// 삭제 확인 텍스트 스타일
const ModalText = styled.p`
  font-size: 1.3rem; /* 글자 크기 */
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

// 삭제 버튼 스타일
const ModalButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  border-radius: 0.5vh;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

// 취소 버튼 스타일
const CancelButton = styled(ModalButton)`
  background-color: #888;
  &:hover {
    background-color: #555;
  }
`;

// PostDetail 컴포넌트 정의
function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [isScrapedByUser, setIsScrapedByUser] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // Fetch한 데이터를 처리할 때 기본값 설정
  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = () => {
    fetch(`${BASE_URL}/api/v1/boards/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.is_success) {
          const postData = {
            ...data.payload,
            scrapCount: data.payload.scrapCount ?? 0,
            commentCount: data.payload.commentCount ?? 0,
            likeCount: data.payload.likeCount ?? 0,

            commentList: data.payload.commentList.map((comment) => ({
              ...comment,
              id: comment.commentId, // commentId를 id로 매핑
            })),
          };
          setPost(postData);
          const currentUserId = localStorage.getItem("userId");
          setIsAuthor(data.payload.userId === currentUserId);
          setIsLikedByUser(data.payload.isLikedByUser);
          setImageUrl(data.payload.imageUrls);

          // 로컬 스토리지에서 스크랩 상태 가져오기
          const scrapStatus = JSON.parse(
            localStorage.getItem(`scrap_${postId}`)
          );
          setIsScrapedByUser(
            scrapStatus !== null ? scrapStatus : data.payload.isScrapedByUser
          );
        } else {
          console.error("Failed to fetch post details:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching post details:", error));
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      console.error("삭제할 댓글 ID가 유효하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await response.json();

      if (response.status === 403) {
        alert("댓글 작성자가 아닙니다. 삭제 권한이 없습니다.");
      } else if (result.is_success) {
        alert("댓글이 성공적으로 삭제되었습니다.");
        fetchPostDetail();
      } else {
        alert("댓글 삭제에 실패했습니다: " + result.message);
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleMenuClick = (option) => {
    // ... (same as before)
  };

  const handleLike = () => {
    fetch(`${BASE_URL}/api/v1/boards/like/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.is_success) {
          setIsLikedByUser(!isLikedByUser);
          fetchPostDetail(); // Fetch updated post details
        }
      })
      .catch((error) => console.error("Error handling like:", error));
  };

  const handleScrap = () => {
    fetch(`${BASE_URL}/api/v1/scrap/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.is_success) {
          const newScrapStatus = !isScrapedByUser;
          setIsScrapedByUser(newScrapStatus);

          // 새로운 스크랩 상태를 localStorage에 저장
          localStorage.setItem(
            `scrap_${postId}`,
            JSON.stringify(newScrapStatus)
          );

          // 스크랩 수를 업데이트
          setPost((prevPost) => ({
            ...prevPost,
            scrapCount: newScrapStatus
              ? prevPost.scrapCount + 1
              : prevPost.scrapCount - 1,
          }));
        }
      })
      .catch((error) => console.error("Error handling scrap:", error));
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return;
    fetch(`${BASE_URL}/api/v1/comments/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newComment }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.is_success) {
          setNewComment("");
          fetchPostDetail();
        }
      })
      .catch((error) => console.error("Error submitting comment:", error));
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  // 게시글 수정 페이지로 이동하는 함수
  const MoveToReWrite = (boardId) => {
    navigate("/rewrite", { state: { postId: boardId } }); // 게시글 수정 페이지로 이동하며 postId 상태 전달
  };

  // 게시글 삭제 함수
  const remove = async (boardId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const result = await response.json();
        if (result.is_success) {
          alert("게시글이 성공적으로 삭제되었습니다.");
          navigate("/home");
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
        <BackButton onClick={() => navigate(-1)}>
          <BackIcon src="/images/Back_icon.png" alt="Back" />
        </BackButton>
        <Title>게시판</Title>
        <div style={{ width: "1.5rem" }}></div>
      </Header>
      <ContentWrapper>
        <PostContent>
          <PostOptionsButton
            src="/images/Chat/List.png"
            alt="Options"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {isMenuOpen && (
            <OptionsMenu>
              <MenuItem onClick={() => handleMenuClick("message")}>
                친구 신청하기
              </MenuItem>
              <MenuItem onClick={() => MoveToReWrite(post.boardId)}>
                수정하기
              </MenuItem>
              <MenuItem onClick={() => remove(post.boardId)}>삭제하기</MenuItem>
            </OptionsMenu>
          )}

          <PostAuthor>
            <AuthorPic
              src={
                post.userProfileImageName
                  ? `${BASE_URL}/images/${post.userProfileImageName}`
                  : null
              }
            />
            <AuthorInfo>
              <AuthorName>{post.userNickname}</AuthorName>
              <PostDate>{post.createdAt}</PostDate>
            </AuthorInfo>
          </PostAuthor>
          <PostText>
            <h4 style={{ marginBottom: "0px" }}>{post.title}</h4>
            <p style={{ marginTop: "1vh", marginBottom: "1vh" }}>
              {post.content}
            </p>
          </PostText>
          {imageUrl && imageUrl.length > 0 && (
            <PostImages>
              {imageUrl.map((imageUrl, index) => (
                <PostImage key={index} src={imageUrl} />
              ))}
            </PostImages>
          )}
          <PostActions>
            <ActionButton active={isLikedByUser} onClick={handleLike}>
              <ActionIcon
                src={
                  isLikedByUser
                    ? "/images/FillLike.png"
                    : "/images/like_icon.png"
                }
                alt="좋아요"
              />
              <span style={{ color: "#000" }}>{post?.likeCount ?? 0}</span>{" "}
            </ActionButton>
            <ActionButton>
              <ActionIcon src="/images/comment_icon.png" alt="댓글" />
              {post?.commentCount ?? 0}
            </ActionButton>
            <ActionButton onClick={handleScrap}>
              <ActionIcon
                src={
                  isScrapedByUser
                    ? "/images/Fillscrap.png"
                    : "/images/scrap_icon.png"
                }
                alt="스크랩"
              />
              {post?.scrapCount ?? 0}
            </ActionButton>
          </PostActions>
        </PostContent>
        <CommentsSection>
          {post.commentList.map((comment, index) => {
            console.log("댓글 ID:", comment.id);
            return (
              <Comment key={index}>
                <CommentAuthor>
                  <AuthorPic
                    src={
                      comment.userProfileImageName
                        ? `${BASE_URL}/images/${comment.userProfileImageName}`
                        : null
                    }
                  />
                  <div>
                    <AuthorName>{comment.userNickname}</AuthorName>
                    <CommentDate>{comment.createdAt}</CommentDate>
                  </div>
                </CommentAuthor>
                <CommentText>{comment.content}</CommentText>
                <CommentActions>
                  <ActionButton
                    onClick={() => setIsDeleteModalOpen(comment.commentId)}
                  >
                    삭제
                  </ActionButton>

                  {/* 해당 댓글의 삭제 모달만 열림 */}
                  {isDeleteModalOpen === comment.id && (
                    <ModalOverlay>
                      <ModalContent>
                        <ModalText>정말로 삭제하시겠습니까?</ModalText>
                        <div>
                          <ModalButton
                            onClick={() => {
                              handleDeleteComment(comment.commentId); // 수정된 ID 필드
                              setIsDeleteModalOpen(false); // 모달 닫기
                            }}
                          >
                            삭제
                          </ModalButton>
                          <CancelButton
                            onClick={() => setIsDeleteModalOpen(false)}
                          >
                            취소
                          </CancelButton>
                        </div>
                      </ModalContent>
                    </ModalOverlay>
                  )}
                </CommentActions>
              </Comment>
            );
          })}
        </CommentsSection>
      </ContentWrapper>
      <CommentInputSection>
        <CommentInput
          type="text"
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <CommentSubmit onClick={handleCommentSubmit}>전송</CommentSubmit>
      </CommentInputSection>
    </Container>
  );
}

export default PostDetail;
