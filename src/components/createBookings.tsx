import React, { useEffect, useState } from "react";
import { collection, doc, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

interface Option {
  id: string;
  name: string;
}

const BookingForm: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [professionalId, setProfessionalId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [status, setStatus] = useState<string>("pending");
  const [professionals, setProfessionals] = useState<Option[]>([]);
  const [users, setUsers] = useState<Option[]>([]);
  const [services, setServices] = useState<Option[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // Carrega as opções de profissionais, usuários e serviços ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carrega profissionais
        const professionalsSnapshot = await getDocs(collection(db, "professionals"));
        const professionalsData: Option[] = professionalsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setProfessionals(professionalsData);

        // Carrega usuários
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData: Option[] = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setUsers(usersData);

        // Carrega serviços
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !professionalId || !userId || !serviceId || !status) {
      setMessage("Todos os campos são obrigatórios.");
      return;
    }

    try {
      // Verifica se o horário já foi reservado
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
        setMessage("Horário já foi agendado.");
        return;
      }

      // Dados do agendamento
      const professionalName = professionals.find((p) => p.id === professionalId)?.name || "Desconhecido";
      const userName = users.find((u) => u.id === userId)?.name || "Desconhecido";
      const serviceName = services.find((s) => s.id === serviceId)?.name || "Desconhecido";

      const bookingData = {
        date,
        time,
        status,
        professional: professionalRef,
        professionalName,
        user: userRef,
        userName,
        service: serviceRef,
        serviceName,
      };

      const docRef = await addDoc(collection(db, "bookings"), bookingData);

      setMessage(`Agendamento criado com sucesso! ID: ${docRef.id}`);

      // Limpa o formulário
      setDate("");
      setTime("");
      setProfessionalId("");
      setUserId("");
      setServiceId("");
      setStatus("pending");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      setMessage("Erro ao criar agendamento.");
    }
  };

  return (
    <div>
      <h1>Criar Agendamento</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Data:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hora:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Profissional:</label>
          <select
            value={professionalId}
            onChange={(e) => setProfessionalId(e.target.value)}
            required
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
          <label>Usuário:</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          >
            <option value="">Selecione um usuário</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Serviço:</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
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
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <button type="submit">Criar Agendamento</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookingForm;
