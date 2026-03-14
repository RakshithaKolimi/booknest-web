import React from 'react'
import { IIconProps } from '../common/common'

export function Logo(props: IIconProps): React.ReactElement {
  const { width, height, className, style } = props
  return (
    <img
      src="/logo.svg"
      alt="Book Nest"
      width={width}
      height={height}
      className={className}
      style={style}
    />
  )
}
