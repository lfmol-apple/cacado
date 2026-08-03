export interface Token{
  id:string;
  authenticated: boolean;
  created: Date;
  expiration: Date;
  accessToken: string;
  message: string;
  usuario: string;
  email: string;
  NameId:string;
}
