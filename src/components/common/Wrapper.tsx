import React from 'react';
import Navbar from './Navbar';
import Container from './Container';

interface Props{
    children: React.ReactNode
}

const Wrapper = (props: Props) => {
  return (
    <>
    <Navbar/>
    <Container>
      {props.children}
    </Container>
    </>
  )
}

export default Wrapper