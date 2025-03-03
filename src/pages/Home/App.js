import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import Tabs from "./Tabs";
import HotPost from "./HotPost";
import Post from "./Post";
import BottomNavigation from "./BottomNavigation";

const serverAPI = process.env.REACT_APP_SERVER_URL;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  margin-bottom: 7vh;
`;

const WriteButton = styled.img`
  position: fixed;
  right: 5vw;
  bottom: 26vw;
  cursor: pointer;
  z-index: 100;
`;

const PostsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 0px;
  overflow-y: auto;
  margin-top: 0px;
`;

const PostButton = styled.button`
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 8px;
  margin: 0;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

function Home() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("자유게시판");
  const [posts, setPosts] = useState([]);
  const [hotPost, setHotPost] = useState(null);
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 저장
  const [searchWord, setSearchWord] = useState(""); // 검색어 저장

  // 기본 게시글 불러오는 useEffect (검색어가 없을 때만 실행)
  useEffect(() => {
    if (!searchWord) {
      let category = "";

      switch (selectedTab) {
        case "자유게시판":
          category = "FREE";
          break;
        case "비밀게시판":
          category = "PRIVATE";
          break;
        case "중고장터":
          category = "MARKET";
          break;
        default:
          break;
      }

      const apiEndpoint = `${serverAPI}/api/v1/boards?page=0&size=30&category=${category}`;

      fetch(apiEndpoint, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.is_success) {
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            const recentPosts = data.payload.boardListResponses.filter(
              (post) => {
                const postDate = new Date(post.createdAt);
                return postDate >= oneDayAgo;
              }
            );

            const topHotPost = recentPosts.reduce((maxPost, currentPost) => {
              return currentPost.likeCount > (maxPost?.likeCount || 0)
                ? currentPost
                : maxPost;
            }, null);

            setPosts(data.payload.boardListResponses || []);
            setHotPost(topHotPost || null);
          } else {
            console.error("Failed to fetch posts:", data.message);
          }
        })
        .catch((error) => console.error("Failed to fetch posts:", error));
    }
  }, [selectedTab, searchWord]);

  // 검색어가 변경될 때마다 검색 API 호출
  useEffect(() => {
    if (searchWord) {
      const searchAPI = `${serverAPI}/api/v1/boards/search?category=FREE&page=0&size=30&keyword=${searchWord}`;

      fetch(searchAPI, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.is_success) {
            setSearchResults(data.payload || []);
          } else {
            console.error("Failed to fetch search results:", data.message);
          }
        })
        .catch((error) =>
          console.error("Failed to fetch search results:", error)
        );
    }
  }, [searchWord]); // searchWord가 변경될 때마다 검색 수행

  const goWritePage = () => {
    navigate("/writepage", { state: { selectedTab } });
  };

  return (
    <HomeContainer>
      <Header onSearch={setSearchWord} />{" "}
      {/* 검색어 입력 시 searchWord 상태 변경 */}
      <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {hotPost && <HotPost hotPost={hotPost} />}
      <WriteButton
        src="/images/writeButton.png"
        alt="글쓰기 버튼"
        onClick={goWritePage}
      />
      <PostsContainer>
        {searchWord ? ( // 검색어가 있을 때 검색 결과 표시
          searchResults.length > 0 ? (
            searchResults.map((post) => (
              <Link to={`/post/${post.boardId}`} key={post.boardId}>
                <PostButton>
                  <Post
                    author={post.userNickname}
                    time={post.createdAt}
                    title={post.title}
                    content={post.content}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                    scrapCount={post.scrapCount}
                  />
                </PostButton>
              </Link>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )
        ) : // 검색어가 없을 때 기본 게시글 표시
        posts.length > 0 ? (
          posts.map((post) => (
            <Link to={`/post/${post.boardId}`} key={post.boardId}>
              <PostButton>
                <Post
                  author={post.userNickname}
                  time={post.createdAt}
                  title={post.title}
                  content={post.content}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                  scrapCount={post.scrapCount}
                />
              </PostButton>
            </Link>
          ))
        ) : (
          <p>게시글이 없습니다! 첫 게시물을 만들어보세요!</p>
        )}
      </PostsContainer>
      <BottomNavigation />
    </HomeContainer>
  );
}

export default Home;
