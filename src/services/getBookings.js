import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

const getBookings = async (req, res) => {
  try {
    // Recupera os documentos da coleção "bookings"
    const querySnapshot = await getDocs(collection(db, "bookings"));

    // Mapeia os documentos para retornar os dados formatados
    const bookings = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // ID do documento
        date: data.date, // Data
        time: data.time, // Horário
        professionalId: data.professional ? data.professional.path.split("/")[1] : null, // Extrai o ID do profissional
        serviceId: data.service ? data.service.path.split("/")[1] : null, // Extrai o ID do serviço
        userId:data.user ?  data.user.path.split("/")[1] : null, // Extrai o ID do usuário
        status: data.status, // Status da reserva
      };
    });

    // Retorna os dados formatados
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Erro ao recuperar bookings:", error);
    res.status(500).json({ error: "Erro ao recuperar bookings." });
  }
};

export default getBookings;
