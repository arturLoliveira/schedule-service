import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const UpdateUserStatusForm: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [role, setRole] = useState<string>("admin");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !role) {
      setMessage("O ID do usuario e o status são obrigatórios.");
      return;
    }

    const validRoles = ["admin", "user"];
    if (!validRoles.includes(role)) {
      setMessage("Status inválido. Use 'admin' ou 'user'.");
      return;
    }

    try {
      
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, { role });

      setMessage(`Usuario atualizado para '${role}' com sucesso!`);
      setUserId("");
      setRole("admin");
    } catch (error) {
      console.error("Erro ao atualizar status do usuario:", error);
      setMessage("Erro ao atualizar status da usuario.");
    }
  };

  return (
    <div>
      <h1>Atualizar Cargo do usuario</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID do Usuario:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cargo:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </div>
        <button type="submit">Atualizar Cargo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateUserStatusForm;
