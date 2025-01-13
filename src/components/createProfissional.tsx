import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const AddProfessionalForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);

  const handleAddTime = (day: string, time: string) => {
    if (!time) return;

    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day] ? [...new Set([...prev[day], time])] : [time], 
    }));
  };

  const handleRemoveTime = (day: string, time: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day]?.filter((t) => t !== time) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !specialization || Object.keys(availability).length === 0) {
      setMessage("Todos os campos são obrigatórios, incluindo a disponibilidade.");
      return;
    }

    try {
      const professionalData = {
        name,
        specialization,
        availability,
      };
      const docRef = await addDoc(collection(db, "professionals"), professionalData);

      setMessage(`Profissional adicionado com sucesso! ID: ${docRef.id}`);

      setName("");
      setSpecialization("");
      setAvailability({});
    } catch (error) {
      console.error("Erro ao adicionar profissional:", error);
      setMessage("Erro ao adicionar profissional.");
    }
  };

  return (
    <div>
      <h1>Adicionar Profissional</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Especialização:</label>
          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />
        </div>
        <div>
          <h3>Disponibilidade:</h3>
          {daysOfWeek.map((day) => (
            <div key={day}>
              <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
              <div>
                <input
                  type="time"
                  onChange={(e) => handleAddTime(day, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleAddTime(day, e.target.previousElementSibling?.value || "")}
                >
                  Adicionar
                </button>
              </div>
              <ul>
                {availability[day]?.map((time) => (
                  <li key={time}>
                    {time}{" "}
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(day, time)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button type="submit">Adicionar Profissional</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProfessionalForm;
