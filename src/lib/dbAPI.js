import { deleteField, updateDoc, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../_f_i_r_e_base/_f_i_r_e_base';


const PATH = {
    entry: process.env.NEXT_PUBLIC_DB_PATH,
    toUsers: process.env.NEXT_PUBLIC_DB_USERS_PATH,
    toPredefined: process.env.NEXT_PUBLIC_DB_PREDEFINED_PATH
}
const entryCollectionRef = collection(db, PATH.entry);

const getDocAllData = async (pathToDoc) => {
    //get all document data
    let returnObject = {};
    try {
        const querySnapshot = await getDocs(pathToDoc);

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots 
            returnObject = {
                ...returnObject,
                [doc.id]: doc.data()
            }
        });
        return ({ status: 'Success', payload: returnObject });
    } catch (error) {
        console.error(error);
        return ({ status: 'Error', payload: error });
    }
}

export const dbAPI = {
    temp_update: async (docName, subCollName, subCollDocName, value) => {

        const docRef = doc(entryCollectionRef, docName);
        const subCollRef = collection(docRef, subCollName);
        const subCollDocRef = doc(subCollRef, subCollDocName);
        try {
            await updateDoc(subCollDocRef, value, { merge: true })
            return ({ status: 'Success', message: 'data uploaded successfully' })

        } catch (error) {
            return ({ status: 'Error', message: error })
        }
    },

    getUserFullData: async (userId) => {

        const usersDocRef = doc(entryCollectionRef, PATH.toUsers);
        const userSubcollRef = collection(usersDocRef, userId);

        let returnObject = {};
        try {
            const querySnapshot = await getDocs(userSubcollRef);

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots 
                returnObject = {
                    ...returnObject,
                    [doc.id]: doc.data()
                }
            });
            return ({ status: 'Success', payload: returnObject });
        } catch (error) {
            console.error(error)
        }
    },

    updateServerData: async (payload) => {
        const usersDocRef = doc(entryCollectionRef, PATH.toUsers);
        const subCollRef = collection(usersDocRef, payload.userId);
        const docRef = doc(subCollRef, payload.docName);
        try {
            await updateDoc(docRef,
                {
                    [payload.field]: payload.data
                },
                { merge: true });
            return ({ status: 'Success' })
        } catch (error) {
            return ({ status: 'Error', message: 'Unable to update user data' })
        }
    },

    deleteDocument: async (payload) => {
        const usersDocRef = doc(entryCollectionRef, PATH.toUsers);
        const subCollRef = collection(usersDocRef, payload.userId);
        const docRef = doc(subCollRef, payload.docName);

        return new Promise((resolve, reject) => {
            try {
                updateDoc(docRef, {
                    [payload.field]: deleteField()
                }).then(() => {
                    resolve({ status: 'Success', message: 'Item was removed successfully' })
                })
            } catch (error) {
                reject({ status: 'Error', message: 'Unable to remove item from history' })
            }
        })
    },

    getPredefinedData: async (subCollName) => {
        const docRef = doc(entryCollectionRef, PATH.toPredefined);
        const subCollRef = collection(docRef, subCollName);

        return await getDocAllData(subCollRef);
    },

    getSectionDataOnIndexPage: async (sectionName) => {
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
    },
}