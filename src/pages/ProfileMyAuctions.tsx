import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Time from '../assets/images/Time.png';
import Delete from '../assets/images/Delete.png';
import Edit from '../assets/images/Edit.png';
import no_image from '../assets/images/no_image.png';
import EditAuction from '../components/Auction/EditAuction';
import '../assets/styles/profile.css'

const ProfileMyAuctions = () => {
  const user = useSelector((state: any) => state?.user.value)
  const [auctions, setAuctions] = useState([])
  const [auctionImages, setAuctionImages] = useState<Record<number, string | null>>({});

  useEffect(() => {
    fetchAuctionsAndImages();
  }, []);

  const fetchAuctionsAndImages = async () => {
    try {
      const auctionResponse = await axios.get(`auctions/user/${user.user_id}`);
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

  const DeleteAuction = async (auctionId: number) => {
    try {
      const res = await axios.delete(`auctions/${auctionId}`);
      window.location.reload();
    } catch (err) {
      console.log(err)
    }
  }

  const renderNoAuctions = () => {
    return  (
    <div className='profile_subheader_container'>
      <h2 className='profile_subheader'>Oh no, no auctions added!</h2>
      <p className='profile_subheader_text'>
        To add a new auction, click the "+" button in
        the navigation bar and new auctions will be added here!
      </p>
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
          remainingTimeString = ''
      }
      return (
          <div className='profile_auctions_card' key={auction.auction_id}>
            <NavLink to={`/auction/${auction.auction_id}`}>
            <div className='profile_auctions_content'>
              <div className='profile_auctions_status_container'>
              <p className={`profile_auctions_status ${remainingTimeString == '' ? 'black-background' : 'yellow-background' }`}>{remainingTimeString == '' ? 'Done' : 'In progress'}</p>
                <div className={`profile_auctions_time_container ${remainingTime < (24 * 60 * 60 * 1000) && remainingTime >=0 ? 'red-background' : ''}`}>
                  <p className='profile_auctions_time'>{remainingTimeString}</p>
                  {remainingTimeString == '' ? <></> :                
                  <img className='profile_auctions_time_img' src={Time} alt="time_remaining" />}
                </div>
              </div>
              <p className='profile_auctions_title'>{auction.title}</p>
              <p className='profile_auctions_price'>{auction.startingPrice} €</p>
            </div>
            <div className='profile_auctions_image_container'>
              <img className='profile_auctions_image' src={auctionImage || no_image} alt="auction_image" />
            </div>
            </NavLink>
            <div className='profile_auctions_button_container'>
            {remainingTime >=0 ? <>
              <button className='profile_auctions_delete_button' onClick={() => {DeleteAuction(auction.auction_id)}}><img src={Delete} alt="delete" /></button>
              <button className={`profile_auctions_edit_button open-edit-auction-popup${auction.auction_id}`}><img src={Edit} alt="edit" />Edit</button>
              <EditAuction auctionId={auction.auction_id} title={auction.title} description={auction.description} endedAt={auction.endedAt} image={auction.image} />
            </> : <></>}
            </div>
          </div>          
      )
    })
  }

  return (
    <div className='profile_container'>
      <h1 className='profile_header'>Hi, {user.firstName}  {user.lastName}</h1>
      <div className='profile_button_container'>
        <NavLink to={`#`}>
          <button className='profile_black_button'>My Auctions</button>
        </NavLink>
        <NavLink to={`/profile/bidding`}>
          <button className='profile_white_button'>Bidding</button>
        </NavLink>
        <NavLink to={`/profile/won`}>
          <button className='profile_white_button'>Won</button>
        </NavLink>
      </div>
      <div className='profile_grid'>
      {auctions.length == 0 ? renderNoAuctions() : renderAuctions()}
      </div>
    </div>
  )
}

export default ProfileMyAuctions