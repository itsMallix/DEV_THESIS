// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract StakingBaru2 {
    address public rewardToken;
    address public stakingToken;
    address public admin;
    uint80 public timeUnit;
    uint256 public rewardRatioNumerator;
    uint256 public rewardRatioDenominator;

    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public stakingTimestamps;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardDeposited(uint256 amount);
    event RewardWithdrawn(uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    constructor(
        address _rewardToken,
        address _stakingToken,
        uint80 _timeUnit,
        uint256 _rewardRatioNumerator,
        uint256 _rewardRatioDenominator
    ) {
        admin = msg.sender;
        rewardToken = _rewardToken;
        stakingToken = _stakingToken;
        timeUnit = _timeUnit;
        rewardRatioNumerator = _rewardRatioNumerator;
        rewardRatioDenominator = _rewardRatioDenominator;
    }

    function stake(uint256 _amount) external {
        require(_amount > 0, "Cannot stake 0");

        // Transfer staking token from user to this contract
        require(IERC20(stakingToken).transferFrom(msg.sender, address(this), _amount), "Staking transfer failed");

        stakedBalances[msg.sender] += _amount;
        stakingTimestamps[msg.sender] = block.timestamp;

        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) external {
        require(stakedBalances[msg.sender] >= _amount, "Insufficient staked balance");

        stakedBalances[msg.sender] -= _amount;

        // Transfer staking token back to user
        require(IERC20(stakingToken).transfer(msg.sender, _amount), "Unstaking transfer failed");

        emit Unstaked(msg.sender, _amount);
    }

    function claimRewards() external {
        require(stakedBalances[msg.sender] > 0, "No staked tokens");

        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No reward to claim");

        stakingTimestamps[msg.sender] = block.timestamp;

        // Transfer reward token to user
        require(IERC20(rewardToken).transfer(msg.sender, reward), "Reward transfer failed");

        emit RewardClaimed(msg.sender, reward);
    }

    function depositRewardTokens(uint256 _amount) external onlyAdmin {
        require(_amount > 0, "Amount must be greater than zero");

        // Transfer reward token from admin to this contract
        require(IERC20(rewardToken).transferFrom(msg.sender, address(this), _amount), "Reward deposit failed");

        emit RewardDeposited(_amount);
    }

    function withdrawRewardTokens(uint256 _amount) external onlyAdmin {
        // Transfer reward token back to admin
        require(IERC20(rewardToken).transfer(msg.sender, _amount), "Reward withdraw failed");

        emit RewardWithdrawn(_amount);
    }

    function calculateReward(address _user) public view returns (uint256) {
        uint256 stakingDuration = block.timestamp - stakingTimestamps[_user];
        return (stakedBalances[_user] * stakingDuration * rewardRatioNumerator) /
            (timeUnit * rewardRatioDenominator);
    }

    function getStakeInfo(address _user) external view returns (uint256 stakedAmount, uint256 rewardAmount) {
        stakedAmount = stakedBalances[_user];
        rewardAmount = calculateReward(_user);
    }
}
