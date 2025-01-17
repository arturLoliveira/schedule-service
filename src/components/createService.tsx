import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

interface Professional {
  id: string;
  name: string;
}

const AddServiceForm: React.FC = () => {
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [professionalId, setProfessionalId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const professionalsRef = collection(db, "professionals");
        const querySnapshot = await getDocs(professionalsRef);

        const professionalsList: Professional[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        setProfessionals(professionalsList);
      } catch (error) {
        console.error("Erro ao carregar profissionais:", error);
      }
    };

    fetchProfessionals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !name || !price || !professionalId) {
      setMessage("Todos os campos são obrigatórios.");
      return;
    }

    if (price <= 0) {
      setMessage("O preço deve ser um número positivo.");
      return;
    }

    try {
      const professionalRef = doc(db, "professionals", professionalId);

      const docRef = await addDoc(collection(db, "services"), {
        description,
        name,
        price,
        professionals: professionalRef, 
      });

      setMessage(`Serviço adicionado com sucesso! ID: ${docRef.id}`);

      
      setDescription("");
      setName("");
      setPrice(0);
      
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
      setMessage("Erro ao adicionar serviço.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Adicionar Serviço</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço:</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profissional:</label>
          <select
            value={professionalId}
            onChange={(e) => setProfessionalId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Selecione um profissional</option>
            {professionals.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-full flex justify-center mt-4">
          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-2 rounded-md shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Criar Serviço
          </button>
        </div>
      </form>
      {message && <p className="text-center text-teal-600 font-medium">{message}</p>}
    </div>
  );
  
};

export default AddServiceForm;
