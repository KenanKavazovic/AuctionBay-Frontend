import styled from "styled-components";
import React, { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from 'react';

const Input: React.FC<{
  height?: string, 
  sp?: string, 
  className?: string, 
  width?: string, 
  border?: string, 
  fg?: string, 
  bg?: string, 
  pd?: boolean, 
  type: string, 
  value?: string, 
  onChange?: ChangeEventHandler<HTMLInputElement>, 
  onBlur?: FocusEventHandler<HTMLInputElement>, 
  name?: string, 
  register?: any, 
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}> = ({height, width, sp, border, fg, bg, pd, type, className, register, name, value, onChange, onKeyDown,}) => {
  return (register ?
    <input {...register(name)} defaultValue={value} className={className} onChange={onChange} type={type || "text"} onKeyDown={onKeyDown} />
    : <input className={className} onChange={onChange} defaultValue={value} type={type || "text"} onKeyDown={onKeyDown} />
  )
  }

  export const InputStyled=styled(Input)`
  box-sizing: content-box; 
  height: ${props=>props.height || "40px"};
  font-size: 16px;
  margin-top: 10px;
  display: block;
  margin-bottom: 10px;
  font-style: normal;
  width: ${props => props.width || "420px"};
  padding: 4px 30px 4px 24px;
  border-radius: 32px;
  border: ${props => props.border || "2px solid #DDE9E6"};
  color: ${props => props.fg};
  background-color: ${props => props.bg || "#FFFFFF"};
  @media screen and (max-width: 600px) {
    width: ${props => props.sp === 'mobile_small' ? '106px' : '280px'};
    height: 40px;
    border-radius: 24px;
  }
`;