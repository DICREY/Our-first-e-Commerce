// Librarys 
import React from 'react'

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