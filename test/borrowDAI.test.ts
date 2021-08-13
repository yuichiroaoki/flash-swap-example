import { run, ethers } from "hardhat";
import { expect } from "chai";
import { Development__factory, Development } from "../typechain";
import * as IERC20 from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DAI, KYBER_ADDRESS, SWAP_ROUTER, UNI, uniswapv3factory, USDC, weth9, WETH_WHALE } from "../scripts/address";
import { showErc20Balance, impersonateFundErc20 } from "../utils/token";
import { getTransactionFee } from "../utils/eth";
import { BigNumber, Contract } from "ethers";

describe("Development", async () => {
	let contract: Development;
	const baseTokenAddress = DAI
	const swapTokenAddress = UNI
	const middleTokenAddress = USDC

	let owner: SignerWithAddress;
	let addr1: SignerWithAddress;
	let addrs: SignerWithAddress[];

	const provider = ethers.provider;

	const DECIMALS = 18

	let token0: Contract;
	let token1: Contract;

	token0 = new ethers.Contract(swapTokenAddress, IERC20.abi, provider)
	token1 = new ethers.Contract(baseTokenAddress, IERC20.abi, provider)

	before(async () => {

		[owner, addr1, ...addrs] = await ethers.getSigners();

		await run("balance", { account: owner.address })

		const initialEth: BigNumber = await provider.getBalance(owner.address)

		const contractFactory = (await ethers.getContractFactory(
			"Development", owner
		)) as Development__factory;

		contract = await contractFactory.deploy(
			SWAP_ROUTER, uniswapv3factory, ethers.utils.getAddress(weth9), KYBER_ADDRESS
		);
		await contract.deployed();

		getTransactionFee(owner.address, initialEth)

		await impersonateFundErc20(token1, WETH_WHALE, contract.address, "50.0")

	})

	it("Should execute unikyb flash swaps", async () => {

		const tx = await contract.initFlash({
			token0: ethers.utils.getAddress(baseTokenAddress),
			token1: ethers.utils.getAddress(middleTokenAddress),
			token2: ethers.utils.getAddress(swapTokenAddress),
			fee1: 500,
			amount0: ethers.utils.parseUnits("100.0", DECIMALS),
			amount1: 0,
			fee2: 500,
			unikyb: true,
		})

		expect(tx.hash).to.be.not.null;

		expect(await provider.getTransactionReceipt(tx.hash)).to.be.not.null;

		await run("balance", { account: owner.address })
	})

	it("Should execute kybuni flash swaps", async () => {

		const tx = await contract.initFlash({
			token0: ethers.utils.getAddress(baseTokenAddress),
			token1: ethers.utils.getAddress(middleTokenAddress),
			token2: ethers.utils.getAddress(swapTokenAddress),
			fee1: 500,
			amount0: ethers.utils.parseUnits("100.0", DECIMALS),
			amount1: 0,
			fee2: 500,
			unikyb: false,
		})

		expect(tx.hash).to.be.not.null;

		expect(await provider.getTransactionReceipt(tx.hash)).to.be.not.null;

		await run("balance", { account: owner.address })
	})

	it('Should return the address of owner.', async () => {
		expect(await contract.owner()).to.equal(owner.address)
	})

	it('Should successfully send erc20 tokens', async () => {

		const initialBalance = await token1.balanceOf(addr1.address)

		await contract.withdrawToken(
			ethers.utils.getAddress(baseTokenAddress),
			addr1.address,
			1000
		)

		const expectedBalance = initialBalance.add(ethers.BigNumber.from(1000))
		expect(await token1.balanceOf(addr1.address)).to.equal(expectedBalance);

	})

	it("Should be reverted because it is not called by the owner", async () => {

		expect(contract.connect(addr1).withdrawToken(
			ethers.utils.getAddress(baseTokenAddress),
			addr1.address,
			1000
		))
			.to.be.reverted;

	});
})
