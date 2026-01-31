import React, { useState } from 'react'
import { InventoryEntry } from '../InventoryEntryForm/InventoryEntryForm'

// Hook para manejar el modal de inventario
export const useInventoryModal = () => {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    return { isOpen, openModal, closeModal }
}

// Componente wrapper para el modal de inventario
export const InventoryModal = ({ URL = '', isOpen = false, onClose = () => {} }) => {
    return (
        <InventoryEntry 
            URL={URL}
            isOpen={isOpen}
            onClose={onClose}
        />
    )
}

export default InventoryModal
