import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from '../context';
import { DisplayCampaigns, CustomButton, FormField, Loader } from '../components';
import toast, { Toaster } from 'react-hot-toast';

import { avatar as defaultAvatar } from '../assets';
import { convertToBase64 } from '../utils';

function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [profile, setProfile] = useState({ name: '', bio: '', email: '', avatar: '' });
  const [isEditing, setIsEditing] = useState(false);

  const { address, connect, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  const fetchUserInfo = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/${address}`);
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setUserInfo = async (userInfo) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/${address}`, userInfo);
      console.log(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
    if (address) fetchUserInfo();
  }, [address, contract]);

  const handleFormFieldChange = (fieldName, e) => {
    setProfile({...profile, [fieldName]: e.target.value })
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setProfile((prevProfile) => ({ ...prevProfile, avatar: base64 }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address) {
      await setUserInfo(profile);
      setIsEditing(false);
    } else {
      toast.error('Please connect your wallet');
    }
  };

  return (
    <div className="bg-[#1c1c24] flex flex-col md:flex-row rounded-[10px] sm:p-10 p-4 gap-[40px]">
      <Toaster position="bottom-center" />
      <div className="p-4 rounded-lg w-full md:w-1/3">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[30px]">
            <div className="flex flex-col items-center gap-4">
              <img
                src={profile.avatar || defaultAvatar}
                alt="Avatar"
                className="w-36 h-36 rounded-full mb-4"
              />
              {isEditing && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="file_input">Upload file</label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300
                    rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help" id="file_input" type="file"
                    onChange={handleAvatarChange}
                  />
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
                    SVG, PNG, JPG or GIF (MAX. 1MB).</p>
                </div>
              )}
            </div>
            <FormField
              labelName="Your Name"
              placeholder="John Doe"
              inputType="text"
              value={profile.name}
              handleChange={(e) => {handleFormFieldChange('name', e)}}
              disabled={!isEditing}
              name="name"
            />
            <FormField
              labelName="Bio"
              placeholder="Write your bio"
              isTextArea
              value={profile.bio}
              handleChange={(e) => {handleFormFieldChange('bio', e)}}
              disabled={!isEditing}
              name="bio"
            />
            <FormField
              labelName="Your Email"
              placeholder="Johndoe@gmail.com"
              inputType="text"
              value={profile.email}
              handleChange={(e) => {handleFormFieldChange('email', e)}}
              disabled={!isEditing}
              name="email"
            />
            <div className="flex justify-center items-center mt-[40px] gap-4">
              <CustomButton
                btnType="reset"
                title={isEditing ? 'Cancel' : 'Edit Profile'}
                handleClick={() => setIsEditing(!isEditing)}
                styles="bg-[#21262d] px-8 w-full"
              />
              {isEditing && (
                <CustomButton
                  btnType="submit"
                  title="Save Profile"
                  handleClick={handleSubmit}
                  styles="bg-[#1dc071] px-8 w-full"
                />
              )}
            </div>
          </form>
        )}
      </div>
      <div className="w-full md:w-2/3">
        <DisplayCampaigns title="Campaigns" isLoading={isLoading} campaigns={campaigns} />
      </div>
    </div>
  );
}

export default Profile;
