import { deleteField, getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore'
import { app } from '../_f_i_r_e_base/_f_i_r_e_base';
const db = getFirestore(app);
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
        const docRef = doc(db, 'chats', userId);


        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data());
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

    updateData: async (userId, chatId, data) => {
        const docRef = doc(db, 'chats', userId);

        let res = await updateDoc(docRef,
            {
                [chatId]: data
            },
            { merge: true });

    },
    deleteChat: async (userId, chatId) => {
        const docRef = doc(db, 'chats', userId);
        await updateDoc(docRef, {
            [chatId]: deleteField()
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