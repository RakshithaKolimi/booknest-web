import { getData, postData, putData } from '../request'

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
  role: UserRoleType
}

export type IAdminRegisterInput = {
  email: string
  first_name: string
  last_name: string
  mobile: string
  password: string
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

export type IForgotPasswordResponse = {
  message: string
  reset_token?: string
}

export type ILoginResponse = {
  message: string
  access_token: string
  refresh_token: string
}

export type IUserProfile = {
  id: string
  first_name: string
  last_name: string
  email: string
  mobile: string
  role: UserRoleType
  email_verified: boolean
  mobile_verified: boolean
  use_sms: boolean
  created_at: string
}

export type IUserPreferencesInput = {
  use_sms: boolean
}

export async function forgotPassword(
  input: IForgotPasswordInput
): Promise<IForgotPasswordResponse> {
  return postData<IForgotPasswordResponse, IForgotPasswordInput>(
    '/forgot-password',
    input
  )
}

export async function resetPasswordWithToken(
  token: string,
  new_password: string
): Promise<{ message: string }> {
  return postData<{ message: string }, { token: string; new_password: string }>(
    '/reset-password/confirm',
    { token, new_password }
  )
}

export async function register(input: IRegisterInput): Promise<string> {
  return postData<string, IRegisterInput>('/register', input)
}

export async function registerAdmin(
  input: IAdminRegisterInput
): Promise<string> {
  return postData<string, IAdminRegisterInput>('/register-admin', input)
}

export async function login(input: ILoginInput): Promise<ILoginResponse> {
  return postData<ILoginResponse, ILoginInput>('/login', input)
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return postData<{ message: string }, { token: string }>('/verify-email', {
    token,
  })
}

export async function verifyMobile(otp: string): Promise<{ message: string }> {
  return postData<{ message: string }, { otp: string }>('/verify-mobile', {
    otp,
  })
}

export async function resendEmailVerification(
  email?: string
): Promise<{ message: string }> {
  return postData<{ message: string }, { email?: string }>(
    '/resend-email-verification',
    email ? { email } : {}
  )
}

export async function resendMobileOTP(): Promise<{ message: string }> {
  return postData<{ message: string }>('/resend-mobile-otp')
}

export async function getUser(userID: string): Promise<IUserProfile> {
  return getData<IUserProfile>(`/user/${userID}`)
}

export async function updateUserPreferences(
  userID: string,
  input: IUserPreferencesInput
): Promise<IUserPreferencesInput> {
  return putData<IUserPreferencesInput, IUserPreferencesInput>(
    `/user/${userID}/preferences`,
    input
  )
}
