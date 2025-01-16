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
    <div className="flex flex-col items-center justify-center h-screen m-4">
      <h1 className="text-xl font-semibold mb-4 my-10">Adicionar Profissional</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl gap-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-2">Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Especialização:</label>
          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="w-full max-w-3xl grid grid-cols-2 gap-6 p-6">
          <h3 className="block text-sm font-medium mb-2">Disponibilidade:</h3>
          {daysOfWeek.map((day) => (
            <div key={day}>
              <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
              <div>
                <input
                  type="time"
                  onChange={(e) => handleAddTime(day, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
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
                  <li key={time} >
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
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Criar Funcionario
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProfessionalForm;
