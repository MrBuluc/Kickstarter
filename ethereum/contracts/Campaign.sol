// SPDX-License-Identifier: MIT

pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint min) public {
        address newCampaign = new Campaign(min, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint yesCount;
        uint noCount;
        mapping(address => bool) approvals;
}

    address public manager;
    uint public minContribution;
    mapping(address => bool) public approvers;
    mapping(address => uint) public contributeValues;
    Request[] public requests;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint min, address managerAdd) public {
        manager = managerAdd;
        minContribution = min;
    }

    function contribute() public payable {
        require(msg.value > minContribution);

        approvers[msg.sender] = true;
        approversCount++;
        contributeValues[msg.sender] += msg.value;
    }

    function createRequest(string description, uint value, address recipient) public
        restricted {
            Request memory request = Request({
                description: description,
                value: value,
                recipient: recipient,
                complete: false,
                yesCount: 0,
                noCount: 0});
            requests.push(request);
    }

    function approveRequest(uint requestsIndex) public {
        Request storage request = requests[requestsIndex];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.yesCount += contributeValues[msg.sender];
    }

    function disapproveRequest(uint requestsIndex) public {
        Request storage request = requests[requestsIndex];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.noCount += contributeValues[msg.sender];
    }

    function finalizeRequest(uint requestsIndex) public restricted {
        Request storage request = requests[requestsIndex];
        //require(request.yesCount > (approversCount / 2));
        require(request.yesCount > request.noCount);
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}