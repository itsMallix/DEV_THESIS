// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/access/Ownable.sol";

// interface IERC20 {
//     function totalSupply() external view returns (uint256);
//     function balanceOf(address account) external view returns (uint256);
//     function transfer(address recipient, uint256 amount) external returns (bool);
//     function allowance(address owner, address spender) external view returns (uint256);
//     function approve(address spender, uint256 amount) external returns (bool);
//     function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
//     event Transfer(address indexed from, address indexed to, uint256 value);
//     event Approval(address indexed owner, address indexed spender, uint256 value);
// }

// contract TokenDrop is Ownable {
//     IERC20 public stakingToken;
//     mapping(address => bool) public hasClaimed;

//     event Claimed(address indexed user, uint256 amount);

//     constructor(address _stakingToken) {
//         stakingToken = IERC20(_stakingToken);
//     }

//     function claimToken() external {
//         require(!hasClaimed[msg.sender], "Wallet already claimed");

//         hasClaimed[msg.sender] = true;
//         stakingToken.transfer(msg.sender, 1 * (10 ** 18));

//         emit Claimed(msg.sender, 1 * (10 ** 18));
//     }

//     function depositTokens(uint256 _amount) external onlyOwner {
//         stakingToken.transferFrom(msg.sender, address(this), _amount);
//     }

//     function withdrawTokens(uint256 _amount) external onlyOwner {
//         stakingToken.transfer(msg.sender, _amount);
//     }

//     function getDepositedSupply() external view returns (uint256) {
//         return stakingToken.balanceOf(address(this));
//     }
// }

pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/extension/Ownable.sol";
// import "@thirdwebdev/contracts/extension/Ownable.sol";

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    constructor() {
        _transferOwnership(_msgSender());
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract TokenDrop is Ownable {
    IERC20 public stakingToken;
    mapping(address => bool) public hasClaimed; // Menyimpan status klaim token

    event Claimed(address indexed user, uint256 amount);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    // Fungsi untuk klaim staking token
    function claimToken() external {
        require(!hasClaimed[msg.sender], "You have already claimed");

        hasClaimed[msg.sender] = true;
        stakingToken.transfer(msg.sender, 1 * (10 ** 18)); // Transfer 1 token (dengan 18 desimal)

        emit Claimed(msg.sender, 1 * (10 ** 18));
    }

    // Fungsi untuk owner mengisi kontrak dengan staking token
    function depositTokens(uint256 _amount) external onlyOwner {
        stakingToken.transferFrom(msg.sender, address(this), _amount);
    }

    // Fungsi untuk owner menarik token jika ada sisa
    function withdrawTokens(uint256 _amount) external onlyOwner {
        stakingToken.transfer(msg.sender, _amount);
    }

    // Fungsi untuk melihat total supply token yang ada di dalam kontrak
    function getDepositedSupply() external view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }
}