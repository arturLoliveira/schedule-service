import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

const addUser = async (userData) => {
  const { email, name, password, role } = userData;

  try {
    const docRef = await addDoc(collection(db, "users"), {
        email, name, password, role
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao adicionar user:", error);
    throw new Error("Erro ao adicionar user.");
  }
};

export default addUser;
