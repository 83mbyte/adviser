import { deleteField, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../_f_i_r_e_base/_f_i_r_e_base';

export const dbAPI = {
    getSectionData: async (sectionName) => {
        const docRef = doc(db, 'serviceData', sectionName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            return docSnap.data()
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            return null
        }
    },

    getHistoryData: async (userId) => {
        const docChatsRef = doc(db, 'chats', userId);
        const docSummarizeYTRef = doc(db, 'summarizeYT', userId);
        // const docImagesRef = doc(db, 'images', userId);
        let returnObject = { chats: null, summarizeYT: null };

        try {
            const docChatsSnap = await getDoc(docChatsRef);
            const docSummarizeYTSnap = await getDoc(docSummarizeYTRef);

            if (docChatsSnap.exists()) {
                returnObject = {
                    ...returnObject,
                    chats: docChatsSnap.data()
                }
            }
            if (docSummarizeYTSnap.exists()) {
                returnObject = {
                    ...returnObject,
                    summarizeYT: docSummarizeYTSnap.data()
                }
            }

            return returnObject;


        } catch (error) {
            console.error(error)
        }
    },

    updateData: async (path, userId, id, data) => {
        const docRef = doc(db, path, userId);

        try {
            let res = await updateDoc(docRef,
                {
                    [id]: data
                },
                { merge: true });
            return ({ status: 'Success', message: 'updated data' })
        } catch (error) {
            return ({ status: 'Error', message: error })

        }

    },
    deleteDocument: async (path, userId, id) => {
        const docRef = doc(db, path, userId);
        await updateDoc(docRef, {
            [id]: deleteField()
        })
        return 'chat removed'
    },

    // users
    getUserData: async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data());
            return docSnap.data()
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            return null
        }
    },
    updateUserData: async (userId, field, data) => {
        const docRef = doc(db, 'users', userId);

        await updateDoc(docRef,
            {
                [field]: data
            },
            { merge: true });
    },

    //predefined data
    getPredefinedData: async (documentName) => {
        const docRef = doc(db, 'predefined_data', documentName);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                //console.log("Document data:", docSnap.data());
                return docSnap.data()
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
                return null
            }
        } catch (error) {
            console.error(error)
        }
    },

    //contact
    sendContactForm: async ({ id, fullname, email, message }) => {
        const docRef = doc(db, 'contactForm', id);
        return await setDoc(docRef, {
            email, fullname, message
        }).then(() => {
            return ({ status: 'ok', message: 'Message sent' })
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return ({ status: 'error', errorCode, errorMessage })
        });
    }

}