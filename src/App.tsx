import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './interfaces/reducer/User.reducer';
import axios from 'axios';
import Wrapper from './components/common/Wrapper';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Auctions from './pages/Auctions';
import ProfileMyAuctions from './pages/ProfileMyAuctions';
import ProfileWon from './pages/ProfileWon';
import ProfileBidding from './pages/ProfileBidding';
import Auction from './pages/Auction';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state?.user.value);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('auth/me');
        dispatch(setUser(data));
      } catch (error) {
      } finally {
        setLoading(true);
      }
    };

    if (user) {
      setLoading(true);
    } else {
      fetchUserData();
    }
  }, [dispatch, user]);

  if (!loading) {
    return null;
  }

  return (
    <>
      <Wrapper>
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
          </>
        ) : (
          <>
            <Route path="profile" element={<ProfileMyAuctions />} />
            <Route path="profile/myauctions" element={<ProfileMyAuctions />} />
            <Route path="profile/bidding" element={<ProfileBidding />} />
            <Route path="profile/won" element={<ProfileWon />} />
            <Route path="auctions" element={<Auctions />} />
            <Route path="auction/:auctionId" element={<Auction />} />
          </>
        )}
      </Routes>
      </Wrapper>
    </>
  );
}

export default App;
