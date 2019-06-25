import * as moment from 'moment';
import { saveAs } from 'file-saver';
// import { stringify } from 'query-string'; //npm i query-string
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IInviteDB } from '../pojos/invite';

@Injectable({
  providedIn: 'root'
})
export class AddToCalendarService {
  readonly FORMAT_WITH_Z = 'YYYYMMDD[T]HHmmss[Z]';
  readonly FORMAT = 'YYYYMMDD[T]HHmmss';
  readonly APPLE_SEPARATOR = '\r\n';
  readonly APPLE_START =
    'BEGIN:VCALENDAR' + this.APPLE_SEPARATOR + 'PRODID:nivite.com' + this.APPLE_SEPARATOR + 'VERSION:2.0' + this.APPLE_SEPARATOR;
  readonly APPLE_END = this.APPLE_SEPARATOR + 'END:VCALENDAR';

  constructor() { }

  public apple(invite: IInviteDB): string {
    const event =
      this.APPLE_START +
      'BEGIN:VEVENT' +
      this.APPLE_SEPARATOR +
      'UID:oid' +
      '@nivite.com' +
      this.APPLE_SEPARATOR +
      'CLASS:PUBLIC' +
      this.APPLE_SEPARATOR +
      'DESCRIPTION:' +
      (invite.longMsg ? (invite.longMsg as string).substr(0, 25) + '...' : '') +
      ' ~ nivite.com' +
      this.APPLE_SEPARATOR +
      (invite.timeFrom
        ? 'DTSTAMP;VALUE=DATE-TIME:' + this.asMomentUtc(invite.timeFrom, this.FORMAT_WITH_Z) + this.APPLE_SEPARATOR
        : '') +
      (invite.timeFrom
        ? 'DTSTART;VALUE=DATE-TIME:' + this.asMomentUtc(invite.timeFrom, this.FORMAT_WITH_Z) + this.APPLE_SEPARATOR
        : '') +
      (invite.timeFrom
        ? 'DTEND;VALUE=DATE-TIME:' +
        this.asMomentUtc(
          invite.timeTo ? invite.timeTo : this.asMomentUtcGuessEnd(invite.timeFrom),
          this.FORMAT_WITH_Z,
        ) +
        this.APPLE_SEPARATOR
        : '') +
      (invite.addrText ? 'LOCATION:' + invite.addrText.split(',').join('\\,') + this.APPLE_SEPARATOR : '') +
      'SUMMARY;LANGUAGE=en-us:' +
      invite.title +
      this.APPLE_SEPARATOR +
      'TRANSP:TRANSPARENT' +
      this.APPLE_SEPARATOR +
      'END:VEVENT' +
      this.APPLE_END;
    saveAs(new Blob([event]), 'nivite.ics');
    return event; // for jest to unit-test
  }
  public google(invite: IInviteDB): string {
    const details = {
      action: 'TEMPLATE',
      dates:
        this.asMomentUtc(invite.timeFrom, this.FORMAT_WITH_Z) +
        '/' +
        this.asMomentUtc(invite.timeTo ? invite.timeTo : this.asMomentUtcGuessEnd(invite.timeFrom), this.FORMAT_WITH_Z),
      details: invite.longMsg + '\n\n~' + invite.hostName + '\nnivite.com',
      location: invite.addrText,
      sprop: 'website: nivite.com&sprop=name:nivite',
      text: invite.title,
      trp: true,
    };
    const url = `https://calendar.google.com/calendar/render?${this.stringify(details)}`;
    window.open(url, '_blank');
    return url;
  }
  public microsoft(invite: IInviteDB): string {
    const details = {
      body: invite.longMsg + '\n\n~' + invite.hostName + '\nnivite.com',
      enddt: this.asMomentUtc(invite.timeTo ? invite.timeTo : this.asMomentUtcGuessEnd(invite.timeFrom), this.FORMAT),
      location: invite.addrText,
      path: '/calendar/action/compose',
      rru: 'addevent',
      startdt: this.asMomentUtc(invite.timeFrom, this.FORMAT),
      subject: invite.title,
    };
    const url = `https://outlook.live.com/owa/?${this.stringify(details)}`;
    window.open(url, '_blank');
    return url;
  }
  public yahoo(invite: IInviteDB): string {
    const details = {
      desc: invite.longMsg + '\n\n~' + invite.hostName + '\nnivite.com',
      et: this.asMomentUtc(invite.timeTo ? invite.timeTo : this.asMomentUtcGuessEnd(invite.timeFrom), this.FORMAT_WITH_Z),
      in_loc: invite.addrText,
      st: this.asMomentUtc(invite.timeFrom, this.FORMAT_WITH_Z),
      title: invite.title,
      v: 60,
    };
    const url = `https://calendar.yahoo.com/?${this.stringify(details)}`;
    window.open(url, '_blank');
    return url;
  }
  public ical(invite: IInviteDB) {
    return this.apple(invite);
  }
  private stringify(details: any): string {
    return Object.entries(details).reduce((params, [key, value]) => params.set(key, (value as string)), new HttpParams()).toString();
  }
  private asMoment(valueOf: number | moment.Moment | undefined): moment.Moment {
    return moment(valueOf);
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
