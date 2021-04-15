import cellFormatter from './cellFormatter';

it('Formats number in english format', () => {
  const formatter = 'numberEn';
  // Number type input
  expect(cellFormatter(123456789123456, formatter)).toBe('123,456,789m');
  expect(cellFormatter(123456123456, formatter)).toBe('123,456m');
  expect(cellFormatter(1234123456, formatter)).toBe('1,234m');
  expect(cellFormatter(123123456, formatter)).toBe('123m');
  expect(cellFormatter(1123456, formatter)).toBe('1m');
  expect(cellFormatter(123456, formatter)).toBe('123k');
  expect(cellFormatter(12345, formatter)).toBe('12k');
  expect(cellFormatter(1234, formatter)).toBe('1k');
  expect(cellFormatter(123, formatter)).toBe('123');
  expect(cellFormatter(12, formatter)).toBe('12');
  expect(cellFormatter(1, formatter)).toBe('1.00');
  expect(cellFormatter(1.234, formatter)).toBe('1.23');
  expect(cellFormatter(-123456789123456, formatter)).toBe('-123,456,789m');
  expect(cellFormatter(-123456123456, formatter)).toBe('-123,456m');
  expect(cellFormatter(-1234123456, formatter)).toBe('-1,234m');
  expect(cellFormatter(-123123456, formatter)).toBe('-123m');
  expect(cellFormatter(-1123456, formatter)).toBe('-1m');
  expect(cellFormatter(-123456, formatter)).toBe('-123k');
  expect(cellFormatter(-12345, formatter)).toBe('-12k');
  expect(cellFormatter(-1234, formatter)).toBe('-1k');
  expect(cellFormatter(-123, formatter)).toBe('-123');
  expect(cellFormatter(-12, formatter)).toBe('-12');
  expect(cellFormatter(-1, formatter)).toBe('-1.00');
  expect(cellFormatter(-1.234, formatter)).toBe('-1.23');
  // String type input
  expect(cellFormatter('123456789123456', formatter)).toBe('123,456,789m');
  expect(cellFormatter('123456123456', formatter)).toBe('123,456m');
  expect(cellFormatter('1234123456', formatter)).toBe('1,234m');
  expect(cellFormatter('123123456', formatter)).toBe('123m');
  expect(cellFormatter('1123456', formatter)).toBe('1m');
  expect(cellFormatter('123456', formatter)).toBe('123k');
  expect(cellFormatter('12345', formatter)).toBe('12k');
  expect(cellFormatter('1234', formatter)).toBe('1k');
  expect(cellFormatter('123', formatter)).toBe('123');
  expect(cellFormatter('12', formatter)).toBe('12');
  expect(cellFormatter('1', formatter)).toBe('1.00');
  expect(cellFormatter('1.234', formatter)).toBe('1.23');
  expect(cellFormatter('-123456789123456', formatter)).toBe('-123,456,789m');
  expect(cellFormatter('-123456123456', formatter)).toBe('-123,456m');
  expect(cellFormatter('-1234123456', formatter)).toBe('-1,234m');
  expect(cellFormatter('-123123456', formatter)).toBe('-123m');
  expect(cellFormatter('-1123456', formatter)).toBe('-1m');
  expect(cellFormatter('-123456', formatter)).toBe('-123k');
  expect(cellFormatter('-12345', formatter)).toBe('-12k');
  expect(cellFormatter('-1234', formatter)).toBe('-1k');
  expect(cellFormatter('-123', formatter)).toBe('-123');
  expect(cellFormatter('-12', formatter)).toBe('-12');
  expect(cellFormatter('-1', formatter)).toBe('-1.00');
  expect(cellFormatter('-1.234', formatter)).toBe('-1.23');
  // Catches NaN correctly
  expect(cellFormatter('null', formatter)).toBe('NaN');
  expect(cellFormatter(null, formatter)).toBe(null);
  expect(cellFormatter(undefined, formatter)).toBe(null);
  expect(cellFormatter('2009-01-01', formatter)).toBe('NaN');
});

it('Formats percentage number', () => {
  const formatter = 'percentage';
  expect(cellFormatter(12.34, formatter)).toBe('12.34%');
  expect(cellFormatter('12.34', formatter)).toBe('12.34%');
  expect(cellFormatter(-12.34, formatter)).toBe('-12.34%');
  expect(cellFormatter('-12.34', formatter)).toBe('-12.34%');
  // Catches NaN correctly
  expect(cellFormatter('null', formatter)).toBe('NaN');
  expect(cellFormatter(null, formatter)).toBe(null);
  expect(cellFormatter(undefined, formatter)).toBe(null);
  expect(cellFormatter('2009-01-01', formatter)).toBe('NaN');
});

it('Formats decimal to percentage', () => {
  const formatter = 'decimalToPercentage';
  expect(cellFormatter(0.1234, formatter)).toBe('12.34%');
  expect(cellFormatter('0.1234', formatter)).toBe('12.34%');
  expect(cellFormatter(-0.1234, formatter)).toBe('-12.34%');
  expect(cellFormatter('-0.1234', formatter)).toBe('-12.34%');
  // Catches NaN correctly
  expect(cellFormatter('null', formatter)).toBe('NaN');
  expect(cellFormatter(null, formatter)).toBe(null);
  expect(cellFormatter(undefined, formatter)).toBe(null);
  expect(cellFormatter('2009-01-01', formatter)).toBe('NaN');
});

it('Formats things with identity formatter', () => {
  let formatter = '';
  expect(cellFormatter(123456789123456, formatter)).toBe('123456789123456');
  expect(cellFormatter('%!!!', formatter)).toBe('%!!!');
  formatter = 'identity';
  expect(cellFormatter(123456789123456, formatter)).toBe('123456789123456');
  expect(cellFormatter('%!!!', formatter)).toBe('%!!!');
});

it('Formats date in yyyy-mm-dd HH:MM:SS', () => {
  let formatter = 'isoDateTime';
  expect(cellFormatter('2020-07-01T08:03:25', formatter)).toBe('2020-07-01 08:03:25');
});

it('Formats date into quarters', () => {
  let formatter = 'dateQuarter';
  expect(cellFormatter('2020-03-31', formatter)).toBe('2020Q1');
  expect(cellFormatter('2020-06-30', formatter)).toBe('2020Q2');
  expect(cellFormatter('2020-09-30', formatter)).toBe('2020Q3');
  expect(cellFormatter('2020-12-31', formatter)).toBe('2020Q4');
});

it('Formats string list into linebreak segmented string', () => {
  let formatter = 'stringList';
  const testData = `["abc", "def"]`;
  expect(cellFormatter(testData, formatter)).toBe('abc\ndef');
});

it('Returns null for null input', () => {
  let formatter = 'numberEn';
  expect(cellFormatter(null, formatter)).toBe(null);
  expect(cellFormatter(undefined, formatter)).toBe(null);
});
