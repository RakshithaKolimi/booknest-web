import React from 'react'
import { Power } from 'lucide-react'
import { IIconProps } from '../common/common'

export function Logout(props: IIconProps): React.ReactElement {
  const { width, height, className, style } = props
  return (
    <Power
      name='Logout'
      width={width}
      height={height}
      className={className}
      style={style}
    />
  )
}
