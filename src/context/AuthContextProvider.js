'use client'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app as firebase_app } from '../_f_i_r_e_base/_f_i_r_e_base';
import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const AuthContext = React.createContext();

export const useAuthContext = () => {
    return React.useContext(AuthContext)
}


const AuthContextProvider = ({ children }) => {

    const auth = getAuth(firebase_app);
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    // user context
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // prod mode If
            // if (user && user.emailVerified === true ) {

            // dev mode IF
            if (user && user.emailVerified === true || (user && user.email === process.env.NEXT_PUBLIC_DEV_EMAIL)) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        })
        return () => unsubscribe();
    }, [])

    return (
        <AuthContext.Provider value={user}>
            {loading
                ? <LoadingSpinner spinnerColor={'purple'} progress={25} />
                : children
            }
            {/* {loading ? <div>Loading..Please wait..</div> : children} */}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;