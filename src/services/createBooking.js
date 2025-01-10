import { collection, addDoc, doc, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

const createBooking = async (req, res) => {
  try {
    const { date, time, professionalId, userId, serviceId, status } = req.body;

    if (!date || !time || !professionalId || !userId || !serviceId || !status) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const professionalRef = doc(db, "professionals", professionalId);
    const userRef = doc(db, "users", userId);
    const serviceRef = doc(db, "services", serviceId);

    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("professional", "==", professionalRef), 
      where("date", "==", date), 
      where("time", "==", time) 
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return res.status(400).json({ error: "Horário já foi agendado." });
    }

    const bookingData = {
      date,
      time,
      status,
      professional: professionalRef,
      user: userRef,
      service: serviceRef,
    };

    const docRef = await addDoc(collection(db, "bookings"), bookingData);

    res.status(201).json({
      message: "Agendamento adicionado com sucesso!",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Erro ao adicionar agendamento:", error);
    res.status(500).json({ error: "Erro ao adicionar agendamento." });
  }
};

export default createBooking;
