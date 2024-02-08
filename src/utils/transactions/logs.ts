import { CustomClients, DepositLogs, WithdrawLogs } from '~/types';
import { Address } from 'viem';
import { GetWithdrawalStatusParameters } from 'viem/op-stack';

import {
  erc20BridgeInitiatedABI,
  ethBridgeInitiatedABI,
  messagePassedAbi,
  sentMessageABI,
  transactionDepositedABI,
} from '../parsedEvents';

interface GetWithdrawalLogsParameters {
  customClient: CustomClients;
  userAddress?: Address;
}
export const getWithdrawLogs = async ({
  customClient,
  userAddress,
}: GetWithdrawalLogsParameters): Promise<WithdrawLogs> => {
  if (!userAddress) throw new Error('No user address provided');

  const logsFromL2ToL1MessagePasserPromise = customClient.to.public.getLogs({
    address: customClient.to.contracts.l2ToL1MessagePasser,
    event: messagePassedAbi,
    args: {
      sender: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const logsFromL2CrossDomainPromise = customClient.to.public.getLogs({
    address: customClient.to.contracts.crossDomainMessenger, // L2 cross domain messenger
    event: sentMessageABI,
    args: {
      target: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const ethLogsFromL2StandarBridgePromise = customClient.to.public.getLogs({
    address: customClient.to.contracts.standardBridge, // L2 standard bridge
    event: ethBridgeInitiatedABI,
    args: {
      from: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const erc20LogsFromL2StandarBridgePromise = customClient.to.public.getLogs({
    address: customClient.to.contracts.standardBridge, // L2 standard bridge
    event: erc20BridgeInitiatedABI,
    args: {
      from: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  const [logsFromL2ToL1MessagePasser, logsFromL2CrossDomain, ethLogsFromL2StandarBridge, erc20LogsFromL2StandarBridge] =
    await Promise.all([
      logsFromL2ToL1MessagePasserPromise,
      logsFromL2CrossDomainPromise,
      ethLogsFromL2StandarBridgePromise,
      erc20LogsFromL2StandarBridgePromise,
    ]);

  const logs = [
    ...logsFromL2ToL1MessagePasser,
    ...logsFromL2CrossDomain,
    ...ethLogsFromL2StandarBridge,
    ...erc20LogsFromL2StandarBridge,
  ];

  const receipts = await Promise.all(
    logs.map(({ transactionHash }) => {
      return customClient.to.public.getTransactionReceipt({ hash: transactionHash });
    }),
  );

  const status = await Promise.all(
    receipts.map((receipt) => {
      return customClient.from.public.getWithdrawalStatus({
        receipt,
        targetChain: customClient.to.public.chain,
      } as GetWithdrawalStatusParameters);
    }),
  );

  return { logs, receipts, status };
};

interface GetDepositLogsParameters {
  customClient: CustomClients;
  userAddress?: Address;
}
export const getDepositLogs = async ({ customClient, userAddress }: GetDepositLogsParameters): Promise<DepositLogs> => {
  if (!userAddress) throw new Error('No user address provided');

  const logs = await customClient.from.public.getLogs({
    address: customClient.from.contracts.portal, // L1 portal,
    event: transactionDepositedABI,
    args: {
      from: userAddress,
    },
    fromBlock: 'earliest',
    toBlock: 'latest',
  });

  // temporary disabled
  // const receipts = await Promise.all(
  //   logs.map(({ transactionHash }) => {
  //     return customClient.from.public.getTransactionReceipt({ hash: transactionHash });
  //   }),
  // );

  return { logs, receipts: [] };
};