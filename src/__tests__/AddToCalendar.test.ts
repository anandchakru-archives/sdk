import { NiviteSdk } from '../index';
declare var global: any;

const e1 = { title: '' };
const e2 = { title: '', timeFrom: 1563498000000, longMsg: 'simple msg', hostName: 'Foo Bar' };
const e3 = { title: '', timeFrom: 1563498000000, timeTo: 1563508800000, longMsg: 'simple msg', hostName: 'Foo Bar' };
const e4 = {
  addrText: '333 Market St, San Francisco, CA 94105',
  hostName: 'Foo Bar',
  longMsg: 'simple msg',
  timeFrom: 1563498000000,
  timeTo: 1563508800000,
  title: 'Nivite',
};
test('Google', () => {
  expect(NiviteSdk.google(e1)).toContain('https://calendar.google.com/calendar/render');
  expect(NiviteSdk.google(e2)).toBe(
    'https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20190719T010000Z%2F20190719T060000Z&details=simple%20msg%0A%0A~Foo%20Bar%0Anivite.com&sprop=website%3A%20nivite.com%26sprop%3Dname%3Anivite&text=&trp=true',
  );
  expect(NiviteSdk.google(e3)).toBe(
    'https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20190719T010000Z%2F20190719T040000Z&details=simple%20msg%0A%0A~Foo%20Bar%0Anivite.com&sprop=website%3A%20nivite.com%26sprop%3Dname%3Anivite&text=&trp=true',
  );
  expect(NiviteSdk.google(e4)).toBe(
    'https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20190719T010000Z%2F20190719T040000Z&details=simple%20msg%0A%0A~Foo%20Bar%0Anivite.com&location=333%20Market%20St%2C%20San%20Francisco%2C%20CA%2094105&sprop=website%3A%20nivite.com%26sprop%3Dname%3Anivite&text=Nivite&trp=true',
  );
});

test('Outlook', () => {
  expect(NiviteSdk.outlook(e1)).toContain('https://outlook.live.com/owa/');
  expect(NiviteSdk.outlook(e2)).toBe(
    'https://outlook.live.com/owa/?body=simple%20msg%0A%0A~Foo%20Bar%0Anivite.com&enddt=20190719T060000&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=20190719T010000&subject=',
  );
  expect(NiviteSdk.outlook(e3)).toBe(
    'https://outlook.live.com/owa/?body=simple%20msg%0A%0A~Foo%20Bar%0Anivite.com&enddt=20190719T040000&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=20190719T010000&subject=',
  );
  expect(NiviteSdk.outlook(e4)).toBe(
    'https://outlook.live.com/owa/?body=simple%20msg%0A%0A~Foo%20Bar%0Anivite.com&enddt=20190719T040000&location=333%20Market%20St%2C%20San%20Francisco%2C%20CA%2094105&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=20190719T010000&subject=Nivite',
  );
});

test('Yahoo', () => {
  expect(NiviteSdk.yahoo(e1)).toContain('https://calendar.yahoo.com/?');
  expect(NiviteSdk.yahoo(e2)).toBe(
    'https://calendar.yahoo.com/?desc=simple%20msg%0A%0A~Foo%20Bar%0Anivite.com&et=20190719T060000Z&st=20190719T010000Z&title=&v=60',
  );
  expect(NiviteSdk.yahoo(e3)).toBe(
    'https://calendar.yahoo.com/?desc=simple%20msg%0A%0A~Foo%20Bar%0Anivite.com&et=20190719T040000Z&st=20190719T010000Z&title=&v=60',
  );
  expect(NiviteSdk.yahoo(e4)).toBe(
    'https://calendar.yahoo.com/?desc=simple%20msg%0A%0A~Foo%20Bar%0Anivite.com&et=20190719T040000Z&in_loc=333%20Market%20St%2C%20San%20Francisco%2C%20CA%2094105&st=20190719T010000Z&title=Nivite&v=60',
  );
});

test('Apple', () => {
  global.URL.createObjectURL = jest.fn();
  expect(NiviteSdk.apple(e1)).toBe(
    'BEGIN:VCALENDAR\r\nPRODID:nivite.com\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:oid@nivite.com\r\nCLASS:PUBLIC\r\nDESCRIPTION: ~ nivite.com\r\nSUMMARY;LANGUAGE=en-us:\r\nTRANSP:TRANSPARENT\r\nEND:VEVENT\r\nEND:VCALENDAR',
  );
  expect(NiviteSdk.apple(e2)).toBe(
    'BEGIN:VCALENDAR\r\nPRODID:nivite.com\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:oid@nivite.com\r\nCLASS:PUBLIC\r\nDESCRIPTION:simple msg... ~ nivite.com\r\nDTSTAMP;VALUE=DATE-TIME:20190719T010000Z\r\nDTSTART;VALUE=DATE-TIME:20190719T010000Z\r\nDTEND;VALUE=DATE-TIME:20190719T060000Z\r\nSUMMARY;LANGUAGE=en-us:\r\nTRANSP:TRANSPARENT\r\nEND:VEVENT\r\nEND:VCALENDAR',
  );
  expect(NiviteSdk.apple(e3)).toBe(
    'BEGIN:VCALENDAR\r\nPRODID:nivite.com\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:oid@nivite.com\r\nCLASS:PUBLIC\r\nDESCRIPTION:simple msg... ~ nivite.com\r\nDTSTAMP;VALUE=DATE-TIME:20190719T010000Z\r\nDTSTART;VALUE=DATE-TIME:20190719T010000Z\r\nDTEND;VALUE=DATE-TIME:20190719T040000Z\r\nSUMMARY;LANGUAGE=en-us:\r\nTRANSP:TRANSPARENT\r\nEND:VEVENT\r\nEND:VCALENDAR',
  );
  expect(NiviteSdk.apple(e4)).toBe(
    'BEGIN:VCALENDAR\r\nPRODID:nivite.com\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:oid@nivite.com\r\nCLASS:PUBLIC\r\nDESCRIPTION:simple msg... ~ nivite.com\r\nDTSTAMP;VALUE=DATE-TIME:20190719T010000Z\r\nDTSTART;VALUE=DATE-TIME:20190719T010000Z\r\nDTEND;VALUE=DATE-TIME:20190719T040000Z\r\nLOCATION:333 Market St\\, San Francisco\\, CA 94105\r\nSUMMARY;LANGUAGE=en-us:Nivite\r\nTRANSP:TRANSPARENT\r\nEND:VEVENT\r\nEND:VCALENDAR',
  );
});
