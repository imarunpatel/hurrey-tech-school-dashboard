
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { auth, firestore } from "../../firebase-config";
import { doc, setDoc } from "firebase/firestore";

export const uploadImage = async (file: File) => {
    if (!file) return;
    const storage = getStorage();
    const storageRef = ref(storage, `user-assets/profile-img/${Date.now().toLocaleString()}`);

    let imageUrl: string | undefined = undefined;
    await uploadBytes(storageRef, file).then((snapshot) => {
        return getDownloadURL(snapshot.ref);
    }).then(downloadURL => {
        imageUrl = downloadURL ? downloadURL : undefined;
    });

    let data = {
        imgUrl: imageUrl,
    }
    const user = auth.currentUser;
    if(user) {
        const docRef = doc(firestore, "users", user.uid);
        await setDoc(docRef, data, {merge: true});
    }
    return imageUrl;
}