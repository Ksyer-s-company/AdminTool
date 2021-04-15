const numberFormatterEn = (n) => {
  if (n == null || isNaN(n)) return 'NaN';
  if (n >= 1e6 || n <= -1e6) {
    // mil with comma
    let numStr = String(Math.round(n / 1e6));
    if (numStr.length >= 4) {
      numStr = numStr.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    return `${numStr}m`;
  }
  if (n >= 1000 || n <= -1000) {
    // k
    return `${Math.round(n / 1e3)}k`;
  }
  if (n >= 10 || n <= -10) {
    // trunc to integer
    return String(Math.round(n));
  }
  // 2 point decimal
  return String(Number(n).toFixed(2));
};

const decimalToPercentageFormatter = (n) => {
  if (n == null || isNaN(n)) return 'NaN';
  return percentageFormatter(n * 100);
};

const percentageFormatter = (n) => {
  if (n == null || isNaN(n)) return 'NaN';
  return `${Number(n).toFixed(2)}%`;
};

const identityFormatter = (n) => String(n);

const isoDateTimeFormatter = (data) => {
  const dateTime = new Date(data);
  let result = new Date(dateTime - dateTime.getTimezoneOffset() * 60000).toISOString();
  result = result.replace('T', ' ');
  result = result.slice(0, result.indexOf('.'));
  return result;
};

const dateQuarterFormatter = (data) => {
  const re = /\d{4}-\d{2}-\d{2}/;
  if (!String(data).match(re)) {
    return 'Invalid Date';
  }
  const year = String(data).slice(0, 4);
  const day = String(data).slice(5);
  if (day <= '04-31') return `${year}Q1`;
  if (day <= '08-30') return `${year}Q2`;
  if (day <= '10-30') return `${year}Q3`;
  if (day <= '12-31') return `${year}Q4`;
  return 'Invalid Date';
};

const stringListFormatter = (data) => {
  const dataList = JSON.parse(data);
  if (!Array.isArray(dataList)) return 'Invalid Data';
  return dataList.join('\n');
};

const cellFormatter = (data, formatter) => {
  if (data == null) return null;
  let formatterFn = null;
  switch (formatter) {
    case 'numberEn':
      formatterFn = numberFormatterEn;
      break;
    case 'percentage':
      formatterFn = percentageFormatter;
      break;
    case 'decimalToPercentage':
      formatterFn = decimalToPercentageFormatter;
      break;
    case 'isoDateTime':
      formatterFn = isoDateTimeFormatter;
      break;
    case 'dateQuarter':
      formatterFn = dateQuarterFormatter;
      break;
    case 'stringList':
      formatterFn = stringListFormatter;
      break;
    case 'identity':
      formatterFn = identityFormatter;
      break;
    case '':
      formatterFn = identityFormatter;
      break;
    default:
      throw `Error: Unknown formatter ${formatter}.`;
  }
  return formatterFn(data);
};

export default cellFormatter;
