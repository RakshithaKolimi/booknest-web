import { Button } from '@booknest/ui'
import React from 'react'

import { usePageTitle } from '../PageTitleProvider'

export default function Login(): React.ReactElement {
  usePageTitle('Login')

  /**
   * Render components
   */
  return (
    <div className="prose">
      <h2>Login to BookNest</h2>
      <Button label="Login" className="btn-login" />
    </div>
  )
}
