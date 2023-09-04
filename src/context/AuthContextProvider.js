import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app as firebase_app } from '../_f_i_r_e_base/_f_i_r_e_base';
import React from 'react';

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
            if (user) {
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
            {loading ? <div>Loading..</div> : children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;