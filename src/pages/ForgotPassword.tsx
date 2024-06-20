import { useState } from 'react';
import { InputStyled } from '../components/common/InputForm';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo_yellow from '../assets/images/Logo_yellow.png';
import Left_image from '../assets/images/Login_Page_Img.png';
import '../assets/styles/forgot_password.css'

function ForgotPassword(){
    const [message, setMessage] = useState(" ")
    const [redirect,setRedirect] = useState(false)
   
return (
    redirect ? <Navigate to = {"/"}/> :
    <div className='fp_container'>

      <div className="fp_first_section">
        <img src={Left_image}></img>
      </div>

      <div className='fp_second_section'>
        <img src={Logo_yellow}></img>

        <div className='fp_header_subheader'>
          <p className='fp_header_text'>Forgot password?</p>
          <p className='fp_subheader_text'>No worries, we'll send you reset instructions</p>
        </div>

        <form action='/'>
          <label className='fp_label_email' >E-mail</label><br />
          <InputStyled type='email' name="email" width='420px' />
          <Message>{message}</Message>

          <button className='fp_submit_button' type='submit'>Reset password</button>
          <Message>{message}</Message>

          <div className='fp_back'>
            <a className='fp_link_login' href="/login">&lt; Back to login</a>
          </div>
        </form>
      </div>
    </div>
      )
    }
    
const Message = styled.p`
margin-top: 4px;
margin-left: 24px;
font-style: italic;
font-size: 12px;
color: #ef1102;
@media screen and (max-width: 661px) {
  margin-left: 70px;
  }
`;

export default ForgotPassword;


