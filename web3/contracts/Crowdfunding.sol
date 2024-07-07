// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Crowdfunding {
    struct Campaign {
        address payable owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        bool isActive;
        string image;
        string category;
        uint milestoneIndex;
        string[] milestones;
        uint[] milestoneFunds;
        address[] donators;
        mapping(address => uint256) contributions;
    }

    struct CampaignView {
        address payable owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        bool isActive;
        string image;
        string category;
        uint milestoneIndex;
        string[] milestones;
        uint[] milestoneFunds;
        address[] donators;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberofCampaigns = 0;

    event CampaignCreated(uint256 indexed campaignId, address owner, string title, uint256 target);
    event DonationReceived(uint256 indexed campaignId, address donor, uint256 amount);
    event FundsReleased(uint256 indexed campaignId, uint256 amount);
    event RefundIssued(uint256 indexed campaignId, address donor, uint256 amount);

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string[] memory _milestones,
        uint[] memory _milestoneFunds,
        string memory _category,
        string memory _image
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "The deadline should be a date in the future.");
        require(_milestones.length == _milestoneFunds.length, "Milestones and funds length mismatch.");

        Campaign storage campaign = campaigns[numberofCampaigns];
        campaign.owner = payable(msg.sender);
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.category = _category;
        campaign.isActive = true;
        campaign.milestoneIndex = 0;
        campaign.milestones = _milestones;
        campaign.milestoneFunds = _milestoneFunds;

        numberofCampaigns++;
        emit CampaignCreated(numberofCampaigns - 1, msg.sender, _title, _target);

        return numberofCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        require(campaign.isActive, "Campaign is not active.");
        require(block.timestamp < campaign.deadline, "The campaign has ended.");
        campaign.amountCollected += msg.value;

        if (campaign.contributions[msg.sender] == 0) {
            campaign.donators.push(msg.sender);
        }

        campaign.contributions[msg.sender] += msg.value;
        emit DonationReceived(_id, msg.sender, msg.value);
    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[_id];
        uint256 donatorCount = campaign.donators.length;

        address[] memory donators = new address[](donatorCount);
        uint256[] memory donations = new uint256[](donatorCount);

        for (uint256 i = 0; i < donatorCount; i++) {
            address donator = campaign.donators[i];
            donators[i] = donator;
            donations[i] = campaign.contributions[donator];
        }

        return (donators, donations);
    }

    function getCampaigns() public view returns (CampaignView[] memory) {
        CampaignView[] memory allCampaigns = new CampaignView[](numberofCampaigns);

        for (uint256 i = 0; i < numberofCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = CampaignView({
                owner: item.owner,
                title: item.title,
                description: item.description,
                target: item.target,
                deadline: item.deadline,
                amountCollected: item.amountCollected,
                isActive: item.isActive,
                image: item.image,
                category: item.category,
                milestoneIndex: item.milestoneIndex,
                milestones: item.milestones,
                milestoneFunds: item.milestoneFunds,
                donators: item.donators
            });
        }

        return allCampaigns;
    }

    function editCampaign(uint256 _id, string memory _title, string memory _description, uint256 _deadline, string memory _image) public {
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner == msg.sender, "Only the creator can edit the campaign.");
        campaign.title = _title;
        campaign.description = _description;
        campaign.deadline = _deadline;
        campaign.image = _image;
    }

    function updateStatus(uint256 _id, bool newStatus) public {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only the creator can update the status.");
        campaign.isActive = newStatus;
    }

    function releaseFunds(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only the creator can release funds.");
        require(campaign.amountCollected >= campaign.milestoneFunds[campaign.milestoneIndex], "Insufficient funds for this milestone.");

        uint256 fundsToRelease = campaign.milestoneFunds[campaign.milestoneIndex];
        campaign.amountCollected -= fundsToRelease;
        campaign.owner.transfer(fundsToRelease);
        campaign.milestoneIndex++;
        emit FundsReleased(_id, fundsToRelease);
    }

    function requestRefund(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp < campaign.deadline, "The campaign deadline has passed.");
        require(campaign.milestoneIndex < campaign.milestones.length, "The campaign goal is already met.");
        require(campaign.isActive, "The campaign is not active.");

        uint256 contribution = campaign.contributions[msg.sender];
        require(contribution > 0, "No contributions found.");

        campaign.contributions[msg.sender] = 0;
        campaign.amountCollected -= contribution;
        payable(msg.sender).transfer(contribution);
        emit RefundIssued(_id, msg.sender, contribution);
    }
}
