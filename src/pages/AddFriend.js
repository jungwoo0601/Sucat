import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
// 스타일 정의
const FriendPageContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const HeaderBackground = styled.div`
  background: linear-gradient(180deg, #003fe0 0%, #003fe0 99%, #00227a 100%);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20vh;
  z-index: 0;
`;

const Header = styled.header`
  padding: 3vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0vh;
  margin-left: -1vw;
`;

const BackButton = styled.img`
  width: 3vw;
  height: auto;
  margin-right: 6vw;
  cursor: pointer;
`;

const HeaderTitle = styled.h1`
  font-size: 1.1rem;
  white-space: nowrap;
  color: white;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 2.5vw;
  padding: 0.5vh;
  position: relative;
  left: -32vw;
  top: 6vh;
  width: 50vw;
`;

const SearchIcon = styled.img`
  width: 7%;
  height: auto;
  margin-left: 2vw;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 0.5vh;
  border-radius: 10vw;
  margin-left: 0.6vh;
  width: 100%;
  max-width: 150%;
  z-index: 10;
`;

const AddFriendIcon = styled.img`
  width: 15%;
  height: auto;
  position: absolute;
  top: 8.5vh;
  right: 10vh;
  cursor: pointer;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #003fe0;
  margin-top: 5vh;
  position: relative;
  z-index: 1;
  border-radius: 1.5vh 1.5vh 0 0;
  padding: 0;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1vh;
  font-size: 0.8rem;
  font-weight: bold;
  position: relative;
  top: 1vh;
  border: none;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "white" : "#CAD9FF")};
  color: black;
  border-radius: 1.5vh 1.5vh 0 0;
  border-bottom: ${(props) => (props.active ? "none" : "0px solid #CAD9FF")};
  box-shadow: ${(props) =>
    props.active ? "0px -4px 5px rgba(0, 0, 0, 0.1)" : "none"};
  margin: 0;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:not(:last-child) {
    margin-right: -0.1vh;
  }

  &:hover {
    background-color: ${(props) => (props.active ? "white" : "#00227a")};
    color: ${(props) => (props.active ? "black" : "white")};
  }
`;

const FriendList = styled.div`
  padding: 1vh;
  flex-grow: 1;
  overflow-y: auto;
`;

const FriendItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1vh;
  border-bottom: 0.2vh solid #ddd;
`;

const FriendProfile = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileIcon = styled.div`
  width: 5vh;
  height: 5vh;
  background-color: #c4c4c4;
  border-radius: 50%;
  margin-right: 1.5vh;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const FriendInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FriendName = styled.span`
  font-weight: bold;
  margin-bottom: 0.5vh;
  font-size: 0.8rem;
`;

const FriendEmail = styled.span`
  color: #888;
  margin-bottom: 0.3vh;
  font-size: 0.6rem;
`;

const FriendDepartment = styled.span`
  color: #888;
  font-size: 0.6rem;
`;

const AcceptButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 1vh 2vh;
  border: none;
  border-radius: 0.8vh;
  cursor: pointer;
  margin-right: 1vh;
  &:hover {
    background-color: brightgreen;
  }
`;

const RejectButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 1vh 2vh;
  border: none;
  border-radius: 0.8vh;
  cursor: pointer;
  &:hover {
    background-color: red;
  }
`;

