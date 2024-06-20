import React, { FormEvent, useEffect, useState } from 'react'
import { PostRequest } from '../../services/PostRequest.service'
import axios from 'axios';
import Time from '../../assets/images/Time.png';
import Eur from '../../assets/images/Eur.png';
import Delete_white from '../../assets/images/Delete_white.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../assets/styles/popup.css'

const CreateAuction = () => {
  const [endDate, setEndDate] = useState(() => new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const auctionData = {
      title: formData.get('title'),
      description: formData.get('description'),
      startingPrice: formData.get('startingPrice'),
      endedAt: endDate,
    }
    try {
      const response = await PostRequest("auctions/me/auction", auctionData);
      const auctionId = response.data.id

      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);
          await axios.post(`/auctions/uploadImage/${auctionId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (error) {
          console.error('Error uploading auction image:', error);
        }
      }

      window.location.reload();
    } catch (error) {
      console.error("Error submitting auction:", error);
    }
  }

  const handleDateChange = (date: Date | null) => {
    if (date !== null) {
      setEndDate(date);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };
  
  const uploadFile = () => {
    document.getElementById('imageUpload')?.click()
  }

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }, [selectedFile])

  useEffect(() => {
    const modal: any = document.querySelector('.create-auction-popup')
    const openModal: any = document.querySelector('.open-create-auction-popup')
    const closeModal: any = document.querySelector('.close-create-auction-popup')

    if(modal && openModal && closeModal){
      openModal.addEventListener('click', () => {
        modal.showModal();
      })
  
      closeModal.addEventListener('click', () => {
        modal.close();
      })
    }
  }, []);

  return (
    <dialog className='create-auction-popup'>
      <h1 className='popup_header'>Add auction</h1>
      <form onSubmit={handleSubmit}>
        <div className='popup_image_container'>
          {preview ? 
          <> <img className='popup_auction_image' src={preview} alt="auction_image" />
             <button type='button' className='popup_remove_button' onClick={() => setPreview(null)}><img src={Delete_white} alt="remove" /></button> </> 
          : 
          <> <button type='button' className='popup_white_button' onClick={uploadFile}>Add image</button>
             <input id="imageUpload" hidden type="file" name='file' accept=".png, .jpg, .jpeg" onChange={handleFileChange}/> </>
          }
        </div>

        <div className='popup_content'>
          <label className='popup_label_title'>Title</label>
          <input type="text" name="title" className='popup_input_title' required placeholder='Write item name here' />

          <label className='popup_label_description'>Description</label>
          <textarea name="description" className='popup_input_description' cols={30} rows={10} maxLength={200} placeholder='Write description here...'></textarea>

          <div className='popup_labels'>
              <p className='popup_label_price'>Starting price</p> 
              <p className='popup_label_date'>End date</p> 
          </div>
          <div className='popup_line_input'>
              <input type="number" min="1" name="startingPrice" className='popup_input_startingPrice' required placeholder='Price' />
              <img className='popup_eur_icon' src={Eur} alt="EUR" />
              <DatePicker
                selected={endDate}
                onChange={handleDateChange}
                className="popup_input_endDate"
                dateFormat="dd.MM.yyyy"
                placeholderText="dd.mm.yyyy"
                showTimeInput
              />
              <img className='popup_time_icon' src={Time} alt="" />
          </div>
        </div>

        <div className='popup_button_container'>
          <button type='button' className="popup_white_auction_button close-create-auction-popup">Cancel</button>
          <button type='submit' className="popup_yellow_button close-create-auction-popup">Start auction</button>
        </div>        
      </form>
  </dialog>
  )
}

export default CreateAuction