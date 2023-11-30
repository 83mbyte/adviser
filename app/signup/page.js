import SignUp from "@/src/site_pages/SignUpPage/SignUp";
import { Suspense } from "react";

const SignUpFallback = () => {
    return (<div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}> <p style={{ textAlign: 'center' }}>loading..</p></div>)
}
export default async function Signup_Page() {

    return (
        <Suspense fallback={<SignUpFallback />}>
            <SignUp />
        </Suspense>
    )
}
