import React, { useState } from 'react'
import { HashLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function ProfilePicUpload({ close }) {
    const [preview, setPreview] = useState(null)
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('token');
    const handleUpload = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "knowledge_hub_profile_pics");
        const cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();
        // console.log(data)
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3030";
        const final_res = await fetch(`${backendUrl}/user/profile/changePic`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl: data.url }),
        });
        if (final_res) {
            setLoading(false)
            toast.success("Profile Picture Uploaded Sucessfully")
            close(false);
        }
    }
    const handleChange = (event) => {
        const file_input = event.target.files[0];
        setFile(file_input);
        setPreview(URL.createObjectURL(file_input))
        // console.log(preview)
    }
    return (
        <div className='upload-overlay'>
            <div className="upload-container">

                <div className='upload-box'>
                    {preview ? (
                        <img src={preview} alt="preview" width='150' />
                    ) : <i style={{ fontSize: '5rem' }} class="fa-solid fa-cloud-arrow-up"></i>}
                    <div style={{ flexDirection: 'column',display:loading?'flex':'none' }} className="upload-overlay">
                        <HashLoader size={200} color='purple' className='profile-pic-loader' loading={loading} />
                        <br />
                        <h3>Uploading ...</h3>
                    </div>
                </div>
                <input disabled={loading} className='modern-file-input' onChange={(e) => handleChange(e)} type="file" />
                <button disabled={loading} className='btn-flat btn-red' onClick={() => close(false)}>Cancel</button>
                <button disabled={loading} className='btn-flat btn-green' onClick={handleUpload}> <i class="fa-solid fa-cloud-arrow-up"></i>{loading ? "Uploading" : "Upload"}</button>
            </div>
        </div>
    )
}
