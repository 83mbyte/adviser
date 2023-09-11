import { app } from '../_f_i_r_e_base/_f_i_r_e_base';
import { getAuth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth'


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

    signInGoogle: async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        auth.useDeviceLanguage();
        await signInWithRedirect(auth, provider);
    },

    signInAfterRedirect: async () => {
        const auth = getAuth();
        return getRedirectResult(auth)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access Google APIs.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                return user
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                //const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
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