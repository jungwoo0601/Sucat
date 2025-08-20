import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  height: 100vh;
  background-color: white;
  padding: 15px 20px; /* 좌우 패딩만 적용 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: "Arial, sans-serif";
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* Margin을 줄여 균형 맞추기 */
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const PostButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 5px;
  border: none;
  border-bottom: 1px solid #ccc;
  flex-grow: 1;
`;

const IconButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 5px 10px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: none;
  margin-bottom: 10px;
  resize: none;
  flex-grow: 1;
  height: 200px; /* 적절한 높이 설정 */
`;

const CarouselContainer = styled.div`
  margin-top: auto; /* 화면 하단으로 밀어내기 위해 사용 */
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 10px;
`;

const Carousel = styled.div`
  display: flex;
  overflow-x: scroll;
  gap: 10px;
`;

const ImagePreview = styled.img`
  height: 100px;
  width: auto;
  border-radius: 10px;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
  border-top: none;
  width: 100%;
`;

const TabButton = styled.button`
  flex: 1; /* 버튼이 동일한 너비를 가지게 함 */
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  padding: 10px;
  text-align: center; /* 텍스트 가운데 정렬 */
  position: relative;

  &.selected::after {
    content: "";
    display: block;
    width: 80%;
    height: 4px;
    background-color: black;
    position: absolute;
    bottom: 0;
    left: 10%;
  }

  &:not(:last-child) {
    border-right: 1.5px solid #ddd; /* 버튼 사이의 구분선 */
  }
`;

const WritePage = () => {
  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // 라우터에서 전달된 state를 가져옵니다.
  const [selected, setSelected] = useState(
    location.state?.selectedTab || "자유게시판"
  );
  const [isPosting, setIsPosting] = useState(false);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prevImages) =>
      [...prevImages, ...imageUrls].slice(0, 6)
    );
  };

  const handlePostClick = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    const formData = new FormData();

    let category = "FREE";
    if (selected === "비밀게시판") category = "PRIVATE";
    else if (selected === "중고장터") category = "MARKET";

    const jsonData = JSON.stringify({
      title,
      content,
      category,
    });
    formData.append(
      "request",
      new Blob([jsonData], { type: "application/json" })
    );

    const fileInputs = fileInputRef.current.files;
    if (fileInputs.length > 0) {
      for (let i = 0; i < fileInputs.length; i++) {
        formData.append("images", fileInputs[i]); // 이미지 파일을 FormData에 추가
      }
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`${SERVER_URL}/api/v1/boards`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.is_success) {
        alert("성공적으로 업로드 되었습니다");
        navigate(-1);
      } else {
        alert("업로드에 실패했습니다: " + result.message);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  const goback = () => {
    navigate(-1);
  };

  function Tabs() {
    return (
      <TabsContainer>
        {["자유게시판", "비밀게시판", "중고장터"].map((tab) => (
          <TabButton
            key={tab}
            className={selected === tab ? "selected" : ""}
            onClick={() => setSelected(tab)}
          >
            {tab}
          </TabButton>
        ))}
      </TabsContainer>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={goback}>◀︎ 글 쓰기</BackButton>
        <PostButton type="button" onClick={handlePostClick}>
          게시하기
        </PostButton>
      </Header>
      <Tabs />
      <Form>
        <InputGroup>
          <Input
            type="text"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <IconButton type="button" onClick={handleIconClick}>
            +📷
          </IconButton>
          <HiddenFileInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />
        </InputGroup>
        <TextArea
          rows="5"
          placeholder="여기에 글을 써주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></TextArea>
      </Form>
      <CarouselContainer>
        <Carousel>
          {selectedImages.map((image, index) => (
            <ImagePreview
              key={index}
              src={image}
              alt={`Selected ${index + 1}`}
            />
          ))}
        </Carousel>
      </CarouselContainer>
    </Container>
  );
};

export default WritePage;
