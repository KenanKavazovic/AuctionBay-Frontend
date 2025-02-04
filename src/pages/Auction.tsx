import React, { FormEvent, useEffect, useState } from 'react'
import { AuctionInterface } from '../interfaces/Auction.interface';
import { PostRequest } from '../services/PostRequest.service';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Time from '../assets//images/Time.png';
import Time_white from '../assets//images/Time_white.png';
import Eur from '../assets/images/Eur.png';
import no_image from '../assets/images/no_image.png';
import Avatar_blank from '../assets/images/Avatar_blank.png';
import axios from 'axios';
import '../assets/styles/auction.css'

const Auction = () => {
    const user = useSelector((state: any) => state?.user.value)
    const { auctionId } = useParams();
    const [auctionStatus, setAuctionStatus] = useState('In progress');
    const [bids, setBids] = useState([]);
    const [auction, setAuction] = useState<AuctionInterface | null>(null);
    const [auctionImage, setAuctionImage] = useState<string | null>(null)
    const [bidderAvatars, setBidderAvatars] = useState<Record<number, string | null>>({});
    const [errorMessage, setErrorMessage] = useState('');
    const minimumBidAllowed = Math.max(...(bids as { amount: number }[]).map(bid => bid.amount))+1

    const endTime = auction?.endedAt ? new Date(auction.endedAt).getTime() : 0;
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
    } else if (remainingTime <= 0) {
        remainingTimeString = `Done`
    } else {
        remainingTimeString = '<1m';
    }

    useEffect(() => {
        GetAuction();
        GetBidsOfAuction();
      }, []);

    const GetAuction = async () => {
      try {
        const res = await axios.get(`auctions/auction/${auctionId}`);
        setAuction(res.data);
        if (res.data.image) {
            GetImage(res.data.auction_id);
        }
        }
        catch (err) {
        console.log(err);
        }
    }
      
    const GetBidsOfAuction = async () => {
        try {
          const res = await axios.get(`bids/auction/${auctionId}`);
          const allBids = res.data;
          const sortedBids = allBids.sort((a: any, b: any) => b.amount - a.amount);
          const highestBid = sortedBids.length > 0 ? sortedBids[0] : null;
        if (highestBid != 0 && highestBid.user_id === user.user_id) {
            setAuctionStatus('Winning')
        } else {
            setAuctionStatus('Outbid')
        }
        const biddersWithAvatars = allBids.filter((bid: any) => bid.User.avatar);
        const avatarPromises = biddersWithAvatars.map((bid: any) => {
          return GetAvatar(bid.User.user_id);
        });
        const avatars = await Promise.all(avatarPromises);
        const bidderAvatarsMap: Record<number, string | null> = {};
        biddersWithAvatars.forEach((bid: any, index: number) => {
        bidderAvatarsMap[bid.User.user_id] = avatars[index];
        });
          setBids(res.data);
          setBidderAvatars(bidderAvatarsMap)
          }
          catch (err) {
          console.log(err);
          }
    }

    async function GetImage(auctionId: string) {
        try {
            const response = await axios.get(`/auctions/image/${auctionId}`, {
                responseType: 'blob',
            });
            if (response.status === 200) {
                const imageUrl = URL.createObjectURL(response.data);
                setAuctionImage(imageUrl)
            } else {
                console.error('Failed to fetch auction image.');
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    async function GetAvatar(userId: number) {
          try {
            const response = await axios.get(`/users/avatar/${userId}`, {
              responseType: 'blob',
            });
            if (response.status === 200) {
              const imageUrl = URL.createObjectURL(response.data);
              return imageUrl;
            } else {
              console.error('Failed to fetch avatar image.');
              return Avatar_blank;
            }
          } catch (error) {
            console.error('Error:', error);
            return Avatar_blank;
          }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const bidData = {
            amount: formData.get('bid'),
          }
        if(auction?.user_id === user.user_id) {
            setErrorMessage("You can't bid on your own auction!")
            return
        }
        try {
            await PostRequest(`bids/auctions/${auctionId}/bid`, bidData);
            window.location.reload();
        } catch(error: any) {
            console.error("Error submitting bid:", error);

            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    }

    const renderBidders = () => {
        return bids.map((bid: any, index: number) => {
            const userAvatar = bidderAvatars[bid.User.user_id] || null;

            const date = new Date(bid.createdAt);
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
            const formattedDate = `${hours}:${minutes} ${day}.${month}.${year}`

                return(
                    <div key={bid.bid_id}>
                        <div className='auction_bids_details'>
                            <div className='auction_bids_details_left'>
                                <img className='auction_bids_image' src={userAvatar || Avatar_blank} alt="bidderAvatar" />
                            </div>
                            <div className='auction_bids_details_center'>
                            <p className='auction_bids_name'>{bid.User.firstName + ' ' + bid.User.lastName}</p>
                            <p className='auction_bids_time'>{formattedDate}</p>

                            </div>
                            <div className='auction_bids_details_right'>
                                <p className='auction_bids_amount'>{bid.amount}</p>
                                <img className='auction_bids_euro_icon' src={Eur} alt="euro" />
                            </div>
                        </div>
                    </div>
                )
        })
    }

    const renderNoBidders = () => {
        return (
            <div>
                <h5 className='auction_no_bids_header'>No bids yet!</h5>
                <p className='auction_no_bids_text'>Place your bid to have a chance to get this item.</p>
            </div>
        )
    }

  return (
    <div className='auction_container'>
        <div className='auction_image_container'>
            <img className='auction_image' src={auctionImage ? auctionImage : no_image} alt="auctionImage" />
        </div>
        <div className='auction_content'>
            <div className='auction_information_container'>
                <div className='auction_status_container'>
                    <p className={`auction_status_text ${remainingTime <= 0 ? 'black-background' : auctionStatus === 'Winning' ? 'green-background' : auctionStatus === 'Outbid' ? 'red-background' : 'yellow-background' }`}>{remainingTime <= 0 ? 'Done' : auctionStatus}</p>
                    <div className={`auction_status_time_container ${remainingTime <= 0 ? 'black-background' :  remainingTime < (24 * 60 * 60 * 1000) ? 'red-background' : ''}`}>
                        <p className='auction_status_time_left'>{remainingTimeString}</p>
                        <img className='auction_status_time_icon' src={remainingTime <= 0 ? Time_white :Time} alt="timeIcon" />
                    </div>
                </div>

                <h1 className='auction_title'>{auction?.title}</h1>
                <p className='auction_description'>{auction?.description}</p>
                
                <form onSubmit={handleSubmit}>
                    <div className='auction_form_container'>
                        <p className='auction_warning_message'>{errorMessage}</p>
                        <label className='auction_bid_label'>Bid: </label>
                        <input type="number" name="bid" className='auction_bid_input' required min={minimumBidAllowed >1 ? minimumBidAllowed : auction?.startingPrice} defaultValue={minimumBidAllowed >1 ? minimumBidAllowed : auction?.startingPrice} />
                        <button type='submit' className='auction_yellow_button'>Place bid</button>
                    </div>
                </form>
            </div>
            <div className='auction_bids_container'>
                <h4 className='auction_bids_header'>Bidding history({bids.length})</h4>
                {bids.length > 0 ? renderBidders() : renderNoBidders()}
            </div>
        </div>
    </div>
  )
}

export default Auction