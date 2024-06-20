import React, { useEffect, useState } from 'react'
import { PatchRequest } from '../../services/PatchRequest.service';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProfileSchema } from '../../validation/schemas/Profile.schema';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../interfaces/reducer/User.reducer';
import styled from 'styled-components';
import '../../assets/styles/popup.css'

const ProfileSettings = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: any) => state?.user.value)
    const {handleSubmit, formState: {errors}, setValue} = useForm <{firstName: string, lastName: string, email: string}>({
        resolver: yupResolver(ProfileSchema)
    })
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');

    const updateUser = handleSubmit(async (data, event)=> {
          event?.preventDefault()
          await PatchRequest(`users/update/${user.user_id}`,{firstName: data.firstName, lastName: data.lastName, email: data.email})
          await dispatch(setUser(data))
          window.location.reload();
        }
    )

    useEffect(() => {
      setValue('firstName', firstName);
      setValue('lastName', lastName);
      setValue('email', email);
  }, [setValue, firstName, lastName, email]);

  useEffect(() => {
    const modal: any = document.querySelector('.profile-settings-popup')
    const openModal: any = document.querySelector('.open-profile-settings-popup')
    const closeModal: any = document.querySelectorAll('.close-profile-settings-popup')

    if(modal && openModal && closeModal){
      openModal.addEventListener('click', () => {
        modal.showModal();
      })
  
      closeModal.forEach((button: any) => {
        button.addEventListener('click', () => {
          modal.close();
        })
      })
    }
  }, []);

  return (
    <dialog className='profile-settings-popup'>
        <h1 className='popup_header'>Profile settings</h1>
        <form onSubmit={updateUser}>
            <div className='popup_settings_content'>
                <div className='popup_labels'>
                    <p className='popup_label_firstname'>Name</p>
                    <p className='popup_label_lastname'>Surname</p>
                </div>

                <div className='settings_line_input'>
                    <input type="text" name="firstName" className='popup_input_firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <input type="text" name="lastName" className='popup_input_lastName' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div style={{display: 'flex'}}>
                <Message>{errors.firstName?.message}</Message>
                <MessageLn>{errors.lastName?.message}</MessageLn>
                </div>

                <label className='popup_label_email'>Email</label>
                <input type="email" name='email' className='popup_input_email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <Message>{errors.email?.message}</Message>

                <div className='popup_settings_links'>
                    <button type='button' className="popup_link_button close-profile-settings-popup open-change-password-popup">Change password</button>
                    <button type='button' className="popup_link_button close-profile-settings-popup open-change-profile-picture-popup">Change profile picture</button>
                </div>
                
                <div className='popup_settings_button_container'>
                    <button type='button' className="popup_white_auction_button close-profile-settings-popup">Cancel</button>
                    <button type='submit' className="popup_yellow_settings_button">Save changes</button>
                </div>  
            </div>
        </form>
    </dialog>
  )
}

const Message = styled.p`
    font-style: italic;
    font-size: 12px;
    color: #ef1102;
`;
const MessageLn = styled.p`
    margin-left: 88px;
    float: right;
    font-style: italic;
    font-size: 12px;
    color: #ef1102;
    @media screen and (max-width: 600px) {
      margin-left: 5px;
    }
`;

export default ProfileSettings