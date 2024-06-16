import React, { useState, useEffect } from 'react'
import { useStateContext } from '../context'
import { DisplayCampaigns } from '../components';
import profileStore from '../store/profileStore';

function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [profile, setProfile] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);

  const { address, connect, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  useEffect(() => {
    const loadProfile = async () => {
      await profileStore.init();
      if (address) {
        const userProfile = await profileStore.getProfile(address);
        if (userProfile) {
          setProfile(userProfile);
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, [address]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address) {
      await profileStore.setProfile(address, profile);
      alert('Profile updated successfully');
    } else {
      alert('Please connect your wallet');
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Bio:</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Save Profile</button>
          <DisplayCampaigns
            title="All Campaigns"
            isLoading={isLoading}
            campaigns={campaigns}
          />
        </form>
      )}
    </div>
  )
}

export default Profile
