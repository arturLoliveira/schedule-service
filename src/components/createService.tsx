import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

interface Professional {
  id: string;
  name: string;
}

const AddServiceForm: React.FC = () => {
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [professionalId, setProfessionalId] = useState<string>("");
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
      const professionalDoc = await getDoc(professionalRef);

      if (!professionalDoc.exists()) {
        setMessage("Profissional não encontrado.");
        return;
      }

      const docRef = await addDoc(collection(db, "services"), {
        description,
        name,
        price,
        professional: professionalRef,
        professionalName: professionalDoc.data()?.name || "Desconhecido",
      });

      setMessage(`Serviço adicionado com sucesso! ID: ${docRef.id}`);

      // Limpa o formulário
      setDescription("");
      setName("");
      setPrice(0);
      setProfessionalId("");
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
      setMessage("Erro ao adicionar serviço.");
    }
  };

  return (
    <div>
      <h1>Adicionar Serviço</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Descrição:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
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
          <label>Preço:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
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
        <button type="submit">Adicionar Serviço</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddServiceForm;
