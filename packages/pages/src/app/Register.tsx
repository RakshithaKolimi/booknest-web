import React, { useEffect } from 'react'

export default function Register(): React.ReactElement {
  /**
     * Runs an effect to set the page title
     */
    useEffect(() => {
      document.title = 'Register'
    }, [])

  return (
    <div className="prose">
      <h2>Register to BookNest</h2>
    </div>
  )
}
