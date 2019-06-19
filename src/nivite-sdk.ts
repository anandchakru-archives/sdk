import * as moment from 'moment';

export const dateTimeUTCForGooglenYahoo = 'YYYYMMDD[T]HHmmss[Z]';
export const dateTimeUTCForOutlook = 'YYYYMMDD[T]HHmmss';
export const APPLE_SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
export const APPLE_START = 'BEGIN:VCALENDAR' + APPLE_SEPARATOR + 'PRODID:nivite.com' + APPLE_SEPARATOR + 'VERSION:2.0' + APPLE_SEPARATOR;
export const APPLE_END = APPLE_SEPARATOR + 'END:VCALENDAR';

export function asMoment(valueOf: number | moment.Moment | undefined): moment.Moment {
  return moment(valueOf);
}
export function asMomentUtc(valueOf: number | moment.Moment | undefined, format: string): string {
  return moment(valueOf)
    .utc()
    .format(format);
}
export function asMomentUtcGuessEnd(valueOf: number | moment.Moment | undefined): moment.Moment {
  return moment(valueOf).add(5, 'hours');
}

export interface ILink {
  href?: string;
  templated?: boolean;
}

export interface IBaseDB {
  oid?: string;
  _links?: { [key: string]: ILink };
}
export interface IInviteDB extends IBaseDB {
  inviteId?: number;
  type?: string;
  title: string;
  hostName?: string;
  timeFrom?: moment.Moment | number; // Server expects UTC epoch time in milliseconds
  timeTo?: moment.Moment | number; // Server expects UTC epoch time in milliseconds
  tz?: string;
  longMsg?: string;
  shortMsg?: string;
  addrName?: string;
  addrUrl?: string;
  addrText?: string;
  addrDetails?: string;
  defaultYes?: boolean;
  showGuests?: boolean;
  autoApproveNewRsvp?: boolean;
  visibleByLink?: boolean;
  photos?: IInvitePhotoDB[];
  customerInvites?: ICustomerInviteDB[];
  customerInvite?: ICustomerInviteDB;
  template?: ITemplateDB;
  _dateFrom?: Date;
  _dateTo?: Date;
  _timeFrom?: Date;
  _timeTo?: Date;
  invitePreviewKey?: string;
}

export interface IInvitePhotoDB extends IBaseDB {
  invitePhotoId?: number;
  url: string;
  tags?: string;
  title?: string;
  description?: string;
}

export interface ITemplateExtDB extends IBaseDB {
  url?: string;
  type?: string;
}
export interface ITemplateKwDB extends IBaseDB {
  keyword?: string;
}
export interface ITemplateDB extends IBaseDB {
  title?: string;
  editorCss?: string;
  editorJs?: string;
  editorHtml?: string;
  externalCss?: string[];
  externalJs?: string[];
  published?: boolean;
  reviewed?: boolean;
  rating?: number;
  usageCnt?: number;
  exts?: ITemplateExtDB[];
  kws?: ITemplateKwDB[];
}
export interface ICustomerInviteDB extends IBaseDB {
  customerInviteId?: number;
  role?: 'HOST' | 'COLLAB' | 'GUEST' | 'VIEW';
  rsvp?: 'Q' | 'P' | 'V' | 'B' | 'Y' | 'N' | 'M' | 'O' | 'Z';
  opened?: boolean;
  replied?: boolean;
  emailed?: boolean;
  flaged?: boolean;
  adultCount?: number;
  kidCount?: number;
  viewCount?: number;
  longMsg?: string;
  shortMsg?: string;
  hostApproved?: boolean;
  notifyUpdates?: boolean;
  customer?: ICustomerDB;
  customerEmail?: string;
  customerName?: string;
  customerId?: number;
  customerOid?: string;
}
export interface ICustomerRoleDB extends IBaseDB {
  role?: string;
}
export interface ICustomerDB extends IBaseDB {
  customerId?: number;
  uid?: string;
  name?: string;
  email?: string;
  picture?: string;
  locked?: boolean;
  enabled?: boolean;
  tz?: string;
  roles?: ICustomerRoleDB[];
}
