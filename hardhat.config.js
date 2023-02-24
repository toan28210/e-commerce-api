const config = {
    solidity: '0.8.17',
    paths: {
      artifacts: '@artifacts',
    },
    defaultNetwork: 'localhost',
    networks: {
      localhost: {
        url: 'http://localhost:8545',
      },
      hardhat: {
        chainId: 1337,
        initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
      },
    },
    gasReporter: {
      enabled: process.env.REPORT_GAS !== undefined,
      currency: 'USD',
    }, 
}
export default config;