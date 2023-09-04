import { deleteField, getFirestore, updateDoc } from 'firebase/firestore'
import { app } from '../_f_i_r_e_base/_f_i_r_e_base';

import { doc, getDoc } from "firebase/firestore";
export const dbAPI = {


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

}