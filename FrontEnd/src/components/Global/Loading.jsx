// Librarys 
import React from 'react'
// import styled, { keyframes } from 'styled-components'

// Component 
const AdminLoadingScreen = ({ message = "Procesando..." }) => {
  return (
    <main className={'loadingState'}>
      <div className={'spinner'}></div>
      <p className={'loadingText'}>{message}</p>
    </main>
  )
}

export default AdminLoadingScreen