import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  height: 100vh;
  padding: 1.5vh 2.5vh;
  font-family: "Arial, sans-serif";
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7vh;
  position: relative;
  top: 3vh;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 2vh;
  cursor: pointer;
`;

const PostButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.5vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.2vh;
`;

const Input = styled.input`
  padding: 1vh;
  margin-right: 1vh;
  border: 0.2vh solid black;
  flex-grow: 1;
`;

const IconButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.7vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 1vh 1vh;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const TextArea = styled.textarea`
  padding: 1vh;
  border: 0.1vh solid black;
  margin-bottom: 2rem;
  flex-grow: 1;
`;

const CarouselContainer = styled.div`
  margin-top: auto;
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

const ReWritePage = () => {
  const location = useLocation(); // useLocation으로 전달된 state를 받아옴
  const { postId } = location.state || {}; // state가 없을 수 있으므로 안전하게 처리
  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalImages, setOriginalImages] = useState([]); // 원본 이미지 저장
  const navigate = useNavigate();

  useEffect(() => {
    // 페이지가 로드될 때 OriginPost를 불러오는 함수
    const fetchPost = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(
          `${SERVER_URL}/api/v1/boards/edit/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );

        const result = await response.json();
        if (result.status === "OK") {
          setTitle(result.payload.title);
          setContent(result.payload.content);
          setOriginalImages(result.payload.imageNames);
        } else {
          alert("게시글을 불러오지 못했습니다: " + result.message);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPost();
  }, [postId]);

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
    const formData = new FormData();

    const jsonData = JSON.stringify({
      title,
      content,
    });
    formData.append(
      "request",
      new Blob([jsonData], { type: "application/json" })
    );

    const fileInputs = fileInputRef.current.files;
    if (fileInputs.length > 0) {
      for (let i = 0; i < fileInputs.length; i++) {
        formData.append("images", fileInputs[i]);
      }
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `${SERVER_URL}/api/v1/boards/edit/${postId}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (result.is_success) {
        alert("성공적으로 수정되었습니다");
        navigate(-1);
      } else {
        alert("수정에 실패했습니다: " + result.message);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const goback = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={goback}>◀︎ 글 수정</BackButton>
        <PostButton type="button" onClick={handlePostClick}>
          수정하기
        </PostButton>
      </Header>
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
          {originalImages.map((image, index) => (
            <ImagePreview
              key={index}
              src={`${SERVER_URL}/uploads/${image}`}
              alt={`Original ${index + 1}`}
            />
          ))}
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

export default ReWritePage;
