import { AxiosResponse } from 'axios'

import api from '../api'

export type IRegisterInput = {
  email: string
  first_name: string
  last_name: string
  password: string
}

export type ILoginInput = {
  email: string
  password: string
}

export type IForgotPasswordInput = {
  email: string
}

export type ILoginResponse = {
  message: string
  token: string
}

export async function forgotPassword(
  input: IForgotPasswordInput
): Promise<AxiosResponse<string>> {
  return await api.post<string>('/forgot-password', input)
}

export async function register(
  input: IRegisterInput
): Promise<AxiosResponse<string>> {
  return await api.post<string>('/register', input)
}

export async function login(
  input: ILoginInput
): Promise<AxiosResponse<ILoginResponse>> {
  return await api.post<ILoginResponse>('/login', input)
}
