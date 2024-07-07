import { ethers } from 'ethers';

export const daysLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);

    return remainingDays.toFixed(0);
  };

  export const calculateBarPercentage = (goal, raisedAmount) => {
    const percentage = Math.round((raisedAmount * 100) / goal);

    return percentage;
  };

  export const checkIfImage = (url, callback) => {
    const img = new Image();
    img.src = url;

    if (img.complete) callback(true);

    img.onload = () => callback(true);
    img.onerror = () => callback(false);
  };

  export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result)
      };
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  };

  export const calculateFundsCollected = (amountCollected, milestoneIndex, milestoneFunds) => {
    const milestoneIdx = Number(milestoneIndex._hex)
    const fundsWithdrawn = milestoneFunds.reduce((acc, milestone, i) => {
      if (i < milestoneIdx) {
        return acc + parseFloat(ethers.utils.formatEther(milestone._hex));
      }
      return acc;
    }, 0);
    const totalFundsCollected = (parseFloat(amountCollected) + fundsWithdrawn).toFixed(2);
    
    return totalFundsCollected;
  }
