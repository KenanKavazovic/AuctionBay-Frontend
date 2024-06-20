import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import no_image from '../assets/images/no_image.png';
import '../assets/styles/profile.css'

const ProfileWon = () => {
  const user = useSelector((state: any) => state?.user.value)
  const [bids, setBids] = useState([])
  const [bidImages, setBidImages] = useState<Record<number, string | null>>({});
  
  useEffect(() => {
      fetchBidsAndImages();
  }, []);
  
  const fetchBidsAndImages = async () => {
      try {
          const bidResponse = await axios.get(`bids/user/won/${user.user_id}`);
          const fetchedBids = bidResponse.data;  
          const bidsWithImages = fetchedBids.filter((bid: any) => bid.Auction.image);  
          const imagePromises = bidsWithImages.map((bid: any) => {
              return GetImage(bid.Auction.auction_id);
          });
          const images = await Promise.all(imagePromises);  
          const bidImagesMap: Record<number, string | null> = {};
          bidsWithImages.forEach((bid: any, index: number) => {
              bidImagesMap[bid.Auction.auction_id] = images[index];
          });  
          setBids(fetchedBids);
          setBidImages(bidImagesMap);
      } catch (error) {
          console.error("Error fetching bids and images:", error);
      }
  }

  async function GetImage(auctionId: number) {
    try {
        const response = await axios.get(`/auctions/image/${auctionId}`, {
            responseType: 'blob',
        });
        if (response.status === 200) {
            const imageUrl = URL.createObjectURL(response.data);
            return imageUrl;
        } else {
            console.error('Failed to fetch auction image.');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

  const renderNoAuctions = () => {
    return  (
    <div className='profile_subheader_container'>
      <h2 className='profile_subheader'>Nothing here yet?</h2>
      <p className='profile_subheader_text'>
        When you win auction items <br/>
        will be displayed here! Go on <br/>
        and bid on your favorite <br />
        items!
      </p>
    </div>
    )
  }

  const renderAuctions = () => {
    return bids.map((bid: any) => {
      const auctionImage = bidImages[bid.auction_id] || null;

      return (
        <NavLink to={`/auction/${bid.Auction.auction_id}`} key={bid.Auction.auction_id}>
          <div className='profile_auctions_card'>
            <div className='profile_auctions_content'>
              <div className='profile_auctions_status_container'>
              <p className={'profile_auctions_status black-background'}>Done</p>
              </div>
              <p className='profile_auctions_title'>{bid.Auction.title}</p>
              <p className='profile_auctions_price'>{bid.Auction.startingPrice} €</p>
            </div>
            <div className='profile_auctions_image_container'>
              <img className='profile_auctions_image' src={auctionImage || no_image} alt="auction_image" />
            </div>
          </div>
        </NavLink>
      )
    })
  }

  return (
    <div className='profile_container'>
      <h1 className='profile_header'>Hello {user.firstName}  {user.lastName} !</h1>
      <div className='profile_button_container'>
        <NavLink to={`/profile/myauctions`}>
          <button className='profile_white_button'>My Auctions</button>
        </NavLink>
        <NavLink to={`/profile/bidding`}>
          <button  className='profile_white_button'>Bidding</button>
        </NavLink>
        <NavLink to={`#`}>
          <button  className='profile_black_button'>Won</button>
        </NavLink>
      </div>
      <div className='profile_grid'>
      {bids.length == 0 ? renderNoAuctions() : renderAuctions()}
      </div>
    </div>
  )
}

export default ProfileWon