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
  const [serviceId, setServiceId] = useState<string>("");
  const [status, setStatus] = useState<string>("marcado");
  const [professionals, setProfessionals] = useState<Option[]>([]);
  const [userName, setUsersName] = useState("");
  const [users, setUsers] = useState<Option[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [services, setServices] = useState<Option[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData: Option[] = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setUsers(usersData);

        const servicesSnapshot = await getDocs(collection(db, "services"));
        const servicesData: Option[] = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setServices(servicesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
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

        const professionalRefs = serviceDoc.data()?.professionals || [];
        const professionalPromises = professionalRefs.map((ref: any) => getDoc(ref));
        const professionalDocs = await Promise.all(professionalPromises);

        const professionalsData: Option[] = professionalDocs
          .filter((doc) => doc.exists())
          .map((doc) => ({
            id: doc.id,
            name: doc.data()?.name,
          }));

        setProfessionals(professionalsData);
      } catch (error) {
        console.error("Erro ao carregar profissionais para o serviço selecionado:", error);
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

        // Verifica se há horários disponíveis para o dia da semana
        if (!Array.isArray(availability[dayOfWeek])) {
          setAvailableTimes([]);
          return;
        }

        setAvailableTimes(availability[dayOfWeek]);
      } catch (error) {
        console.error("Erro ao carregar horários disponíveis:", error);
        setMessage("Erro ao carregar horários disponíveis.");
      }
    };

    fetchAvailableTimes();
  }, [professionalId, date]);
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
      const q = query(
        bookingsRef,
        where("professional", "==", doc(db, "professionals", professionalId)),
        where("date", "==", date),
        where("time", "==", time)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setMessage("Horário já foi agendado.");
        return;
      }

      const professionalRef = doc(db, "professionals", professionalId);
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
    <div>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl grid grid-cols-2 gap-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-2">Data:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Serviço:</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
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
            required
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
          <label className="block text-sm font-medium mb-2">Hora:</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={!availableTimes.length}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Selecione um horário</option>
            {availableTimes.map((availableTime) => (
              <option key={availableTime} value={availableTime}>
                {availableTime}
              </option>
            ))}
          </select>
          {!availableTimes.length && professionalId && date && (
            <p>Este profissional não possui horários disponíveis nesta data.</p>
          )}
        </div>
        <div>
        <label className="block text-sm font-medium mb-2">Usuario:</label>
          <input
            type="text"
            value={userName}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status:</label>
         <input
            type="text"
            value={status}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Criar Agendamento
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookingForm;
