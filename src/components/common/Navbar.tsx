import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { unsetUser } from '../../interfaces/reducer/User.reducer';
import { PostRequest } from '../../services/PostRequest.service';
import { useEffect, useState } from 'react';
import Create_Button from '../../assets/images/Create_Button.png';
import Logo_yellow from '../../assets/images/Logo_yellow.png';
import Avatar_blank from '../../assets/images/Avatar_blank.png';
import Home_black from '../../assets/images/Home_black.png';
import Home_white from '../../assets/images/Home_white.png';
import Person_black from '../../assets/images/Person_black.png';
import Person_white from '../../assets/images/Person_white.png';
import Settings from '../../assets/images/Settings.png';
import Settings_white from '../../assets/images/Settings_white.png';
import CreateAuction from '../Auction/CreateAuction';
import ProfileSettings from '../Settings/ProfileSettings';
import styled from 'styled-components';
import axios from 'axios';
import ChangePassword from '../Settings/ChangePassword';
import ChangeProfilePicture from '../Settings/ChangeProfilePicture';
import "../../assets/styles/navbar.css";
import "../../assets/styles/popup.css";

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const user = useSelector((state: any) => state?.user.value)
  const location = useLocation().pathname
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const isAuctionsPage = location.startsWith('/auctions')
  const isProfilePage = location.startsWith('/profile')

  async function GetAvatar() {
    if (user?.avatar) {
      try {
        const response = await axios.get(`/users/avatar/${user.user_id}`, {
          responseType: 'blob',
        });
        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(response.data);
          return imageUrl;
        } else {
          console.error('Failed to fetch avatar image.');
          return null;
        }
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }
    return null;
  }

  const FetchAvatar = async () => {
    const imageUrl = await GetAvatar();
    setUserAvatar(imageUrl);
  }
  
  const Logout= async  () => {
    await PostRequest('auth/logout')
    await setUserAvatar(null)
    dispatch(unsetUser())
    navigate('/')
  }

  useEffect(() => {
    if (user && !userAvatar) {
      FetchAvatar();
    }
  }, [userAvatar, FetchAvatar]);

    const modal: any = document.querySelector('.profile-popup')
    const openModal: any = document.querySelector('.open-profile-popup')
    const closeModal: any = document.querySelector('.close-profile-popup')

    if(modal && openModal && closeModal){
      openModal.addEventListener('click', () => {
        modal.show();
      })
  
      closeModal.addEventListener('click', () => {
        modal.close();
      })

      document.addEventListener('click', (e) => {
        if (!modal.contains(e.target) && !openModal.contains(e.target)) {
            modal.close();
        }
      })
    }

  const authBtns = () =>
    <AnchorContainer>

      <div className='navbar_logo'>
       <img src={Logo_yellow} alt='Logo' />
      </div>

      <div className='navbar_left'>
        <div className='navbar_left_auctions_button_container'>
          <NavLink to={'auctions'}>
            <img className='navbar_icon_home' src={isAuctionsPage ? Home_white : Home_black} alt="Auctions" />
            <button className={`${isAuctionsPage ? "navbar_black_button" : "navbar_white_button"} `}>Auctions</button>
          </NavLink>
        </div>

        <div className='navbar_left_profile_button_container'>
          <NavLink to={`/profile/myauctions`}>
            <img className='navbar_icon_person' src={isProfilePage ? Person_white : Person_black } alt="Profile" />
            <button className={`${isProfilePage ? "navbar_black_button" : "navbar_white_button"} `}>Profile</button>
          </NavLink>
        </div>
      </div>

      <div className='navbar_center'>

      </div>

      <div className='navbar_right'>
        <NavLink to={'#'} className={'open-create-auction-popup'}>
           <img className='navbar_right_create_auction_picture' src={Create_Button} alt="Create" />
        </NavLink>
        <CreateAuction />
          
        <NavLink to={'#'} className={'open-profile-popup'}>
          <img className='navbar_right_profile_picture' src={userAvatar ? userAvatar : Avatar_blank} alt="avatar" />
        </NavLink>
        <dialog className='profile-popup'>
          <div className='popup_content'>
            <button className="popup_blank_button close-profile-popup open-profile-settings-popup"   
              onMouseEnter={() => { 
                const img = document.getElementById('settings-img') as HTMLImageElement;
                if (img) {
                  img.src = Settings_white; 
                }
              }}
              onMouseLeave={() => { 
                const img = document.getElementById('settings-img') as HTMLImageElement;
                if (img) {
                  img.src = Settings; 
                }
              }}>
              <img src={Settings} id="settings-img" alt='Settings'/>Profile Settings
            </button>
            <button className="popup_white_button close-profile-popup" onClick={() => { Logout(); }}>Log out</button>
          </div>
        </dialog>
        <ProfileSettings />
        <ChangePassword />
        <ChangeProfilePicture />
      </div>
    </AnchorContainer>
    
  const renderButtons= () => {
    switch(location){
      case "/signup":
        return (
          <></>
        )

      case "/login":
        return (
          <></>
        )
        
      case "/forgotpassword":
        return (
          <></>
        )

      default:
        return (
        <>
          <div className='logo, navbar_div'>
            <img src={Logo_yellow} alt='Logo' />
          </div>
          <AnchorContainer>
           <div className='navbar_landing'>
            <NavLink to={'login'}>
              <p style={{color: "#071015", fontWeight: "bold"}}>Login</p>
            </NavLink>
              <p>or</p>
            <NavLink to={'signup'}>
              <button className='navbar_signup_button'>Sign up</button>
            </NavLink>
           </div>
          </AnchorContainer>
        </>
        )  
    }
  }

  return (
    <nav className='navbar'>
     <div className='navbar_div'>
        {user ? authBtns() : renderButtons()}
     </div >
    </nav>
  )
}

const AnchorContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export default Navbar