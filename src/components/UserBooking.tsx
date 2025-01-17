import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaUser } from "react-icons/fa";

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
                        let professionalName = "Desconhecido";
                        if (bookingData.professionalName) {
                            const professionalDoc = await getDoc(bookingData.professionalName);
                            if (professionalDoc.exists()) {
                                const professionalData = professionalDoc.data() as ProfessionalData;
                                professionalName = professionalData.name || "Desconhecido";
                            }
                        }
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

    const updateBookingStatus = async (bookingId: string, status: string) => {
        try {
            const validStatuses = ["cancelado"];
            if (!validStatuses.includes(status)) {
                setMessage("Status inválido. Use 'cancelado'.");
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

export default UserBookingsList;
