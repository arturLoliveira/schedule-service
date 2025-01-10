import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

const addProfessional = async (professionalData) => {
  const { schedule, name, specialization } = professionalData;

  try {
    const docRef = await addDoc(collection(db, "professionals"), {
        schedule, name, specialization
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao adicionar serviço:", error);
    throw new Error("Erro ao adicionar serviço.");
  }
};

export default addProfessional;
