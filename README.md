# CollabFund

This project is a decentralized crowdfunding platform built using Solidity for the smart contract, Thirdweb for deployment and interaction, and a React frontend. The platform allows users to create campaigns, donate to campaigns, and manage campaign funds based on predefined milestones.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Smart Contract](#smart-contract)
- [Frontend](#frontend)
- [Server](#server)
- [License](#license)

## Features

- **Create Campaigns**: Users can create new campaigns with a title, description, target amount, deadline, milestones, and categories.
- **Donate to Campaigns**: Users can donate to active campaigns.
- **Milestone-based Fund Release**: Campaign owners can release funds based on achieving milestones.
- **Campaign Management**: Users can edit campaign details and update campaign status.
- **Refund Requests**: Donors can request refunds if the campaign has not met its goal.

## Technologies Used

- **Solidity**: Smart contract language
- **Thirdweb**: Deployment and interaction with smart contracts
- **React**: Frontend framework
- **Node.js & Express**: Backend server for storing user profiles

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MetaMask or any other Ethereum wallet

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/ThatsRajeev/CollabFund.git
    ```

2. Navigate to the project directory:
    ```sh
    cd CollabFund
    ```

3. Install dependencies for both frontend and backend:
    ```sh
    npm install
    ```

### Running the Application

1. Start the backend server:
    ```sh
    npm run server
    ```

2. Start the React frontend:
    ```sh
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000`

## Smart Contract

The smart contract is written in Solidity and includes the following functionalities:

- **createCampaign**: Allows users to create a new campaign.
- **donateToCampaign**: Allows users to donate to a campaign.
- **getDonators**: Returns a list of all donators and their contributions for a campaign.
- **getCampaigns**: Returns all campaigns.
- **editCampaign**: Allows campaign owners to edit their campaign details.
- **updateStatus**: Allows campaign owners to update the status of their campaign.
- **releaseFunds**: Allows campaign owners to release funds based on milestones.
- **requestRefund**: Allows donators to request refunds if the campaign has not met its goal.

The smart contract is deployed using Thirdweb and interacts with the frontend to provide a seamless user experience.

## Frontend

The frontend is built using React and leverages Thirdweb for interacting with the smart contract. It includes components for:

- **Campaign Creation**: Form to create a new campaign.
- **Campaign Dashboard**: Display all active campaigns.
- **Campaign Details**: View detailed information about a specific campaign and donate to it.
- **Profile Management**: Users can manage their profile information.

## Server

The backend server is built using Node.js and Express. It stores user profiles and interacts with the frontend to provide user-specific data.

## License

This project is licensed under the MIT License.
