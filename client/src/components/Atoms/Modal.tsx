import React, { useState, ReactNode } from 'react'
// import styled from 'styled-components'
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

// const CustomDialog = styled(Dialog)`
//   border: 2px solid;
//   box-shadow: 0px 0px 5px 10px #888888;

//   // Use for full width border
//   // div.bp3-dialog-header {
//   //   border-bottom: 2px solid;
//   // }

//   //Use for partial width border 
//   .bp3-dialog-header {
//     position: relative !important;
//   }

//   .bp3-dialog-header:after {
//     content: "";
//     background: black;
//     position: absolute;
//     bottom: 0;
//     left: 3.5%;
//     height: 2px;
//     width: 93%;
//   }
// `

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