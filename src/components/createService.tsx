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
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold mb-4">Adicionar Serviço</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl grid grid-cols-2 gap-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-2">Descrição:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
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
          <label className="block text-sm font-medium mb-2">Preço:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Profissional:</label>
          <select
            value={professionalId}
            onChange={(e) => setProfessionalId(e.target.value)}
            required
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
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Criar Serviço
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddServiceForm;
