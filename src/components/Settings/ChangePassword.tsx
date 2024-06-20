import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { PasswordSchema } from '../../validation/schemas/PasswordSchema';
import { PatchRequest } from '../../services/PatchRequest.service';
import { setUser } from '../../interfaces/reducer/User.reducer';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import '../../assets/styles/popup.css'

const ChangePassword = () => {
  const user = useSelector((state: any) => state?.user.value)
  const dispatch = useDispatch()
  const [incorrectPasswordError, setIncorrectPasswordError] = useState(false);
  const [samePasswordError, setSamePasswordError] = useState(false);
  const {handleSubmit, formState: {errors}, setValue} = useForm<{current_password: string, password: string, confirm_password: string}>({
        resolver: yupResolver(PasswordSchema)
    })
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const changePassword = handleSubmit( async (data, event)=> {
      event?.preventDefault()
      try {
        await PatchRequest(`users/update/${user.user_id}`,{current_password: data.current_password, password: data.password, confirm_password: data.confirm_password})
        await dispatch(setUser(data))
        window.location.reload()
      } catch (error: any) {
        const errorMessage = error.message
        errorMessageCheck(errorMessage)
      }
    }
  )
  
  useEffect(() => {
    setValue('current_password', currentPassword);
    setValue('password', password);
    setValue('confirm_password', confirmPassword);
}, [setValue, currentPassword, password, confirmPassword]);

  const errorMessageCheck = (errorMessage: string) => {
    if (errorMessage === 'The password you entered is incorrect.') {
      setIncorrectPasswordError(true)
      setSamePasswordError(false)
    } else if (errorMessage === 'New password cannot be the same as your old password.') {
      setIncorrectPasswordError(false)
      setSamePasswordError(true)
    } else {
      setIncorrectPasswordError(false)
      setSamePasswordError(false)
    }
  }

  useEffect(() => {
    const modal: any = document.querySelector('.change-password-popup')
    const openModal: any = document.querySelector('.open-change-password-popup')
    const closeModal: any = document.querySelector('.close-change-password-popup')

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
    <dialog className='change-password-popup'>
      <h1 className='pupup_header'>Change password</h1>
      <form onSubmit={changePassword}>
        <div className='popup_settings_content'>
          <label className='popup_label_password'>Current password</label>
          <input type="password" name='current_password' className='popup_input_password' onChange={(e) => setCurrentPassword(e.target.value)} />
          <Message>{errors.current_password?.message}</Message>
          {incorrectPasswordError && <Message>The password you entered is incorrect.</Message>}

          <label className='popup_label_password'>New password</label>
          <input type="password" name='password' className='popup_input_password'onChange={(e) => setPassword(e.target.value)} />
          <Message>{errors.password?.message}</Message>
          {samePasswordError && <Message>New password cannot be the same as your old password.</Message>}

          <label className='popup_label_password'>Confirm new password</label>
          <input type="password" name='confirm_password' className='popup_input_password' onChange={(e) => setConfirmPassword(e.target.value)} />
          <Message>{errors.confirm_password?.message}</Message>

          <div className='popup_settings_button_container'>
            <button type='button' className="popup_white_auction_button close-change-password-popup">Cancel</button>
            <button type='submit' className="popup_yellow_settings_button close-change-password-popup">Save changes</button>
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
    margin: 0;
`;

export default ChangePassword