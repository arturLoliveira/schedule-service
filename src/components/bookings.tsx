import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

interface Booking {
  id: string;
  date: string;
  time: string;
  professionalName: string | null;
  userName: string | null;
  serviceName: string | null;
  status: string;
}

const BookingsList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bookings"));

        const data = querySnapshot.docs.map((doc) => {
          const bookingData = doc.data();
          return {
            id: doc.id,
            date: bookingData.date,
            time: bookingData.time,
            professionalName: bookingData.professionalName,
            userName: bookingData.userName,
            serviceName: bookingData.serviceName,
            status: bookingData.status,
          };
        });

        setBookings(data);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        setError("Erro ao carregar os agendamentos.");
      }
    };

    fetchBookings();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Lista de Agendamentos</h1>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              <p><strong>Data:</strong> {booking.date}</p>
              <p><strong>Hora:</strong> {booking.time}</p>
              <p><strong>Profissional:</strong> {booking.professionalName}</p>
              <p><strong>Serviço:</strong> {booking.serviceName}</p>
              <p><strong>Usuário:</strong> {booking.userName}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Sem agendamentos disponíveis.</p>
      )}
    </div>
  );
};

export default BookingsList;
