import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore"
import { firestore } from "../../firebase-config"
import { CreateSyllabus } from "../models/createSyllabus";
import { ISchool } from "../models/school";

export const APIService = {
    createSyllabus: async (data: CreateSyllabus) => {
        return await addDoc(collection(firestore, 'syllabus'), data);
    },
    updateSchool: async (data: Partial<ISchool>, id: string) => {
        const docRef = doc(firestore, "schools", id);
        return await setDoc(docRef, data, {merge: true});
    },
    deleteSchool: async (id: string) => {
        return await deleteDoc(doc(firestore, "schools", id));
    },
    addSchool: async (data: Omit<ISchool, "$id">) => {
        return await addDoc(collection(firestore, 'schools'), data);
    }
}