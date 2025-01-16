import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

interface Booking {
    id: string;
    date: string;
    time: string;
    professionalName: string | null;
    serviceName: string | null;
    status: string;
}
interface ProfessionalData {
    name: string;
  }
  interface ServiceData {
    name: string;
  }

const UserBookingsList: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
          
            try {
              const bookingsRef = collection(db, "bookings");
              const q = query(bookingsRef, where("userRef", "==", user.uid));
              const querySnapshot = await getDocs(q);
          
              const data = await Promise.all(
                querySnapshot.docs.map(async (docSnap) => {
                  const bookingData = docSnap.data();
          
                  // Buscar nome do profissional
                  let professionalName = "Desconhecido";
                  if (bookingData.professionalName) {
                    const professionalDoc = await getDoc(bookingData.professionalName);
                    if (professionalDoc.exists()) {
                      const professionalData= professionalDoc.data() as ProfessionalData;
                      professionalName = professionalData.name || "Desconhecido";
                    }
                  }
          
                  // Buscar nome do serviço
                  let serviceName = "Desconhecido";
                  if (bookingData.serviceName) {
                    const serviceDoc = await getDoc(bookingData.serviceName);
                    if (serviceDoc.exists()) {
                      const serviceData = serviceDoc.data() as ServiceData;
                      serviceName = serviceData.name || "Desconhecido"
                    }
                  }
          
                  return {
                    id: docSnap.id,
                    date: bookingData.date || "",
                    time: bookingData.time || "",
                    status: bookingData.status || "Desconhecido",
                    professionalName,
                    serviceName,
                    userName: bookingData.userName || "Usuário desconhecido",
                  };
                })
              );
          
              setBookings(data);
            } catch (err) {
              console.error("Erro ao buscar agendamentos:", err);
            }
          };
          

        if (!loading) {
            fetchBookings();
        }
    }, [user, loading]);


    return (
        <section id="bookings" className="bg-white rounded shadow p-4 mb-6">

            {message && <p className="text-green-500 mb-4">{message}</p>}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2 text-left">Data</th>
                        <th className="border px-4 py-2 text-left">Horario</th>
                        <th className="border px-4 py-2 text-left">Status</th>
                        <th className="border px-4 py-2 text-left">Funcionario</th>
                        <th className="border px-4 py-2 text-left">Serviço</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td className="border px-4 py-2">{booking.date}</td>
                                <td className="border px-4 py-2">{booking.time}</td>
                                <td className="border px-4 py-2">{booking.status}</td>
                                <td className="border px-4 py-2">{booking.professionalName}</td>
                                <td className="border px-4 py-2">{booking.serviceName}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center py-4">
                                Sem agendamentos disponíveis.
                            </td>
                        </tr>
                    )}
                </tbody>


            </table>
        </section>
    );
};

export default UserBookingsList;
