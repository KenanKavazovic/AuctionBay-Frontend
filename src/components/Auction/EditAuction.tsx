import React, { FormEvent, useEffect, useState } from 'react'
import { PatchRequest } from '../../services/PatchRequest.service';
import Time from '../../assets/images/Time.png';
import blank from '../../assets/images/blank.png';
import Delete_white from '../../assets/images/Delete_white.png';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import '../../assets/styles/popup.css'

interface EditAuctionProps {
  auctionId: number
  title: string
  description: string
  endedAt: Date
  image: string
}

const EditAuction: React.FC<EditAuctionProps> = ({auctionId, title, description, endedAt, image}) => {
  const [endDate, setEndDate] = useState(endedAt);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null)
  const [auctionImage, setAuctionImage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const auctionData = {
      title: formData.get('title'),
      description: formData.get('description'),
      endedAt: endDate,
    };
    try {
      await PatchRequest(`auctions/me/auction/${auctionId}`, auctionData);

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
      console.error("Error editing auction:", error);
    }
  }

  async function GetImage() {
    if (image) {
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
    return null;
  }

  const FetchImage = async () => {
    const imageUrl = await GetImage();
    setAuctionImage(imageUrl);
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
      FetchImage();
  }, [selectedFile])

  useEffect(() => {
    const modal: any = document.querySelector(`.edit-auction-popup${auctionId}`)
    const openModal: any = document.querySelectorAll(`.open-edit-auction-popup${auctionId}`)
    const closeModal: any = document.querySelector(`.close-edit-auction-popup${auctionId}`)

    if(modal && openModal && closeModal){
      openModal.forEach((button: any) => {
        button.addEventListener('click', () => {
          modal.showModal();
        })
      })
  
      closeModal.addEventListener('click', () => {
        modal.close();
      })
    }
  }, []);

  return (
    <dialog className={`edit-auction-popup edit-auction-popup${auctionId}`}>
    <h1 className='popup_header'>Edit auction</h1>
    <form onSubmit={handleSubmit}>
      <div className='popup_image_container'>
      {preview || auctionImage ? 
          <> <img className='popup_auction_image' src={preview ? preview : auctionImage ? auctionImage : blank} alt="auctionImage" />
             <button type='button' className='popup_remove_button' onClick={() => { setPreview(null); setAuctionImage(null) }}><img src={Delete_white} alt="remove" /></button> </> 
          : 
          <> <button type='button' className='popup_white_button' onClick={uploadFile}>Add image</button>
             <input id="imageUpload" hidden type="file" name='file' accept=".png, .jpg, .jpeg" onChange={handleFileChange}/> </>
          }
      </div>

      <div className='popup_content'>
        <label className='popup_label_title'>Title</label>
        <input type="text" name="title" className='popup_input_title' required defaultValue={title} />

        <label className='popup_label_description'>Description</label>
        <textarea name="description" className='popup_input_description' cols={30} rows={10} maxLength={200} defaultValue={description}></textarea>

        <p className='popup_edit_label_date'>End date</p> 
        <DatePicker
          selected={endDate}
          onChange={handleDateChange}
          className="popup_edit_input_endDate"
          dateFormat="dd.MM.yyyy"
          placeholderText="dd.mm.yyyy"
          showTimeInput
        />
        <img className='popup_edit_time_icon' src={Time} alt="" />
      </div>

      <div className='popup_edit_button_container'>
        <button type='button' className={`popup_white_edit_auction_button close-edit-auction-popup${auctionId}`}>Discard changes</button>
        <button type='submit' className={`popup_black_button close-edit-auction-popup${auctionId}`}>Edit auction</button>
      </div>        
    </form>
</dialog>
  )
}

export default EditAuction