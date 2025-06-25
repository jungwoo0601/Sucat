import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Container = styled.div`
  max-width: 60vh;
  margin: 0 auto;
  padding: 2vh;
  border: 0.1vh solid #ccc;
  border-radius: 1vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
`;

const Header = styled.h1`
  font-size: 3vh;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 2vh;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 2vh;
  margin-bottom: 1vh;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.5vh;
  font-size: 2vh;
  border: 0.1vh solid #ccc;
  border-radius: 0.5vh;
  box-sizing: border-box;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1.5vh;
  font-size: 2vh;
  border: 0.1vh solid #ccc;
  border-radius: 0.5vh;
  resize: none;
  box-sizing: border-box;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2vh;
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 1.5vh 2vh;
  border: none;
  border-radius: 0.5vh;
  cursor: pointer;
  font-size: 2vh;

  &:disabled {
    background-color: #cccccc;
  }
`;

const SaveDraftButton = styled.button`
  background-color: #ffc107;
  color: white;
  padding: 1.5vh 2vh;
  border: none;
  border-radius: 0.5vh;
  cursor: pointer;
  font-size: 2vh;
`;

function WritingAnnouncement() {
  const [title, setTitle] = useState(""); // 공지 제목 상태
  const [content, setContent] = useState(""); // 공지 내용 상태
  const [image, setImage] = useState(null); // 이미지 파일 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // 이미지 파일을 상태에 저장
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      // FormData에 데이터 추가
      const formData = new FormData();
      const jsonData = JSON.stringify({ title, content });
      const blob = new Blob([jsonData], { type: "application/json" });

      formData.append("notificationRequest", blob); // JSON 데이터 추가
      if (image) {
        formData.append("images", image); // 이미지 파일 추가
      }

      // 서버로 데이터 전송
      const response = await axios.post(
        `${SERVER_URL}/admin/notification`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.is_success === true) {
        alert("공지사항이 성공적으로 등록되었습니다.");
        navigate(-1);
      }
    } catch (error) {
      console.error("공지사항 등록 중 오류 발생:", error);
      alert("공지사항 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>시스템 공지사항 작성</Header>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>공지사항 제목</Label>
          <Input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="[공지] 서비스 개편 안내"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>공지 내용</Label>
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder="공지 내용을 입력하세요..."
            rows="10"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>이미지 업로드</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </FormGroup>
        <ButtonGroup>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "업로드 중..." : "즉시 업로드"}
          </SubmitButton>
          <SaveDraftButton
            type="button"
            onClick={() => alert("임시저장 기능은 구현되지 않았습니다.")}
          >
            공지사항 임시저장
          </SaveDraftButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

export default WritingAnnouncement;
