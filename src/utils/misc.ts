import { Chain, formatUnits, parseUnits } from 'viem';
import { contracts } from './variables';
import { OpContracts } from '~/types';

export const replaceSpacesWithHyphens = (str: string) => str.replace(/\s+/g, '-').toLowerCase();

export const getFromContracts = (fromChain: Chain, toChain: Chain): OpContracts => {
  const key = `${fromChain.id}-${toChain.id}`;
  return contracts[key];
};

export const getToContracts = (fromChain: Chain, toChain: Chain): OpContracts => {
  const key = `${toChain.id}-${fromChain.id}`;
  return contracts[key];
};

export const getUsdBalance = (price: number, balance: string, decimals: number): string => {
  const priceBN = parseUnits(price.toString(), decimals);
  const balanceBN = parseUnits(balance, decimals);
  const result = (priceBN * balanceBN) / BigInt(10 ** decimals);
  return formatDataNumber(result.toString(), 18, 2, true, false);
};

/**
 * @dev Format a number to a string
 * @param input BigNumber string to format
 * @param decimals Number of BigNumber's decimals
 * @param formatDecimal Number of decimals to format to
 * @param currency Format as currency
 * @param compact Format as compact
 * @returns Formatted number
 */
export function formatDataNumber(
  input: string | number,
  decimals = 18,
  formatDecimal = 2,
  currency?: boolean,
  compact?: boolean,
) {
  let res: number = Number.parseFloat(input.toString());
  if (res === 0) return `${currency ? '$0' : '0'}`;

  if (decimals !== 0) res = Number.parseFloat(formatUnits(BigInt(input), decimals));

  if (res < 0.01) return `${currency ? '$' : ''}<0.01`;

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: formatDecimal,
    notation: compact ? 'compact' : 'standard',
    style: currency ? 'currency' : 'decimal',
    currency: 'USD',
  }).format(res);
}
