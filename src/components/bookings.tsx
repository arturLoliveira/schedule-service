import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
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
interface ProfessionalData {
  name: string;
}

interface UserData {
  name: string;
}

interface ServiceData {
  name: string;
}

const BookingsList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
    
        const data = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const bookingData = docSnap.data();
        
            let professionalName = "Desconhecido";
            let userName = "Desconhecido";
            let serviceName = "Desconhecido";
        
            try {
              
              if (bookingData.professionalName && bookingData.professionalName instanceof Object) {
                const professionalDoc = await getDoc(doc(db, "professionals", bookingData.professionalName.id));
                if (professionalDoc.exists()) {
                  const professionalData = professionalDoc.data() as ProfessionalData; 
                  professionalName = professionalData.name || "Desconhecido";
                }
              }
              if (bookingData.userName && bookingData.userName instanceof Object) {
                const userDoc = await getDoc(doc(db, "users", bookingData.userName.id));
                if (userDoc.exists()) {
                  const userData = userDoc.data() as UserData; 
                  userName = userData.name || "Desconhecido";
                }
              }
              if (bookingData.serviceName && bookingData.serviceName instanceof Object) {
                const serviceDoc = await getDoc(doc(db, "services", bookingData.serviceName.id));
                if (serviceDoc.exists()) {
                  const serviceData = serviceDoc.data() as ServiceData; 
                  serviceName = serviceData.name || "Desconhecido";
                }
              }
            } catch (error) {
              console.error("Erro ao recuperar detalhes do agendamento:", error);
            }
        
            return {
              id: docSnap.id,
              date: bookingData.date || "",
              time: bookingData.time || "",
              professionalName,
              userName,
              serviceName,
              status: bookingData.status || "Desconhecido",
            };
          })
        );
        
    
        setBookings(data);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        setError("Erro ao carregar os agendamentos.");
      }
    };
    

    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const validStatuses = ["marcado", "cancelado"];
      if (!validStatuses.includes(status)) {
        setMessage("Status inválido. Use 'marcado' ou 'cancelado'.");
        return;
      }

      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status });

      setMessage(`Reserva ${status} com sucesso!`);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status da reserva:", error);
      setMessage("Erro ao atualizar status da reserva.");
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section id="bookings" className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Time</th>
            <th className="border px-4 py-2 text-left">User</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Professional</th>
            <th className="border px-4 py-2 text-left">Service</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        {bookings.length > 0 ? (
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border px-4 py-2">{booking.id}</td>
                <td className="border px-4 py-2">{booking.date}</td>
                <td className="border px-4 py-2">{booking.time}</td>
                <td className="border px-4 py-2">{booking.userName}</td>
                <td className="border px-4 py-2">{booking.status}</td>
                <td className="border px-4 py-2">{booking.professionalName}</td>
                <td className="border px-4 py-2">{booking.serviceName}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => updateBookingStatus(booking.id, "marcado")}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                  >
                    Marcado
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.id, "cancelado")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancelado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <p>Sem agendamentos disponíveis.</p>
        )}
      </table>
    </section>
  );
};

export default BookingsList;
