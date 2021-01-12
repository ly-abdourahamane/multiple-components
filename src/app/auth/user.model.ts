export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  roles?: any;
}

export interface LoginData {
  loginContext: LoginContext;
  remember?: boolean;
}

export interface LoginContext{
  email: string;
  password: string;
}

export interface Credentials {
  // Customize received credentials here
  name: string;
  token: string;
}
