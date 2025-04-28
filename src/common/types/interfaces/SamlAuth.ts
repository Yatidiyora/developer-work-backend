import type * as express from 'express';

export interface Profile {
  issuer?: string;
  sessionIndex?: string;
  nameID?: string;
  nameIDFormat?: string;
  nameQualifier?: string;
  spNameQualifier?: string;
  ID?: string;
  mail?: string;
  email?: string;
  ['urn:oid:0.9.2342.19200300.100.1.3']?: string;
  getAssertionXml?(): string;
  getAssertion?(): Record<string, unknown>;
  getSamlResponseXml?(): string;
  [attributeName: string]: unknown;
}

export interface RequestWithUser extends express.Request {
  samlLogoutRequest: any;
  user?: Profile;
}

export interface LogoutTokenPayload {
  id: string;
}
