import './index.css'

import { PageTitleProvider } from '@booknest/pages'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageTitleProvider defaultTitle="BookNest">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PageTitleProvider>
  </React.StrictMode>
)
