// Librarys 
import React from 'react'
import styled, { keyframes } from 'styled-components'

// Component 
const AdminLoadingScreen = ({ message = "Procesando..." }) => {
  return (
    <div className={'loadingState'}>
        <div className={'spinner'}></div>
        <p className={'loadingText'}>{message}</p>
    </div>
  )
}

export default AdminLoadingScreen