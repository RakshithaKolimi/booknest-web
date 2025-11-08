import './header.css'

import { cn } from '@booknest/utils'
import React from 'react'

import { Logo } from '../Icons/Logo/Logo'

export type HeaderProps = {
  className?: string
}

export function Header(props: HeaderProps): React.ReactElement {
  const { className } = props
  return (
    <h2 className={cn('booknest-header', className ? className : '')}>
      <Logo width="64px" height="64px" className="logo-image" />
      <span>BookNest</span>
    </h2>
  )
}
