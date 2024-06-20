import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Time from '../assets/images/Time.png';
import no_image from '../assets/images/no_image.png';
import '../assets/styles/auctions.css'

const Auctions = () => {
  const user = useSelector((state: any) => state?.user.value)
  const [auctions, setAuctions] = useState([])
  const [auctionImages, setAuctionImages] = useState<Record<number, string | null>>({});

  useEffect(() => {
    fetchAuctionsAndImages();
  }, []);

  const fetchAuctionsAndImages = async () => {
    try {
      const auctionResponse = await axios.get('auctions');
      const fetchedAuctions = auctionResponse.data;
      const auctionsWithImages = fetchedAuctions.filter((auction: any) => auction.image);
      const imagePromises = auctionsWithImages.map((auction: any) => {
        return GetImage(auction.auction_id);
      });
      const images = await Promise.all(imagePromises);
      const auctionImagesMap: Record<number, string | null> = {};
      auctionsWithImages.forEach((auction: any, index: number) => {
        auctionImagesMap[auction.auction_id] = images[index];
      });
      setAuctions(fetchedAuctions);
      setAuctionImages(auctionImagesMap);
    } catch (error) {
      console.error("Error fetching auctions and images:", error);
    }
  }

  async function GetImage(auctionId: number) {
    try {
      const response = await axios.get(`/auctions/image/${auctionId}`, {
        responseType: 'blob',
      });
      if (response.status === 200) {
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl
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
        <p className={`auctions_status ${getStatusColor(userBidStatus)}`}>{userBidStatus}</p>
    )
  }

  const renderNoAuctions = () => {
    return  (
    <div className='auctions_subheader_container'>
      <h2 className='auctions_subheader'>Oh no, no auctions yet!</h2>
      <p className='auctions_subheader_text'>To add new auction click "+" button in <br/>
         navigation bar or wait for other users <br/>
         to add new auctions.</p>
    </div>
    )
  }

  const renderAuctions = () => {
    return auctions.map((auction: any) => {
      const auctionImage = auctionImages[auction.auction_id] || null;

      const endTime = new Date(auction.endedAt).getTime();
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
          remainingTimeString = '<1m';
      }
      return (
        <NavLink to={`/auction/${auction.auction_id}`} key={auction.auction_id}>
          <div className='auctions_card'>
            <div className='auctions_content'>
              <div className='auctions_status_container'>
              <AuctionStatus auction={auction} />
                <div className={`auctions_time_container ${remainingTime < (24 * 60 * 60 * 1000) ? 'red-background' : ''}`}>
                  <p className='auctions_time'>{remainingTimeString}</p>
                  <img className='auctions_time_img' src={Time} alt="time_remaining" />
                </div>
              </div>
              <p className='auctions_title'>{auction.title}</p>
              <p className='auctions_price'>{auction.startingPrice} €</p>
            </div>
            <div className='auctions_image_container'>
              <img className='auctions_image' src={auctionImage || no_image} alt="auction_image" />
            </div>
          </div>
        </NavLink>
      )
    })
  }

  return (
    <div className='auctions_container'>
      <h1 className='auctions_header'>Auctions</h1>
      <div className='auctions_grid'>
      {auctions.length === 0 ? renderNoAuctions() : renderAuctions()}
      </div>
    </div>
  )
}

export default Auctions