// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Staking {
    address public rewardToken;
    address public stakingToken;
    address public admin;
    uint256 public rewardTokenBalance;
    uint256 public stakingTokenBalance;
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
        stakedBalances[msg.sender] += _amount;
        stakingTimestamps[msg.sender] = block.timestamp;
        stakingTokenBalance += _amount;
        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) external {
        require(stakedBalances[msg.sender] >= _amount, "Insufficient staked balance");
        stakedBalances[msg.sender] -= _amount;
        stakingTokenBalance -= _amount;
        emit Unstaked(msg.sender, _amount);
    }

    function claimRewards() external {
        require(stakedBalances[msg.sender] > 0, "No staked tokens");
        uint256 reward = calculateReward(msg.sender);
        require(reward <= rewardTokenBalance, "Not enough rewards");
        rewardTokenBalance -= reward;
        stakingTimestamps[msg.sender] = block.timestamp;
        emit RewardClaimed(msg.sender, reward);
    }

    function depositRewardTokens(uint256 _amount) external onlyAdmin {
        require(_amount > 0, "Amount must be greater than zero");
        rewardTokenBalance += _amount;
        emit RewardDeposited(_amount);
    }

    function withdrawRewardTokens(uint256 _amount) external onlyAdmin {
        require(_amount <= rewardTokenBalance, "Not enough reward tokens");
        rewardTokenBalance -= _amount;
        emit RewardWithdrawn(_amount);
    }

    function calculateReward(address _user) internal view returns (uint256) {
        uint256 stakingDuration = block.timestamp - stakingTimestamps[_user];
        return (stakedBalances[_user] * stakingDuration * rewardRatioNumerator) /
            (timeUnit * rewardRatioDenominator);
    }

    function getStakeInfo(address _user) external view returns (uint256 stakedAmount, uint256 rewardAmount) {
        stakedAmount = stakedBalances[_user];
        rewardAmount = calculateReward(_user);
    }
}
