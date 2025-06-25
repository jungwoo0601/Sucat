import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
import MyPage from "./pages/MyPage/MyPage";
import Joinpage from "./pages/Joinpage";
import Joinpage2 from "./pages/Joinpage2";
import Notification from "./pages/Notification";
import Home from "./pages/Home/App";
import PostDetail from "./pages/Home/PostDetail";
import WritePage from "./pages/WritePage";
import FindPw from "./pages/FindPw";
import ProfileChangePage from "./pages/MyPage/ProfileChangePage";
import AddFriend from "./pages/AddFriend";
import ChatPage from "./pages/ChatPage";
import FriendPage from "./pages/FriendPage";
import { MusicProvider } from "./pages/Game/MusicProvider";
import GameList from "./pages/Game/GameList";
import GameWaiting from "./pages/Game/GameWaiting";
import GameWaiting2 from "./pages/Game/GameWaiting2";
import GameWaiting3 from "./pages/Game/GameWaiting3";
import GameWaiting4 from "./pages/Game/GameWaiting4";
import GameRanking from "./pages/Game/GameRanking";
import Announcement from "./pages/Announcement/Announcement";
import AnnounceDetail from "./pages/Announcement/AnnounceDetail";
import ChangePw from "./pages/MyPage/ChangePw";
import MyPost from "./pages/MyPage/MyPost";
import MyComment from "./pages/MyPage/MyComment";
import Myscrap from "./pages/MyPage/MyScrap";
import Inquiry from "./pages/MyPage/Inquiry";
import TermsOfService from "./pages/MyPage/TermsOfService";
import PrivacyPolicy from "./pages/MyPage/PrivacyPolicy";
import OpenSourceLicenses from "./pages/MyPage/OpenSourceLicenses";
import RestrictionInfo from "./pages/MyPage/RestrictionInfo";
import WritingAnnouncement from "./pages/Announcement/WritingAnnouncement";
import ReWrite from "./pages/MyPage/ReWrite";

function App() {
  return (
    <Router>
      <MusicProvider>
        <Routes>
          <Route path="/gamelist" element={<GameList />} />
          <Route path="/gamewaiting" element={<GameWaiting />} />
          <Route path="/gamewaiting2" element={<GameWaiting2 />} />
          <Route path="/gamewaiting3" element={<GameWaiting3 />} />
          <Route path="/gamewaiting4" element={<GameWaiting4 />} />
        </Routes>
      </MusicProvider>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/joinpage" element={<Joinpage />} />
        <Route path="/joinpage2" element={<Joinpage2 />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/writing_announcement" element={<WritingAnnouncement />} />
        <Route path="/home" element={<Home />} />
        <Route path="/findpw" element={<FindPw />} />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path="/writepage" element={<WritePage />} />
        <Route path="/profilechange" element={<ProfileChangePage />} />
        <Route path="/addfriend" element={<AddFriend />} />
        <Route path="/friendpage" element={<FriendPage />} />
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/gameranking" element={<GameRanking />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/announcedetail" element={<AnnounceDetail />} />
        <Route path="/changepw" element={<ChangePw />} />
        <Route path="/mypost" element={<MyPost />} />
        <Route path="/mycomment" element={<MyComment />} />
        <Route path="/myscrap" element={<Myscrap />} />
        <Route path="/inquiry" element={<Inquiry />} />
        <Route path="/termsofservice" element={<TermsOfService />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/opensourcelicenses" element={<OpenSourceLicenses />} />
        <Route path="/restrictioninfo" element={<RestrictionInfo />} />

        <Route path="/reWrite" element={<ReWrite />} />
      </Routes>
    </Router>
  );
}

export default App;
