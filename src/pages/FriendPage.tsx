// FriendPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

interface Friend {
  friendshipId: number;
  friendEmail: string;
  friendNickname: string;
  department: string;
  intro: string;
  profileImageName: string;
}

interface MyProfileResponse {
  is_success: boolean;
  payload: {
    nickname: string;
    intro: string;
    department: string;
  };
}

interface FriendsListResponse {
  status: string;
  payload: {
    content: Friend[];
  };
}

interface FriendsSearchResponse {
  status: string;
  payload: Friend[];
}

interface ChatRoomResponse {
  payload: string;
  is_success?: boolean;
  message?: string;
}

interface DeleteFriendResponse {
  is_success: boolean;
  message?: string;
}

// ===== Styled =====
const ChatPageContainer = styled.div`
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
  height: 25vh;
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
  right: 32vw;
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
  margin-left: 5px;
  width: 100%;
  max-width: 150%;
  z-index: 11;
`;

const FriendButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  top: 8.7vh;
  right: 5vw;
  width: 100%;
  height: auto;
`;

const FriendButton1 = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14%;
  height: auto;
  margin-right: -4vw;

  img {
    width: 100%;
    height: auto;
  }
`;

const FriendButton2 = styled.img`
  width: 14%;
  height: auto;
  margin-right: -4vw;
`;

const FriendButton3 = styled.img`
  width: 14%;
  height: auto;
  object-fit: contain;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 3vh;
  border-bottom: 1px solid #ddd;
  border-radius: 6vh 6vh 0 0;
  z-index: 2;
  position: relative;
  top: 6vh;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProfileIcon = styled.img`
  width: 50px;
  height: 50px;
  background-color: #c4c4c4;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex-grow: 1;
`;

const ProfileName = styled.span`
  font-weight: bold;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.3vh;
`;

const ProfileStatus = styled.span`
  color: #888;
  font-size: 0.6rem;
`;

const ProfileStatusMsg = styled.span`
  color: #888;
  font-size: 0.7rem;
  margin-right: 10vw;
`;

const FriendsSection = styled.div`
  flex-grow: 1;
  margin-left: 4vw;
  overflow-y: auto;
  position: relative;
  top: 5vh;

  h2 {
    font-size: 0.7rem;
    margin-left: 4vw;
    margin-top: 3vh;
  }
`;

const FriendItem = styled.div`
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FriendInfo = styled.div`
  flex-grow: 1;
  margin-left: 1vw;
`;

const FriendName = styled.span`
  font-weight: bold;
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.3vh;
`;

const FriendStatus = styled.span`
  color: #888;
  font-size: 0.6rem;
`;

const FriendStatusMsg = styled.span`
  color: #888;
  font-size: 0.7rem;
  margin-right: 5vw;
`;

const Button = styled.button`
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  color: black;
`;

const PointerIcon = styled.img`
  width: 60%;
  height: auto;
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 11;
`;

const ModalText = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const ModalButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const CancelButton = styled(ModalButton)`
  background-color: #888;
  &:hover {
    background-color: #555;
  }
`;

