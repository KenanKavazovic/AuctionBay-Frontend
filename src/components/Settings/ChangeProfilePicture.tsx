import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import Avatar_blank from '../../assets/images/Avatar_blank.png';
import '../../assets/styles/popup.css'

const ChangeProfilePicture = () => {
  const user = useSelector((state: any) => state?.user.value)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await axios.post('/users/uploadAvatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        window.location.reload();
      } catch (error) {
        console.error('Error uploading avatar:', error);
        window.location.reload();
      }
    }
  };

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
    setLoading(false);
  }
  
  const uploadFile = () => {
    document.getElementById('avatarUpload')?.click()
  }

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
      FetchAvatar();
  }, [selectedFile])
  
  useEffect(() => {
    const modal: any = document.querySelector('.change-profile-picture-popup')
    const openModal: any = document.querySelector('.open-change-profile-picture-popup')
    const closeModal: any = document.querySelector('.close-change-profile-picture-popup')

    if(modal && openModal && closeModal){
      openModal.addEventListener('click', () => {
        modal.showModal();
      })
  
      closeModal.addEventListener('click', () => {
        modal.close();
      })
    }
  }, []);
  
  return (
    <dialog className='change-profile-picture-popup'>
      <div className='popup_settings_content'>
        <h1 className='popup_header'>Change profile picture</h1>

        <div className='popup_picture_upload_container'>
        {loading ? (
            <div>Loading...</div>
          ) :(
          <>
          <img className='popup_profile_picture' src={preview ? preview : userAvatar ? userAvatar : Avatar_blank} alt="avatar" />
          <button className='popup_white_button' onClick={uploadFile}>Upload new picture</button>
          <input id="avatarUpload" hidden type="file" name='file' accept=".png, .jpg, .jpeg" onChange={handleFileChange}/>
          </>
          )}
        </div>

        <div className='popup_settings_button_container'>
          <button className="popup_white_auction_button close-change-profile-picture-popup">Cancel</button>
          <button className="popup_yellow_settings_button close-change-profile-picture-popup" onClick={handleUpload}>Save changes</button>
        </div>
      </div>
    </dialog>
  )
}

export default ChangeProfilePicture