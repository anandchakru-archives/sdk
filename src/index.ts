import { stringify } from 'query-string';
import {
  asMomentUtc,
  asMomentUtcGuessEnd,
  dateTimeUTCForGooglenYahoo,
  dateTimeUTCForOutlook,
  IInviteDB,
} from './nivite-sdk';

export class NiviteSdk {
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
    /*const cal = ical({
          domain: 'nivite.com',
          prodId: { company: 'nivite.com', product: 'nivite' },
          name: 'Nerdy Invites',
          timezone: tz()
        });
        const event = cal.createEvent({
          start: asMoment(),
          end: asMoment().add(1, 'hour'),
          timezone: tz(),
          summary: 'My Event',
          organizer: 'Sebastian Pekarek <mail@example.com>'
        });
        console.log(cal.toString());*/
  }
}
