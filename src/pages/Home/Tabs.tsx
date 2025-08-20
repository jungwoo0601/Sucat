import React from "react";
import styled from "styled-components";

// Styled-components 정의
const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
  border-top: none;
  width: 100vw;
  margin-top: 1vh;
`;

const TabButton = styled.button`
  flex: 1;
  background: none;
  border: none;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 1.5vh;
  text-align: center;
  position: relative;

  &.selected::after {
    content: "";
    display: block;
    width: 80%;
    height: 0.35vh;
    background-color: black;
    position: absolute;
    bottom: 0;
    left: 10%;
  }

  &:not(:last-child) {
    border-right: 0.2vh solid #ddd;
  }
`;

function Tabs({ selectedTab, setSelectedTab }) {
  return (
    <TabsContainer>
      {["자유게시판", "비밀게시판", "중고장터"].map((tab) => (
        <TabButton
          key={tab}
          className={selectedTab === tab ? "selected" : ""}
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
        </TabButton>
      ))}
    </TabsContainer>
  );
}

export default Tabs;
