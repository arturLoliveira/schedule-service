import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

const addService = async (serviceData) => {
  const { description, name, price, professionalId } = serviceData;

  try {
    const professionalRef = doc(db, "professionals", professionalId);

    const docRef = await addDoc(collection(db, "services"), {
      description,
      name,
      price,
      professional: professionalRef, 
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao adicionar serviço:", error);
    throw new Error("Erro ao adicionar serviço.");
  }
};

export default addService;
