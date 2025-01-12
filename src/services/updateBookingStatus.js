import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ error: "O ID da reserva e o status são obrigatórios." });
    }

    const validStatuses = ["approved", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido. Use 'approved' ou 'canceled'." });
    }

    const bookingRef = doc(db, "bookings", bookingId);

    await updateDoc(bookingRef, { status });

    res.status(200).json({ message: `Reserva ${status} com sucesso!` });
  } catch (error) {
    console.error("Erro ao atualizar status da reserva:", error);
    res.status(500).json({ error: "Erro ao atualizar status da reserva." });
  }
};

export default updateBookingStatus;
