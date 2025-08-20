import React, { useState } from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px 0px 20px;
  background-color: #fff;
  width: 100vw;
  height: 7vh;
  box-sizing: border-box;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderLogo = styled.img`
  width: 11vw;
  height: auto;
`;

const HeaderText = styled.div`
  font-size: 1.4rem;
  color: blue;
  margin-left: 2vw;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: -2vw;
`;

const Icon = styled.img`
  width: 2.3vh;
  height: 2.3vh;
  margin-right: 3vw;
  cursor: pointer;
`;

const SearchBox = styled.input`
  margin-right: 5px;
  padding: 0.65vh 0.8vh;
  border-radius: 0.7vh;
  border: 0.3vh solid black;
`;

function Header({ onSearch }) {
  const [searchWord, setSearchWord] = useState("");

  const handleSearchChange = (e) => {
    setSearchWord(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchWord); // Pass the search keyword to the parent
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        <HeaderLogo src="/images/sucat_logo.png" alt="SUCAT 로고" />
        <HeaderText>SUCAT</HeaderText>
      </HeaderLeft>
      <IconsContainer>
        <SearchBox
          value={searchWord}
          onChange={handleSearchChange}
          placeholder="검색어를 입력하세요"
        />
        <Icon
          src="/images/search_icon.png"
          alt="검색"
          onClick={handleSearchSubmit}
        />
      </IconsContainer>
    </HeaderContainer>
  );
}

export default Header;
