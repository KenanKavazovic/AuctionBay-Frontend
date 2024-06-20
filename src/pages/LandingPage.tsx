import React from 'react'
import { NavLink } from 'react-router-dom';
import Auctions_landing from '../assets/images/Auctions_landing.png'
import Auctions_landing_mobile from '../assets/images/Auctions_landing_mobile.png'
import '../assets/styles/landing_page.css'

const LandingPage = () => {
  return (
    <div className='lp_container'>

      <div className='landing_header_subheader'>
        <h1>E-auctions made easy!</h1>
        <p>Simple way for selling your unused products, or</p>
        <p>getting a deal on products you want!</p>
      </div>

      <div className='landing_button_container'>
        <NavLink to={'signup'}>
          <button className='landing_button'>Start Bidding</button>
        </NavLink>
      </div>  

      <div className='landing_img_container'>
        <img className='landing_img_mobile' src={Auctions_landing_mobile} alt='auctions_mobile'/>
        <img className='landing_img' src={Auctions_landing} alt='auctions'/>
      </div>
    </div>
  )
}

export default LandingPage