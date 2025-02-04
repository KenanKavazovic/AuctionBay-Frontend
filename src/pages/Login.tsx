import { useEffect, useState } from 'react';
import { InputStyled } from '../components/common/InputForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoginSchema } from '../validation/schemas/Login.schema';
import { PostRequest } from '../services/PostRequest.service';
import { Navigate } from 'react-router-dom';
import { setUser } from '../interfaces/reducer/User.reducer';
import { GetMe } from '../services/Me.service';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Logo_yellow from '../assets/images/Logo_yellow.png';
import Left_image from '../assets/images/Login_Page_Img.png';
import '../assets/styles/login.css'

function Login(){
    const [message, setMessage] = useState(" ")
    const [redirect,setRedirect] = useState(false)
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: {errors}} = useForm<{email: string, password: string}>({
        resolver: yupResolver(LoginSchema)
    })
    
  const submit = handleSubmit(async (data, event) => {
    event?.preventDefault()
    try {
      const response = await PostRequest("auth/login", data);
      await setMessage(response.data?.message || "");
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
    
  })

  useEffect(() => {
    if(!message.length) {
      (async() => {
        const {data} = await GetMe()
        dispatch(setUser(data))
      })()
      setRedirect(true)
    }
  }, [message])
   
return (
    redirect ? <Navigate to = {"/profile/myauctions"}/> :
    <div className='login_container'>

      <div className="login_first_section">
        <img src={Left_image}></img>
      </div>

      <div className='login_second_section'>
        <img src={Logo_yellow}></img>

        <div className='login_header_subheader'>
          <p className='login_header_text'>Welcome back!</p>
          <p className='login_subheader_text'>Please enter your details</p>
        </div>

        <form onSubmit={submit}>
          <label className='login_label_email' >E-mail</label><br />
          <InputStyled type='email' register={register} name="email" width='420px' />
          <Message>{errors.email?.message}</Message>
        
          <label className='login_label_password' >Password</label><br />
          <InputStyled name="password" register={register} type='password'/>
          <Message>{errors.password?.message}</Message>
          
          <div className='login_forgot_password'>
            <a className='login_forgot_password_link' href='/forgotpassword'>Forgot password?</a>
          </div>

          <Message>{message}</Message>
          <button className='login_submit_button' type='submit'>Login</button>

          <div className='login_no_account'>
            <p>Don't have an account? <a className='login_link_signup' href="/signup">Sign up</a></p>
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

export default Login;


