import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, getDoc, addDoc, query, where } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

interface Option {
  id: string;
  name: string;
}

const BookingForm: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [professionalId, setProfessionalId] = useState<string>("");
  const [professionalName, setProfessionalName] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUsersName] = useState("");
  const [serviceName, setServiceName] = useState<string>("");
  const [servicePrice, setServicePrice] = useState<string>("");
  const [status, setStatus] = useState<string>("marcado");
  const [professionals, setProfessionals] = useState<Option[]>([]);
  const [services, setServices] = useState<Option[]>([]);
  const [availableTimes, setAvailableTimes] = useState<{ time: string; disabled: boolean }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesSnapshot = await getDocs(collection(db, "services"));
        const servicesData: Option[] = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setServices(servicesData);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfessionalsForService = async () => {
      if (!serviceId) {
        setProfessionals([]);
        return;
      }

      try {
        const serviceRef = doc(db, "services", serviceId);
        const serviceDoc = await getDoc(serviceRef);

        if (!serviceDoc.exists()) {
          setMessage("Serviço não encontrado.");
          return;
        }

        setServiceName(serviceDoc.data()?.name || "");
        setServicePrice(serviceDoc.data()?.price || "0.00");

        const professionalRefs = Array.isArray(serviceDoc.data()?.professionals)
          ? serviceDoc.data()?.professionals
          : [];
        const professionalPromises = professionalRefs.map((ref: any) => getDoc(ref));
        const professionalDocs = await Promise.all(professionalPromises);

        const professionalsData = professionalDocs
          .filter((doc) => doc.exists())
          .map((doc) => ({
            id: doc.id,
            name: doc.data()?.name,
          }));

        setProfessionals(professionalsData);
      } catch (error) {
        console.error("Erro ao carregar profissionais:", error);
        setMessage("Erro ao carregar profissionais.");
      }
    };

    fetchProfessionalsForService();
  }, [serviceId]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!professionalId || !date) {
        setAvailableTimes([]);
        return;
      }

      try {
        const professionalRef = doc(db, "professionals", professionalId);
        const professionalDoc = await getDoc(professionalRef);

        if (!professionalDoc.exists()) {
          setMessage("Profissional não encontrado.");
          return;
        }

        const availability = professionalDoc.data()?.availability || {};
        const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
        }).toLowerCase();

        if (!Array.isArray(availability[dayOfWeek])) {
          setAvailableTimes([]);
          return;
        }

        const times = availability[dayOfWeek];

        const bookingsRef = collection(db, "bookings");
        const q = query(
          bookingsRef,
          where("professionalName", "==", professionalRef),
          where("date", "==", date)
        );
        const querySnapshot = await getDocs(q);

        const bookedTimes = querySnapshot.docs.map((doc) => doc.data()?.time);

        const updatedTimes = times.map((time: string) => ({
          time,
          disabled: bookedTimes.includes(time),
        }));

        setAvailableTimes(updatedTimes);
      } catch (error) {
        console.error("Erro ao carregar horários disponíveis:", error);
        setMessage("Erro ao carregar horários disponíveis.");
      }
    };

    fetchAvailableTimes();
  }, [professionalId, date]);

  useEffect(() => {
    const updateProfessionalName = () => {
      const selectedProfessional = professionals.find((prof) => prof.id === professionalId);
      setProfessionalName(selectedProfessional?.name || "");
    };

    updateProfessionalName();
  }, [professionalId, professionals]);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const user = userDoc.data()?.name;
          const usersId = userDoc.id
          setUsersName(user);
          setUserId(usersId)
        }
      }
    };
    fetchUser();
  }, [user]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !professionalId || !serviceId || !status) {
      setMessage("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const bookingsRef = collection(db, "bookings");
      const professionalRef = doc(db, "professionals", professionalId);

      const q = query(
        bookingsRef,
        where("professionalName", "==", professionalRef),
        where("date", "==", date),
        where("time", "==", time)
      );
      const querySnapshot = await getDocs(q);

      const conflictingBooking = querySnapshot.docs.find(
        (doc) => doc.data()?.status === "confirmado"
      );

      if (conflictingBooking) {
        setMessage("Este horário já está reservado por outro agendamento confirmado.");
        return;
      }

      const bookingData = {
        date,
        time,
        status,
        professionalName: professionalRef,
        userName: userName,
        userRef: userId,
        serviceName: doc(db, "services", serviceId),
      };

      const docRef = await addDoc(bookingsRef, bookingData);
      setMessage(`Agendamento criado com sucesso! ID: ${docRef.id}`);

      setDate("");
      setTime("");
      setProfessionalId("");
      setServiceId("");
      setStatus("marcado");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      setMessage("Erro ao criar agendamento.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Fazer uma reserva</h2>

        <div>
          <h3 className="text-lg font-semibold">Selecione a Data</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Serviço</h3>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Profissional:</label>
          <select
            value={professionalId}
            onChange={(e) => setProfessionalId(e.target.value)}
            disabled={!serviceId}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Selecione um profissional</option>
            {professionals.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Horários</h3>
          <div className="flex flex-wrap gap-2">
            {availableTimes.map(({ time: availableTime, disabled }) => (
              <button
                key={availableTime}
                className={`px-4 py-2 rounded transition ${disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : time === availableTime
                      ? "bg-teal-700 text-white"
                      : "bg-teal-500 text-white hover:bg-teal-600"
                  }`}
                disabled={disabled}
                onClick={() => setTime(availableTime)}
              >
                {availableTime}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Resumo</h3>
          <div className="flex justify-between">
            <span className="text-gray-700">Serviço:</span>
            <span className="text-gray-800 font-bold">{serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Profissional:</span>
            <span className="text-gray-800 font-bold">{professionalName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Preço:</span>
            <span className="text-gray-800 font-bold">R$ {servicePrice}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
        >
          Agendar
        </button>

        {message && <p className="text-center text-teal-500 mt-4">{message}</p>}
      </div>
    </form>
  );
};

export default BookingForm;
