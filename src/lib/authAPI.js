import { app } from '../_f_i_r_e_base/_f_i_r_e_base';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'


export const authAPI = {
    signIn: async (email, password) => {
        const auth = getAuth(app);
        return await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                console.log('...still logging')
                const user = userCredential.user;

                return user
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                return ({ errorCode, errorMessage })
            });
    },

    signOut: () => {
        const auth = getAuth(app);
        signOut(auth).then(() => {
            console.log('SignOut done')
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }
}