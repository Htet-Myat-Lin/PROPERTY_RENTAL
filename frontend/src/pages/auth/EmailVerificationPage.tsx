import { Header } from "@/components/Header/Header";
import { EmailVerificationForm } from "@/features/auth/components/EmailVerificationForm";

export function EmailVerificationPage () {
    return(
        <>
            <Header />
            <EmailVerificationForm />
        </>
    )
}