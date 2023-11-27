import { deleteField, updateDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../_f_i_r_e_base/_f_i_r_e_base';
// const db = getFirestore(app);
// const db = initializeFirestore(app, { experimentalForceLongPolling: true }) ; //to solve a problem with db because of slow connection
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

    getData: async (userId) => {
        const docChatsRef = doc(db, 'chats', userId);
        // const docImagesRef = doc(db, 'images', userId);
        let returnObject = { chats: null, images: null };

        try {
            const docChatsSnap = await getDoc(docChatsRef);
            //for images snap
            // const docImagesSnap = await getDoc(docImagesRef);
            if (docChatsSnap.exists()) {
                returnObject = {
                    ...returnObject,
                    chats: docChatsSnap.data()
                }
            }
            // if (docImagesSnap.exists()) {
            //     returnObject = {
            //         ...returnObject,
            //         images: docImagesSnap.data()
            //     }
            // }
            return returnObject;


        } catch (error) {
            console.error(error)
        }
    },

    updateData: async (path, userId, id, data) => {
        const docRef = doc(db, path, userId);

        let res = await updateDoc(docRef,
            {
                [id]: data
            },
            { merge: true });

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
    }

}