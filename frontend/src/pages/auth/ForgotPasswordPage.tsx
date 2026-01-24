import { Header } from '@/components/Header/Header'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import React from 'react'

const ForgotPasswordPage = () => {
  return (
    <React.Fragment>
      <Header />
      <ForgotPasswordForm />
    </React.Fragment>
  )
}

export default ForgotPasswordPage
