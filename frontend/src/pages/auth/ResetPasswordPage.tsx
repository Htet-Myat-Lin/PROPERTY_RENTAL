import { Header } from '@/components/Header/Header'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'
import React from 'react'

const ResetPasswordPage = () => {
  return (
    <React.Fragment>
      <Header />
      <ResetPasswordForm />
    </React.Fragment>
  )
}

export default ResetPasswordPage
