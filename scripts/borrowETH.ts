import { network, ethers } from "hardhat";
import * as IERC20 from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";
import { fundErc20, showErc20Balance, impersonateFundErc20 } from "../utils/token";
import { COMP, DAI, DAI_WHALE, KYBER_ADDRESS, SNX, SWAP_ROUTER, UNI, uniswapv3factory, USDC, USDT, WBTC, weth9, WETH_WHALE } from "./address";

async function main(
	baseTokenAddress: string,
	swapTokenAddress: string,
	isUniKyb: Boolean,
	amount: number
) {
	const Contract = await ethers.getContractFactory("Development");
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

	deployer.getBalance().then(value => {
		console.log("initial account balance:", ethers.utils.formatEther(value));
	})

	await impersonateFundErc20(token1, WETH_WHALE, contract.address, "1.0")

	showErc20Balance(token1, contract.address, "base", DECIMALS)
	showErc20Balance(token1, deployer.address, "deployer base", DECIMALS)
	showErc20Balance(token0, contract.address, "swap", DECIMALS)
	showErc20Balance(token0, deployer.address, "deployer swap", DECIMALS)

	// borrow from token0, token1 fee1 pool
	const tx = await contract.initFlash({
		token0: ethers.utils.getAddress(baseTokenAddress),
		token1: ethers.utils.getAddress(USDT),
		token2: ethers.utils.getAddress(swapTokenAddress),
		fee1: 500,
		amount0: ethers.utils.parseUnits(amount.toString(), DECIMALS),
		amount1: 0,
		fee2: 3000,
		unikyb: isUniKyb,
	})

	deployer.getBalance().then(value => {
		console.log("last account balance:", ethers.utils.formatEther(value));
	})

	await showErc20Balance(token1, contract.address, "base", DECIMALS)
	showErc20Balance(token1, deployer.address, "deployer base", DECIMALS)
	showErc20Balance(token0, contract.address, "contract swap", DECIMALS)
	showErc20Balance(token0, deployer.address, "deployer swap", DECIMALS)

}

main(weth9, COMP, true, 2)
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});