import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorProfile, updateProfilePicture } from '../Actions/doctorActions';
import Cropper from 'react-easy-crop';
import { FaCamera } from 'react-icons/fa';
import { getCroppedImage } from '../utils/cropmage'; // Import the cropping utility
import '../styles/doctorprofile.css'; // Import the CSS file

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { doctor, loading, error } = useSelector(state => state.doctor);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user'); // Retrieve user data from local storage
    if (user) {
      const parsedUser = JSON.parse(user); // Parse the JSON string
      const doctorId = parsedUser.id; // Extract the doctor ID
      console.log('Doctor ID:', doctorId); // Log the doctor ID
      dispatch(fetchDoctorProfile(doctorId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (doctor) {
      console.log('Profile Image URL:', doctor.profile_image);
    }
  }, [doctor]);

  const handlePhotoChange = async () => {
    if (!newProfileImage) return;

    const croppedImage = await getCroppedImage(previewImage, croppedAreaPixels);

    const formData = new FormData();
    formData.append('profileImage', croppedImage, 'cropped.jpg'); // Provide a filename

    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const doctorId = parsedUser.id;

    dispatch(updateProfilePicture(doctorId, formData));
    setShowPopup(false); // Close the popup
    setPreviewImage(null); // Clear the preview image
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setShowPopup(true); // Show the cropping popup
    }
  };

  const handleCancel = () => {
    setShowPopup(false); // Close the popup
    setPreviewImage(null); // Clear the preview image
    setNewProfileImage(null); // Clear the new profile image
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  const profileImageUrl = doctor && doctor.profile_image ? `http://localhost:5000${doctor.profile_image}` : `${process.env.PUBLIC_URL}/profile.png`;

  return (
    <div className="container">
      <h1>Profile</h1>
      {doctor && (
        <div className="profile-details">
          <div className="profile-image-container">
            <img 
              src={profileImageUrl} 
              alt="Profile" 
              className="profile-image" 
            />
            <div className="overlay" onClick={() => setShowPopup(true)}>
              <FaCamera className="camera-icon" />
            </div>
          </div>
          <p><strong>Name:</strong> {doctor.name}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Doctor ID:</strong> {doctor.doctor_id}</p>
          <p><strong>Experience:</strong> {doctor.experience}</p>
          <p><strong>Hospital:</strong> {doctor.hospital}</p>
          <p><strong>Specialist In:</strong> {doctor.specialist_in}</p>
        </div>
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Change Profile Photo</h2>
            {previewImage && (
              <div className="crop-container">
                <Cropper
                  image={previewImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}
            <input 
              type="file" 
              onChange={handleFileChange} 
            />
            {previewImage && (
              <button onClick={handlePhotoChange}>Upload Photo</button>
            )}
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
