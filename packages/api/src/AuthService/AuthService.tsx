import { postData } from '../request'

export enum UserRoleType {
  User = 'USER',
  Admin = 'ADMIN',
}

export type IRegisterInput = {
  email: string
  first_name: string
  last_name: string
  mobile: string
  password: string
  role: string
}

export type ILoginInput = {
  email: string
  mobile?: string
  password: string
}

export type IForgotPasswordInput = {
  email: string
  mobile?: string
}

export type ILoginResponse = {
  message: string
  token: string
}

export async function forgotPassword(
  input: IForgotPasswordInput
): Promise<string> {
  return postData<string, IForgotPasswordInput>('/forgot-password', input)
}

export async function register(
  input: IRegisterInput
): Promise<string> {
  return postData<string, IRegisterInput>('/register', input)
}

export async function login(
  input: ILoginInput
): Promise<ILoginResponse> {
  return postData<ILoginResponse, ILoginInput>('/login', input)
}
