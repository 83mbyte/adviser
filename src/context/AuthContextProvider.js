'use client'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app as firebase_app } from '../_f_i_r_e_base/_f_i_r_e_base';
import React from 'react';
import { Box, Spinner } from '@chakra-ui/react';

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
                ? <Box
                    display={'flex'}
                    height={'100%'}
                    flexDirection={'column'}
                    flex={1}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <Spinner thickness='4px'
                        speed='2s'
                        emptyColor='gray.200'
                        color='green.500'
                        size='xl'
                    />
                </Box>
                : children
            }
            {/* {loading ? <div>Loading..Please wait..</div> : children} */}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;