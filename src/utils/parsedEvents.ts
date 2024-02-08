import { parseAbiItem } from 'viem';

/**
 * @notice Emitted whenever a message is sent to the other chain.
 * @param target       Address of the recipient of the message.
 * @param sender       Address of the sender of the message.
 * @param message      Message to trigger the recipient address with.
 * @param messageNonce Unique nonce attached to the message.
 * @param gasLimit     Minimum gas limit that the message can be executed with.
 */
export const sentMessageABI = parseAbiItem(
  'event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)',
);

/**
 * @notice Emitted when an ERC20 bridge is initiated to the other chain.
 *
 * @param localToken  Address of the ERC20 on this chain.
 * @param remoteToken Address of the ERC20 on the remote chain.
 * @param from        Address of the sender.
 * @param to          Address of the receiver.
 * @param amount      Amount of the ERC20 sent.
 * @param extraData   Extra data sent with the transaction.
 */
export const erc20BridgeInitiatedABI = parseAbiItem(
  'event ERC20BridgeInitiated(address indexed localToken,address indexed remoteToken,address indexed from,address to,uint256 amount,bytes extraData)',
);

/**
 * @notice Emitted when an ETH bridge is initiated to the other chain.
 *
 * @param from      Address of the sender.
 * @param to        Address of the receiver.
 * @param amount    Amount of ETH sent.
 * @param extraData Extra data sent with the transaction.
 */
export const ethBridgeInitiatedABI = parseAbiItem(
  'event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)',
);

/**
 * @notice Emitted when a transaction is deposited from L1 to L2.
 *         The parameters of this event are read by the rollup node and used to derive deposit
 *         transactions on L2.
 * @param from       Address that triggered the deposit transaction.
 * @param to         Address that the deposit transaction is directed to.
 * @param version    Version of this deposit transaction event.
 * @param opaqueData ABI encoded deposit data to be parsed off-chain.
 */
export const transactionDepositedABI = parseAbiItem(
  'event TransactionDeposited(address indexed from,address indexed to,uint256 indexed version,bytes opaqueData)',
);

/**
 * @notice Emitted any time a withdrawal is initiated.
 * @param nonce          Unique value corresponding to each withdrawal.
 * @param sender         The L2 account address which initiated the withdrawal.
 * @param target         The L1 account address the call will be send to.
 * @param value          The ETH value submitted for withdrawal, to be forwarded to the target.
 * @param gasLimit       The minimum amount of gas that must be provided when withdrawing.
 * @param data           The data to be forwarded to the target on L1.
 * @param withdrawalHash The hash of the withdrawal.
 */
export const messagePassedAbi = parseAbiItem(
  'event MessagePassed(uint256 indexed nonce,address indexed sender,address indexed target,uint256 value,uint256 gasLimit,bytes data,bytes32 withdrawalHash)',
);
