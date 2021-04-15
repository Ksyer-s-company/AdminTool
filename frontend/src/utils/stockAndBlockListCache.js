import { isSameDay, parseISO } from 'date-fns';
import { blockInfoApiInstance } from '../apis/BlockInfoApi';
import { stockInfoApiInstance } from '../apis/StockInfoApi';

const itemName = 'stockAndBlockListCache';

export const getStockAndBlockListCache = () => {
  let result = localStorage.getItem(itemName);
  if (result == null) {
    console.log('No stock and block cache found.');
    return null;
  }
  try {
    result = JSON.parse(result);
  } catch {
    console.log('Invalid stock and block cache data.');
    return null;
  }
  const now = new Date();
  if (!isSameDay(now, parseISO(result.date))) {
    console.log('Stock and block cache expired.');
    return null;
  }
  console.log(`Using Stock and block cache. Last updated: ${result.date}`);
  return result;
};

export const setStockAndBlockListCache = ([stockData, blockData]) => {
  const result = {
    stockData,
    blockData,
    date: new Date(),
  };
  localStorage.setItem(itemName, JSON.stringify(result));
};

export const fetchStockAndBlockListData = async () => {
  const stockApi = stockInfoApiInstance;
  const blockApi = blockInfoApiInstance;
  const [stockData, blockData] = await Promise.all([stockApi.request(), blockApi.request()]);
  return [stockData, blockData];
};
