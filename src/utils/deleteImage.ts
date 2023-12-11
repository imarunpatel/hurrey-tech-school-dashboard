import { deleteObject, getStorage, ref, } from "firebase/storage";

export const deleteImage = async (imgUrl: string) => {
    if (!imgUrl) return;

    const decodedUrl = decodeURIComponent(imgUrl);
    const pathQuery = decodedUrl.split('?');
    const filePath = pathQuery[0].replace("https://firebasestorage.googleapis.com/v0/b/hurrey-tech.appspot.com/o/", "").concat(".jpg");
    // const fileName = filePath.split("/").pop();
    const storage = getStorage();
    const storageRef = ref(storage, filePath);

    return deleteObject(storageRef);
}