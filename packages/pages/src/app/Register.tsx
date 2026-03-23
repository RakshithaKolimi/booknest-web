import React from 'react'

import { usePageTitle } from '../PageTitleProvider'

export default function Register(): React.ReactElement {
  usePageTitle('Register')

  return (
    <div className="prose">
      <h2>Register to BookNest</h2>
    </div>
  )
}
