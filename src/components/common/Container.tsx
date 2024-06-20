import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

interface Props{
    children: React.ReactNode
}
const Container: React.FC<{children: React.ReactNode}> = ({children}) => {

  const location = useLocation().pathname

  const renderContainer=() => {
    switch(location){
      case '/signup':
      case '/login':
      case '/forgotpassword':
        return children;
      default:
        return (
          <ContainerST className='Container'>
            {children}
          </ContainerST>
        )
    }
  }

  return (
    <>{renderContainer()}</>
  )
}

const ContainerST = styled.div`
  margin-top: 80px;
  max-height: 100%;
`;

export default Container