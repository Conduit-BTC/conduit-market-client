// import "@/styles/index.css";
import '@/styles/site.css'
import React from 'react' // Add this import
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import autoAnimate from '@formkit/auto-animate'

const container = document.getElementById('root') as HTMLElement

if (container) autoAnimate(container)

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
