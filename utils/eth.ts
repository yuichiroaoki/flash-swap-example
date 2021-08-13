import { ethers } from "hardhat";
import { BigNumber } from "ethers";

const provider = ethers.provider

export const getTransactionFee = async (
	address: string, initialEth: BigNumber
) => {

	const lastEth = await provider.getBalance(address)
	const fee = ethers.utils.formatEther(initialEth.sub(lastEth))

	console.log("transaction fee:", fee, "ETH")
}