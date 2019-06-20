import { saveAs } from 'file-saver';
import { stringify } from 'query-string';
import {
  APPLE_END,
  APPLE_SEPARATOR,
  APPLE_START,
  asMomentUtc,
  asMomentUtcGuessEnd,
  dateTimeUTCForGooglenYahoo,
  dateTimeUTCForOutlook,
  IInviteDB,
} from './nivite-sdk';

export class NiviteSdk {
  public static apple(invite: IInviteDB): string {
    const event =
      APPLE_START +
      'BEGIN:VEVENT' +
      APPLE_SEPARATOR +
      'UID:oid' +
      '@nivite.com' +
      APPLE_SEPARATOR +
      'CLASS:PUBLIC' +
      APPLE_SEPARATOR +
      'DESCRIPTION:' +
      (invite.longMsg ? (invite.longMsg as string).substr(0, 25) + '...' : '') +
      ' ~ nivite.com' +
      APPLE_SEPARATOR +
      (invite.timeFrom
        ? 'DTSTAMP;VALUE=DATE-TIME:' + asMomentUtc(invite.timeFrom, dateTimeUTCForGooglenYahoo) + APPLE_SEPARATOR
        : '') +
      (invite.timeFrom
        ? 'DTSTART;VALUE=DATE-TIME:' + asMomentUtc(invite.timeFrom, dateTimeUTCForGooglenYahoo) + APPLE_SEPARATOR
        : '') +
      (invite.timeFrom
        ? 'DTEND;VALUE=DATE-TIME:' +
          asMomentUtc(
            invite.timeTo ? invite.timeTo : asMomentUtcGuessEnd(invite.timeFrom),
            dateTimeUTCForGooglenYahoo,
          ) +
          APPLE_SEPARATOR
        : '') +
      (invite.addrText ? 'LOCATION:' + invite.addrText.split(',').join('\\,') + APPLE_SEPARATOR : '') +
      'SUMMARY;LANGUAGE=en-us:' +
      invite.title +
      APPLE_SEPARATOR +
      'TRANSP:TRANSPARENT' +
      APPLE_SEPARATOR +
      'END:VEVENT' +
      APPLE_END;
    saveAs(new Blob([event]), 'nivite.ics');
    return event; // for jest to unit-test
  }
  public static google(invite: IInviteDB): string {
    const details = {
      action: 'TEMPLATE',
      dates:
        asMomentUtc(invite.timeFrom, dateTimeUTCForGooglenYahoo) +
        '/' +
        asMomentUtc(invite.timeTo ? invite.timeTo : asMomentUtcGuessEnd(invite.timeFrom), dateTimeUTCForGooglenYahoo),
      details: invite.longMsg + '\n\n~' + invite.hostName + '\nnivite.com',
      location: invite.addrText,
      sprop: 'website: nivite.com&sprop=name:nivite',
      text: invite.title,
      trp: true,
    };
    return `https://calendar.google.com/calendar/render?${stringify(details)}`;
  }
  public static outlook(invite: IInviteDB): string {
    const details = {
      body: invite.longMsg + '\n\n~' + invite.hostName + '\nnivite.com',
      enddt: asMomentUtc(invite.timeTo ? invite.timeTo : asMomentUtcGuessEnd(invite.timeFrom), dateTimeUTCForOutlook),
      location: invite.addrText,
      path: '/calendar/action/compose',
      rru: 'addevent',
      startdt: asMomentUtc(invite.timeFrom, dateTimeUTCForOutlook),
      subject: invite.title,
    };
    return `https://outlook.live.com/owa/?${stringify(details)}`;
  }
  public static yahoo(invite: IInviteDB): string {
    const details = {
      desc: invite.longMsg + '\n\n~' + invite.hostName + '\nnivite.com',
      et: asMomentUtc(invite.timeTo ? invite.timeTo : asMomentUtcGuessEnd(invite.timeFrom), dateTimeUTCForGooglenYahoo),
      in_loc: invite.addrText,
      st: asMomentUtc(invite.timeFrom, dateTimeUTCForGooglenYahoo),
      title: invite.title,
      v: 60,
    };
    return `https://calendar.yahoo.com/?${stringify(details)}`;
  }
  public static ical(invite: IInviteDB) {
    return this.apple(invite);
  }
}
