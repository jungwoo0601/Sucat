import React, { useState } from "react";
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

const Form = styled.form`
  margin-top: 7vh;
  padding: 2rem 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 90%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 90%;
  padding: 0.8rem;
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #003fe0;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #00227a;
  }
`;

const Inquiry = () => {
  const [formData, setFormData] = useState({
    subject: "", // "이름" 대신 "문의 제목" 필드 추가
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 문의 제출 로직 추가 (예: API 요청)
    alert("문의가 성공적으로 제출되었습니다.");
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => window.history.back()}>
          <img src="/images/Back_icon.png" alt="Back" />
        </BackButton>
        <HeaderText>문의하기</HeaderText>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="subject">문의 제목</Label>
        <Input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="문의 제목을 입력하세요"
          required
        />
        <Label htmlFor="email">이메일 (답변은 메일로 전송됩니다)</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="이메일을 입력하세요"
          required
        />
        <Label htmlFor="message">메시지</Label>
        <TextArea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="문의 내용을 입력하세요"
          required
        />
        <SubmitButton type="submit">제출하기</SubmitButton>
      </Form>
    </Container>
  );
};

export default Inquiry;
