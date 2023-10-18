import { deleteField, getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore'
import { app } from '../_f_i_r_e_base/_f_i_r_e_base';

export const dbAPI = {
    getSectionData: async (sectionName) => {
        const db = getFirestore(app);
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
        const db = getFirestore(app);
        const docRef = doc(db, 'chats', userId);
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

    updateData: async (userId, chatId, data) => {
        const db = getFirestore(app);
        const docRef = doc(db, 'chats', userId);

        let res = await updateDoc(docRef,
            {
                [chatId]: data
            },
            { merge: true });

    },
    deleteChat: async (userId, chatId) => {
        const db = getFirestore(app);
        const docRef = doc(db, 'chats', userId);

        await updateDoc(docRef, {
            [chatId]: deleteField()
        })
        return 'chat removed'
    },

    // users
    getUserData: async (userId) => {
        const db = getFirestore(app);
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
        const db = getFirestore(app);
        const docRef = doc(db, 'users', userId);

        await updateDoc(docRef,
            {
                [field]: data
            },
            { merge: true });
    },

    //predefined data
    getPredefinedData: async (documentName) => {
        const db = getFirestore(app);
        const docRef = doc(db, 'predefined_data', documentName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data());
            return docSnap.data()
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            return null
        }
    }

}