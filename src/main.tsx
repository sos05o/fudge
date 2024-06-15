import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App.tsx'

// classNameを#rootのdiv要素に設定
const root = document.getElementById('root')
if (root) {
  root.className = 'bg-gray-900 text-white'
}

ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