const FriendPage: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [profileIntro, setProfileIntro] = useState<string>("");
  const [profileDepartment, setDepartment] = useState<string>("");
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isLongPress, setIsLongPress] = useState<boolean>(false);

  const navigate = useNavigate();
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 내 프로필 정보
  const fetchMyProfile = () => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    setError(null);

    axios
      .get<MyProfileResponse>(`${SERVER_URL}/api/v1/users/myProfile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        if (res.data.is_success) {
          setProfileName(res.data.payload.nickname);
          setProfileIntro(res.data.payload.intro);
          setDepartment(res.data.payload.department);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("내 프로필을 불러오지 못했습니다.");
        setLoading(false);
      });
  };

  // 친구 목록
  const fetchFriends = () => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    setError(null);

    axios
      .get<FriendsListResponse>(
        `${SERVER_URL}/api/v1/friends?page=0&size=20&sortKey=createdAtDesc`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        if (res.data.status === "OK") {
          setFriends(res.data.payload.content);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("친구 목록을 불러오지 못했습니다.");
        setLoading(false);
      });
  };

  // 검색
  const searchFriends = () => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    setError(null);

    if (searchTerm.trim() !== "") {
      const url = `${SERVER_URL}/api/v1/friends/search?keyword=${encodeURIComponent(
        searchTerm
      )}&sortKey=name`;

      axios
        .get<FriendsSearchResponse>(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          if (res.data.status === "OK") {
            setFriends(res.data.payload);
          }
          setLoading(false);
        })
        .catch(() => {
          setError("친구 검색에 실패했습니다.");
          setLoading(false);
        });
    } else {
      fetchFriends();
    }
  };

  // 채팅방 생성/가져오기
  const createOrGetChatRoom = (friendEmail: string) => {
    const accessToken = localStorage.getItem("accessToken");

    axios
      .post<ChatRoomResponse>(
        `${SERVER_URL}/api/v1/chats/${friendEmail}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        const roomPath = res.data.payload;
        const parts = roomPath.split("/").filter(Boolean);
        // 마지막에서 두 번째가 roomId라는 기존 로직 유지
        const roomId = parts.length >= 2 ? parts[parts.length - 2] : "";
        navigate("/chatpage", { state: { roomId } });
      })
      .catch((error) => {
        console.error("채팅방 생성/가져오기 실패:", error);
      });
  };

  // 친구 삭제
  const handleDeleteFriend = () => {
    if (selectedFriendId == null) return;
    const accessToken = localStorage.getItem("accessToken");

    axios
      .delete<DeleteFriendResponse>(
        `${SERVER_URL}/api/v1/friends/${selectedFriendId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        if (res.data.is_success) {
          fetchFriends();
        }
        setIsLongPress(false);
      })
      .catch(() => {
        alert("친구 삭제 오류가 발생했습니다.");
      });
  };

  // 롱프레스 시작
  const handleTouchStart = (friendId: number) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    longPressTimerRef.current = setTimeout(() => {
      setSelectedFriendId(friendId);
      setIsLongPress(true);
    }, 800);
  };

  // 롱프레스 끝
  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  useEffect(() => {
    fetchMyProfile();
    fetchFriends();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchFriends();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <ChatPageContainer>
      <HeaderBackground />
      <Header>
        <HeaderLeft>
          <Link to="/home">
            <BackButton src="/images/Back_icon.png" alt="Go back" />
          </Link>
          <HeaderTitle>Friends</HeaderTitle>
        </HeaderLeft>

        <SearchContainer>
          <SearchIcon src="/images/bluesearch_icon.png" alt="Search" />
          <SearchInput
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </SearchContainer>

        <FriendButtonContainer>
          <FriendButton1 to="/addfriend">
            <img src="/images/addfriend.png" alt="Add friend" />
          </FriendButton1>
          <FriendButton2 src="/images/sorting_icon.png" alt="Sort" />
          <FriendButton3 src="/images/setting_icon.png" alt="Settings" />
        </FriendButtonContainer>
      </Header>

      <ProfileSection>
        <ProfileIcon src="/images/myprofile.png" alt="My Profile" />
        <ProfileInfo>
          <ProfileName>{profileName}</ProfileName>
          <ProfileStatus>{profileDepartment}</ProfileStatus>
        </ProfileInfo>
        <ProfileStatusMsg>{profileIntro}</ProfileStatusMsg>
      </ProfileSection>

      <FriendsSection>
        {loading ? (
          <h2>Loading friends...</h2>
        ) : error ? (
          <h2>{error}</h2>
        ) : Array.isArray(friends) && friends.length > 0 ? (
          <>
            <h2>Friends ({friends.length})</h2>
            {friends.map((friend) => (
              <FriendItem
                key={friend.friendshipId}
                onClick={() => createOrGetChatRoom(friend.friendEmail)}
                onTouchStart={() => handleTouchStart(friend.friendshipId)}
                onTouchEnd={handleTouchEnd}
              >
                <ProfileIcon
                  src={`${SERVER_URL}/images/${friend.profileImageName}`}
                  alt="Friend profile"
                />
                <FriendInfo>
                  <FriendName>{friend.friendNickname}</FriendName>
                  <FriendStatus>{friend.department}</FriendStatus>
                </FriendInfo>
                <FriendStatusMsg>{friend.intro}</FriendStatusMsg>
                <Button>
                  <PointerIcon src="/images/pointer.png" alt="Pointer" />
                </Button>
              </FriendItem>
            ))}
          </>
        ) : (
          <h2>친구가 없네요. 친구를 검색하여 추가해보세요!</h2>
        )}
      </FriendsSection>

      {isLongPress && (
        <ModalOverlay>
          <ModalContent>
            <ModalText>정말로 친구를 삭제하시겠습니까?</ModalText>
            <div>
              <ModalButton onClick={handleDeleteFriend}>삭제</ModalButton>
              <CancelButton onClick={() => setIsLongPress(false)}>
                취소
              </CancelButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </ChatPageContainer>
  );
};

export default FriendPage;
