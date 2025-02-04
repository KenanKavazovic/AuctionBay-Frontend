import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Time from '../assets/images/Time.png';
import no_image from '../assets/images/no_image.png';
import '../assets/styles/profile.css'

const ProfileBidding = () => {
  const user = useSelector((state: any) => state?.user.value)
  const [bids, setBids] = useState([]);
  const [bidImages, setBidImages] = useState<Record<number, string | null>>({});
  
  useEffect(() => {
      fetchBidsAndImages();
  }, []);
  
  const fetchBidsAndImages = async () => {
      try {
          const bidResponse = await axios.get(`bids/user/${user.user_id}`);
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
  };
  
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

  const AuctionStatus = ({ auction }: { auction: any }) => {
    const [userBidStatus, setUserBidStatus] = useState('');
  
    useEffect(() => {
      checkUserBidStatus();
    }, []);
  
    const checkUserBidStatus = async () => {
      try {
        const bidResponse = await axios.get(`bids/auction/${auction.auction_id}`);
        const userBid = bidResponse.data.find((bid: any) => bid.user_id === user.user_id);
        if (userBid) {
          setUserBidStatus(userBid.status);
        } else {
          setUserBidStatus('In progress');
        }
      } catch (error) {
        console.error("Error fetching user bid status:", error);
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Winning':
          return 'green-background';
        case 'Outbid':
          return 'red-background';
        case 'In progress':
          return 'yellow-background';
        default:
          return '';
      }
    }
  
    return (
        <p className={`profile_auctions_status ${getStatusColor(userBidStatus)}`}>{userBidStatus}</p>
    )
  }

  const renderNoAuctions = () => {
    return  (
    <div className='profile_subheader_container'>
      <h2 className='profile_subheader'>No bidding in progress!</h2>
      <p className='profile_subheader_text'>
        Start bidding by finding new items you
        like on the "Auctions" page!
      </p>
    </div>
    )
  }
  
  const renderAuctions = () => {
    const uniqueAuctionsMap = new Map();
    bids.forEach((bid: any) => {
        if (!uniqueAuctionsMap.has(bid.Auction.auction_id)) {
            uniqueAuctionsMap.set(bid.Auction.auction_id, bid);
        }
    });
    const uniqueBids = Array.from(uniqueAuctionsMap.values());
    return uniqueBids.map((bid: any) => {
      const auctionImage = bidImages[bid.auction_id] || null;

      const endTime = new Date(bid.Auction.endedAt).getTime();
      const currentTime = new Date().getTime();
      let remainingTime = endTime - currentTime;

      let days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

      let remainingTimeString = '';
      if (days > 0) {
          remainingTimeString = `${days}d`;
      } else if (hours > 0) {
          remainingTimeString = `${hours}h`;
      } else if (minutes > 0) {
          remainingTimeString = `${minutes}m`;
      } else {
          remainingTimeString = '<1m'
      }
      return (
        <NavLink to={`/auction/${bid.Auction.auction_id}`} key={bid.Auction.auction_id}>
          <div className='profile_auctions_card'>
            <div className='profile_auctions_content'>
              <div className='profile_auctions_status_container'>
              <AuctionStatus auction={bid} />
                <div className={`profile_auctions_time_container ${remainingTime < (24 * 60 * 60 * 1000) ? 'red-background' : ''}`}>
                  <p className='profile_auctions_time'>{remainingTimeString}</p>
                  <img className='profile_auctions_time_img' src={Time} alt="time_remaining" />
                </div>
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
      <h1 className='profile_header'>Hi, {user.firstName}  {user.lastName}</h1>
      <div className='profile_button_container'>
        <NavLink to={`/profile/myauctions`}>
          <button className='profile_white_button'>My Auctions</button>
        </NavLink>
        <NavLink to={`#`}>
          <button  className='profile_black_button'>Bidding</button>
        </NavLink>
        <NavLink to={`/profile/won`}>
          <button  className='profile_white_button'>Won</button>
        </NavLink>
      </div>
      <div className='profile_grid'>
      {bids.length == 0 ? renderNoAuctions() : renderAuctions()}
      </div>
    </div>
  )
}

export default ProfileBidding