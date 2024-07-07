import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

import { useStateContext } from '../context';
import { money, add, remove } from '../assets';
import moment from 'moment';
import { CustomButton, FormField, Loader } from '../components';

function EditCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { editCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: state.owner,
    title: state.title,
    description: state.description,
    deadline: moment(new Date(state.deadline)).format("YYYY-MM-DD"),
    mileStones: state.milestones.map((milestone, index) => ({
      name: milestone,
      funds: ethers.utils.formatEther(state.milestoneFunds[index]._hex)
    })),
    category: state.category,
    image: state.image
  });

  useEffect(() => {
    console.log(form);
  }, [form])

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const urlParts = location.pathname.split('/');
    const pId = urlParts[2];
    await editCampaign(pId, { ...form });
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && <Loader />}
      <Toaster position="bottom-center" />
      <div className='flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]'>
        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>Edit Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className='w-full mt-[65px] flex flex-col gap-[30px]'>
        <div className='flex md:flex-nowrap flex-wrap gap-[40px]'>
          <FormField
            labelName="Your Id *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            disabled={true}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <div className='w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]'>
          <img src={money} alt='money' className='w-[40px] h-[40px] object-contain' />
          <h4 className='font-epilogue font-bold text-[25px] text-white ml-[20px]'>You will get 100% of the raised amount</h4>
        </div>

        {form.mileStones.map((milestone, index) => (
          <div key={index} className='flex flex-wrap md:flex-nowrap gap-[25px] items-center'>
            <FormField
              labelName="Milestone Description *"
              placeholder="Enter a milestone description"
              inputType="text"
              value={milestone.name}
              disabled={true}
            />
            <FormField
              labelName="Milestone Funds *"
              placeholder="ETH 0.50"
              inputType="text"
              value={milestone.funds}
              disabled={true}
            />
          </div>
        ))}

        <div className='flex flex-wrap md:flex-nowrap gap-[40px]'>
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
          <FormField
            labelName="Campaign Category *"
            placeholder="Select a category"
            inputType="select"
            value={form.category}
            disabled={true}
            handleChange={(e) => handleFormFieldChange('category', e)}
            options={[
              { value: '', label: 'Select a category' },
              { value: 'Art', label: 'Art' },
              { value: 'Technology', label: 'Technology' },
              { value: 'Social Cause', label: 'Social Cause' },
              { value: 'Others', label: 'Others' },
            ]}
          />
        </div>
        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Save Changes"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
}

export default EditCampaign;
