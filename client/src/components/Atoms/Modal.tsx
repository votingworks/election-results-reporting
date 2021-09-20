import React, { useState, ReactNode } from 'react'
import { Dialog, Classes } from '@blueprintjs/core'

export interface IModalOptions {
  title: ReactNode
  description: ReactNode
}

export const useModal = () => {
  // We show the dialog whenever options are set.
  // On close, we set options to null.
  const [options, setOptions] = useState<IModalOptions | null>(null)

  const modal = (newOptions: IModalOptions) => {
    setOptions(newOptions)
  }

  const onClose = () => {
    setOptions(null)
  }

  const modalProps = {
    isOpen: !!options,
    title: options ? options.title : '',
    description: options ? options.description : '',
    onClose,
  }

  return { modal, modalProps }
}

interface IModalProps extends IModalOptions {
  isOpen: boolean
  onClose: () => void
}

export const Modal = ({
  isOpen,
  title,
  description,
  onClose,
}: IModalProps) => {
  return (
    <Dialog onClose={onClose} title={title} isOpen={isOpen}>
      <div className={Classes.DIALOG_BODY}>{description}</div>
    </Dialog>
  )
}