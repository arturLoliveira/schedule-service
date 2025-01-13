import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const UpdateBookingStatusForm: React.FC = () => {
  const [bookingId, setBookingId] = useState<string>("");
  const [status, setStatus] = useState<string>("approved");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingId || !status) {
      setMessage("O ID da reserva e o status são obrigatórios.");
      return;
    }

    const validStatuses = ["approved", "canceled"];
    if (!validStatuses.includes(status)) {
      setMessage("Status inválido. Use 'approved' ou 'canceled'.");
      return;
    }

    try {
      // Referência do documento da reserva
      const bookingRef = doc(db, "bookings", bookingId);

      // Atualiza o status da reserva
      await updateDoc(bookingRef, { status });

      setMessage(`Reserva atualizada para '${status}' com sucesso!`);
      setBookingId("");
      setStatus("approved");
    } catch (error) {
      console.error("Erro ao atualizar status da reserva:", error);
      setMessage("Erro ao atualizar status da reserva.");
    }
  };

  return (
    <div>
      <h1>Atualizar Status da Reserva</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID da Reserva:</label>
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="approved">Aprovado</option>
            <option value="canceled">Cancelado</option>
          </select>
        </div>
        <button type="submit">Atualizar Status</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateBookingStatusForm;
