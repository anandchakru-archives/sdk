import moment from 'moment';

export class NiviteNamedNodeMap extends NamedNodeMap {
  constructor(public niviteclick: Attr) {
    super();
  }
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
  adultCountRequired?: boolean;
  kidCountRequired?: boolean;
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
  role?: 'HOST' | 'COLLAB' | 'GUEST' | 'UNAPPROVED';
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
  inviteId?: number;
  inviteOid?: string;
  referredByOid?: string; // If the Guests changes to new email and responds, capture the previously selected oid if any
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
export interface IAlert {
  msg: string;
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  error?: any;
}