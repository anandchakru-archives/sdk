import { saveAs } from 'file-saver';
import moment from 'moment';
import { stringify } from 'query-string';
import { APPLE_END, APPLE_SEPARATOR, APPLE_START, FORMAT, FORMAT_WITH_Z } from '../const/constants';
import { IInviteDB } from '../pojo/invite';

export class CalendarService {
  public apple(invite: IInviteDB): string {
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
        ? 'DTSTAMP;VALUE=DATE-TIME:' + this.asMomentUtc(invite.timeFrom, FORMAT_WITH_Z) + APPLE_SEPARATOR
        : '') +
      (invite.timeFrom
        ? 'DTSTART;VALUE=DATE-TIME:' + this.asMomentUtc(invite.timeFrom, FORMAT_WITH_Z) + APPLE_SEPARATOR
        : '') +
      (invite.timeFrom
        ? 'DTEND;VALUE=DATE-TIME:' +
        this.asMomentUtc(
          invite.timeTo ? invite.timeTo : this.asMomentUtcGuessEnd(invite.timeFrom),
          FORMAT_WITH_Z,
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
  public google(invite: IInviteDB): string {
    const details = {
      action: 'TEMPLATE',
      dates:
        this.asMomentUtc(invite.timeFrom, FORMAT_WITH_Z) +
        '/' +
        this.asMomentUtc(invite.timeTo ? invite.timeTo : this.asMomentUtcGuessEnd(invite.timeFrom), FORMAT_WITH_Z),
      details: invite.longMsg + '\n\n~' + invite.hostName + '\nnivite.com',
      location: invite.addrText,
      sprop: 'website: nivite.com&sprop=name:nivite',
      text: invite.title,
      trp: true,
    };
    const url = `https://calendar.google.com/calendar/render?${stringify(details)}`;
    window.open(url, '_blank');
    return url;
  }
  public microsoft(invite: IInviteDB): string {
    const details = {
      body: invite.longMsg + '\n\n~' + invite.hostName + '\nnivite.com',
      enddt: this.asMomentUtc(invite.timeTo ? invite.timeTo : this.asMomentUtcGuessEnd(invite.timeFrom), FORMAT),
      location: invite.addrText,
      path: '/calendar/action/compose',
      rru: 'addevent',
      startdt: this.asMomentUtc(invite.timeFrom, FORMAT),
      subject: invite.title,
    };
    const url = `https://outlook.live.com/owa/?${stringify(details)}`;
    window.open(url, '_blank');
    return url;
  }
  public yahoo(invite: IInviteDB): string {
    const details = {
      desc: invite.longMsg + '\n\n~' + invite.hostName + '\nnivite.com',
      et: this.asMomentUtc(invite.timeTo ? invite.timeTo : this.asMomentUtcGuessEnd(invite.timeFrom), FORMAT_WITH_Z),
      in_loc: invite.addrText,
      st: this.asMomentUtc(invite.timeFrom, FORMAT_WITH_Z),
      title: invite.title,
      v: 60,
    };
    const url = `https://calendar.yahoo.com/?${stringify(details)}`;
    window.open(url, '_blank');
    return url;
  }
  public ical(invite: IInviteDB) {
    return this.apple(invite);
  }
  private asMomentUtc(valueOf: number | moment.Moment | undefined, format: string): string {
    return moment(valueOf)
      .utc()
      .format(format);
  }
  private asMomentUtcGuessEnd(valueOf: number | moment.Moment | undefined): moment.Moment {
    return moment(valueOf).add(5, 'hours');
  }
}
