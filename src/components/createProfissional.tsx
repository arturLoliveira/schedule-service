import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const AddProfessionalForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const handleAddTime = (day: string) => {
    const time = selectedTimes[day];
    if (!time) return; 
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day] ? [...new Set([...prev[day], time])] : [time],
    }));

   
    setSelectedTimes((prev) => ({
      ...prev,
      [day]: "",
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
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Adicionar Profissional</h1>
  
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Especialização:</label>
          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Disponibilidade</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {daysOfWeek.map((day) => (
              <div key={day} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={selectedTimes[day] || ""}
                    onChange={(e) =>
                      setSelectedTimes((prev) => ({
                        ...prev,
                        [day]: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTime(day)}
                    className="bg-teal-500 text-white px-3 py-2 rounded shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    Adicionar
                  </button>
                </div>
                <ul className="mt-2 space-y-1">
                  {availability[day]?.map((time) => (
                    <li key={time} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{time}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTime(day, time)}
                        className="text-red-500 hover:underline"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
  
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-2 rounded-md shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Criar Profissional
          </button>
        </div>
      </form>
  
      {message && <p className="text-center text-teal-600 font-medium mt-4">{message}</p>}
    </div>
  );
  
};

export default AddProfessionalForm;
