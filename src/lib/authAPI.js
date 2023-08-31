import { app } from '../utilities/_f_i_r_e_base';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'


export const authAPI = {
    signIn: () => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;

                return user
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }
}