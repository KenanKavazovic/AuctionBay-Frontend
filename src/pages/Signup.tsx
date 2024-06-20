import { useEffect, useState } from 'react';
import { InputStyled } from '../components/common/InputForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { RegisterSchema } from '../validation/schemas/Register.schema';
import { PostRequest } from '../services/PostRequest.service';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo_yellow from '../assets/images/Logo_yellow.png';
import Left_image from '../assets/images/Login_Page_Img.png';
import '../assets/styles/signup.css'

function Signup() {
    const [message, setMessage] = useState(" ")
    const [redirect,setRedirect] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm <{email: string, password: string, confirm_password: string, firstName: string, lastName: string}>({
        resolver: yupResolver(RegisterSchema)
    })
    
    const submit = handleSubmit(async (data, event)=> {
          event?.preventDefault()
          const response = await PostRequest("auth/signup",data)
          await setMessage(response.response?.data?.message || "")
        }
    )

    useEffect(()=>{
      if (!message.length) setRedirect(true)
    },[message])

    return (
        redirect ? <Navigate to = {"/login"}/> :
        <div className='signup_container'>
          
          <div className="signup_first_section">
            <img src={Left_image} alt='Auctions'></img>
          </div>
        
          <div className='signup_second_section'>
            <img src={Logo_yellow} alt='Logo'></img>

              <div className='signup_header_subheader'>
                <p className='signup_header_text'>Hello!</p>
                <p className='signup_subheader_text'>Please enter your details</p>
              </div>

            <form onSubmit={ submit }>
              <div className='signup_labels'>
                <p className='signup_label_firstname'>Name</p> 
                <p className='signup_label_lastname'>Surname</p> 
              </div>

              <div className='line_input'>
                <InputStyled sp='mobile_small' register={register} name="firstName" type='text' width='181px' />    
                <InputStyled sp='mobile_small' register={register} name="lastName" type='text' width=' 181px' />
              </div>
              <div>
              <Message>{errors.firstName?.message}</Message>
              <MessageLn>{errors.lastName?.message}</MessageLn>
              </div>

              <label className='signup_label_email' >E-mail</label><br />
              <InputStyled register={register} name="email" type='email' width='430px' />
              <Message>{errors.email?.message}</Message>

              <label className='signup_label_password' >Password</label><br />
              <InputStyled register={register} name="password" type='password' width='430px' />
              <Message>{errors.password?.message}</Message>

              <label className='signup_label_confirm_password' >Repeat Password</label><br />
              <InputStyled register={register} name="confirm_password" type='password' width='430px' />
              <Message>{errors.confirm_password && "Passwords should match"}</Message>

              <button className='signup_submit_button' type='submit'>Sign up</button>
              <Message>{message }</Message>

              <div className='signup_existing_account'>
                <p>Already have an account? <a className='login_link_signup' href="/login">Log in</a></p>
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
    @media screen and (max-width: 600px) {
      margin-left: 0;
    }
`;
const MessageLn = styled.p`
    margin-top: -28px;
    margin-left: 254px;
    font-style: italic;
    font-size: 12px;
    color: #ef1102;
    @media screen and (max-width: 600px) {
      margin-left: 180px;
    }
`;

export default Signup;