function AddFriend() {
  const [activeTab, setActiveTab] = useState("received");
  const [friendEmail, setFriendEmail] = useState("");
  const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0); // Track total count
  const [friendUserId, setFriendUserId] = useState("");

  const access_token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchReceivedFriendRequests = async () => {
      try {
        const response = await fetch(
          `${SERVER_URL}/api/v1/friends/received?sortKey=createdAtDesc`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        console.log("API Response Data:", data);

        if (
          data.is_success &&
          data.payload &&
          data.payload.waitingFriendDtoList
        ) {
          setReceivedFriendRequests(data.payload.waitingFriendDtoList);
          setTotalRequests(data.payload.totalCount);
          setFriendUserId(data.payload.friendshipId);
        } else {
          setReceivedFriendRequests([]);
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching received friend requests:", error);
        setReceivedFriendRequests([]);
      }
    };

    if (access_token) {
      fetchReceivedFriendRequests();
    }
  }, [access_token]);

  const handleAddFriend = async (email) => {
    const complete_email = email.includes("@suwon.ac.kr")
      ? email
      : `${email}@suwon.ac.kr`;

    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/friends/${complete_email}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.is_success) {
        alert("친구 추가 요청을 보냈습니다");
      } else {
        alert(`친구 추가 요청에 실패했습니다: ${data.message}`);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("친구 추가 요청 중 오류가 발생했습니다");
    }
  };

  // Accept friend request
  const approveFriend = async (friendUserId) => {
    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/friends/approve/${friendUserId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.is_success) {
        alert("친구가 되었습니다!");
        // Optionally, refresh the friend requests list after accepting
        setReceivedFriendRequests((prev) =>
          prev.filter((friend) => friend.friendshipId !== friendUserId)
        );
        setTotalRequests((prevTotal) => prevTotal - 1);
      } else {
        alert(`친구 요청 수락에 실패했습니다: ${data.message}`);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("친구 요청 수락 중 오류가 발생했습니다.");
    }
  };

  // Refuse friend request
  const refuseFriend = async (friendUserId) => {
    try {
      const response = await fetch(
        `${SERVER_URL}/api/v1/friends/refuse/${friendUserId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.is_success) {
        alert("친구 요청을 거절했습니다.");
        // Optionally, refresh the friend requests list after refusing
        setReceivedFriendRequests((prev) =>
          prev.filter((friend) => friend.friendshipId !== friendUserId)
        );
        setTotalRequests((prevTotal) => prevTotal - 1);
      } else {
        alert(`친구 요청 거절에 실패했습니다: ${data.message}`);
      }
    } catch (error) {
      console.error("Error refusing friend request:", error);
      alert("친구 요청 거절 중 오류가 발생했습니다.");
    }
  };

  return (
    <FriendPageContainer>
      <HeaderBackground />
      <Header>
        <HeaderLeft>
          <Link to="/chatpage">
            <BackButton src="/images/Back_icon.png" alt="Go back" />
          </Link>
          <HeaderTitle>친구 요청 ({totalRequests})</HeaderTitle>
        </HeaderLeft>

        <SearchContainer>
          <SearchIcon src="/images/bluesearch_icon.png" alt="Search" />
          <SearchInput
            type="text"
            placeholder="친구의 이메일을 입력하세요."
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
          />
        </SearchContainer>
        <AddFriendIcon
          src="/images/addfriend.png"
          alt="Add Friend"
          onClick={() => handleAddFriend(friendEmail)}
        />
      </Header>

      <TabContainer>
        <Tab
          active={activeTab === "received"}
          onClick={() => setActiveTab("received")}
        >
          받은 친구 요청
        </Tab>
      </TabContainer>

      <FriendList>
        {activeTab === "received" && receivedFriendRequests.length > 0 ? (
          receivedFriendRequests.map((friend, index) => (
            <FriendItem key={index}>
              <FriendProfile>
                <ProfileIcon
                  src={
                    friend.profileImageName
                      ? `/path/to/images/${friend.profileImageName}`
                      : "/images/default_profile.png"
                  }
                  alt={friend.friendNickname}
                />
                <FriendInfo>
                  <FriendName>{friend.friendNickname}</FriendName>
                  <FriendEmail>{friend.friendEmail}</FriendEmail>
                </FriendInfo>
              </FriendProfile>
              <div>
                <AcceptButton
                  onClick={() => approveFriend(friend.friendshipId)}
                >
                  수락
                </AcceptButton>
                <RejectButton onClick={() => refuseFriend(friend.friendshipId)}>
                  거절
                </RejectButton>
              </div>
            </FriendItem>
          ))
        ) : (
          <p>받은 친구 요청이 없습니다.</p>
        )}
      </FriendList>
    </FriendPageContainer>
  );
}

export default AddFriend;
