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
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>(
    []
  );
  const [professionals, setProfessionals] = useState<Professional[]>([]);
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

    if (!description || !name || !price || selectedProfessionals.length === 0) {
      setMessage("Todos os campos são obrigatórios.");
      return;
    }

    if (price <= 0) {
      setMessage("O preço deve ser um número positivo.");
      return;
    }

    try {
      const professionalRefs = selectedProfessionals.map((id) =>
        doc(db, "professionals", id)
      );

      const docRef = await addDoc(collection(db, "services"), {
        description,
        name,
        price,
        professionals: professionalRefs, // Armazena os profissionais como referências
        professionalNames: professionals
          .filter((prof) => selectedProfessionals.includes(prof.id))
          .map((prof) => prof.name), // Armazena os nomes dos profissionais
      });

      setMessage(`Serviço adicionado com sucesso! ID: ${docRef.id}`);

      // Limpa o formulário
      setDescription("");
      setName("");
      setPrice(0);
      setSelectedProfessionals([]);
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
      setMessage("Erro ao adicionar serviço.");
    }
  };

  const handleProfessionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }

    setSelectedProfessionals(selected);
  };

  return (
    <div>
      <h1>Adicionar Serviço</h1>
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
          <label className="block text-sm font-medium mb-2">Profissionais:</label>
          <select
            multiple
            value={selectedProfessionals}
            onChange={handleProfessionalChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
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
