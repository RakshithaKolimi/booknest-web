import React from 'react'
import { IIconProps } from '../common/common'

export function Logout(props: IIconProps): React.ReactElement {
  const { width = '1em', height = '1em', className, style } = props
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logout"
      width={width}
      height={height}
      className={className}
      style={style}
    >
      <path
        d="M14.5 5.5a6.5 6.5 0 1 1 0 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 12h11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m16 9 4 3-4 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
