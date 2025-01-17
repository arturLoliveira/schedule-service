import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { FaUser, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClock } from "react-icons/fa";

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
            let serviceName = "Desconhecido";

            try {
              if (bookingData.professionalName && bookingData.professionalName instanceof Object) {
                const professionalDoc = await getDoc(doc(db, "professionals", bookingData.professionalName.id));
                if (professionalDoc.exists()) {
                  const professionalData = professionalDoc.data() as ProfessionalData;
                  professionalName = professionalData.name || "Desconhecido";
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
              userName: bookingData.userName,
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
 const getStatusClass = (status: string) => {
         switch (status) {
           case "marcado":
             return "text-green-500 bg-green-100";
           case "cancelado":
             return "text-red-500 bg-red-100";
           default:
             return "text-gray-500 bg-gray-100";
         }
       };
 
     return (
         <section className="p-4">
           <h2 className="text-2xl font-bold mb-4">Agendamentos</h2>
           {message && <p className="text-green-500 mb-4">{message}</p>}
           {bookings.length > 0 ? (
             bookings.map((booking) => (
               <div
                 key={booking.id}
                 className="bg-white rounded-lg shadow-xl p-4 mb-4 flex flex-col md:flex-row justify-between items-center gap-4"
               >
                 <div className="flex-1">
                   <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
                   <p className="text-sm text-gray-600 flex items-center gap-2">
                     <FaUser className="text-gray-500" /> {booking.professionalName || "Desconhecido"}
                   </p>
                   <span
                     className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded ${getStatusClass(
                       booking.status
                     )}`}
                   >
                     {booking.status === "marcado" ? (
                       <FaCheckCircle className="inline-block mr-1" />
                     ) : booking.status === "cancelado" ? (
                       <FaTimesCircle className="inline-block mr-1" />
                     ) : null}
                     {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                   </span>
                 </div>
                 <div className="text-center">
                   <p className="text-sm text-gray-600 flex items-center gap-2">
                     <FaCalendarAlt className="text-gray-500" />{" "}
                     {new Date(booking.date).toLocaleDateString("pt-BR", {
                       day: "2-digit",
                       month: "long",
                     })}
                   </p>
                   <p className="text-sm text-gray-600 flex items-center gap-2">
                     <FaClock className="text-gray-500" /> {booking.time}
                   </p>
                 </div>
                 <button
                   onClick={() => updateBookingStatus(booking.id, "marcado")}
                   className={`px-4 py-2 rounded-md font-semibold text-white ${
                     booking.status === "marcado"
                       ? "bg-gray-400 cursor-not-allowed"
                       : "bg-green-500 hover:bg-green-600"
                   }`}
                   disabled={booking.status === "marcado"}
                 >
                   Marcar
                 </button>
                 <button
                   onClick={() => updateBookingStatus(booking.id, "cancelado")}
                   className={`px-4 py-2 rounded-md font-semibold text-white ${
                     booking.status === "cancelado"
                       ? "bg-gray-400 cursor-not-allowed"
                       : "bg-red-500 hover:bg-red-600"
                   }`}
                   disabled={booking.status === "cancelado"}
                 >
                   Cancelar
                 </button>
               </div>
             ))
           ) : (
             <p className="text-center text-gray-600">Sem agendamentos disponíveis.</p>
           )}
         </section>
       );
};

export default BookingsList;
