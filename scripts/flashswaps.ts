import { ethers } from "hardhat";
import * as IERC20 from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";
import { getErc20Balance, showErc20Balance } from "../utils/token";
import { DAI, KYBER_ADDRESS, SWAP_ROUTER, UNI, uniswapv3factory, USDC, weth9 } from "./address";

async function main(
	baseTokenAddress: string,
	swapTokenAddress: string,
	isUniKyb: Boolean,
	amount: number
) {
	const Contract = await ethers.getContractFactory("FlashSwaps");
	const [deployer] = await ethers.getSigners();
	const provider = ethers.provider;

	const contract = await Contract.deploy(
		SWAP_ROUTER, uniswapv3factory, ethers.utils.getAddress(weth9), KYBER_ADDRESS
	);

	const DECIMALS = 18

	let token0: any;
	let token1: any;
	token0 = new ethers.Contract(swapTokenAddress, IERC20.abi, provider)
	token1 = new ethers.Contract(baseTokenAddress, IERC20.abi, provider)

	const initialBalance = await getErc20Balance(token1, deployer.address, DECIMALS)
	console.log("deployer's initial balance", initialBalance)

	// borrow from token0, token1 fee1 pool
	const tx = await contract.initFlash({
		token0: ethers.utils.getAddress(baseTokenAddress), //DAI
		token1: ethers.utils.getAddress(USDC),
		token2: ethers.utils.getAddress(swapTokenAddress), //UNI
		fee1: 500,
		amount0: ethers.utils.parseUnits(amount.toString(), DECIMALS),
		amount1: 0,
		fee2: 500,
		unikyb: isUniKyb,
	})

	const endingBalance = await getErc20Balance(token1, deployer.address, DECIMALS)
	console.log("deployer's ending balance", endingBalance)

	const profit = endingBalance - initialBalance

	if (profit>0) {
		console.log(`Congrats! You earned ${profit} DAI !!`)
	}

}

main(DAI, UNI, false, 1500)
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
