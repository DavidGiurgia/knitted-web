import { Image, Modal, ModalBody, ModalContent } from "@heroui/react"
import React from 'react'

const PictureModal = ({isOpen, onOpenChange, src, alt = "unknown picture"}) => {
  return (
    <Modal placement='center' backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className=''>
          {(onClose) => (
            <>
              <ModalBody className='p-0'>
                <Image onClick={onClose} className=' w-full' src={src} alt={alt} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
  )
}

export default PictureModal