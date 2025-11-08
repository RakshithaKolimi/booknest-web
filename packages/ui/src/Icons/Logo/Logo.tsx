import React from 'react'

export type ILogoProps = {
  width?: string
  height?: string
  className?: string
  style?: React.CSSProperties
}

export function Logo(props: ILogoProps): React.ReactElement {
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
