import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-docgen";
import 'dotenv/config'

const { ETH_SEPOLIA_TESTNET_URL, ETH_MAINNET_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        hardhat: {
            forking: {
                url: ETH_SEPOLIA_TESTNET_URL || "",
                blockNumber: 6147758,
                enabled: true
            },
        },
        mainnet: {
            url: ETH_MAINNET_URL || "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        },
        sepolia: {
            url: ETH_SEPOLIA_TESTNET_URL || "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    docgen: {
        pages: 'files'
    },
};

export default config;