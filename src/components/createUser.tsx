import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const AddUserForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user"); 
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name || !password || !role) {
      setMessage("Todos os campos são obrigatórios.");
      return;
    }

    if (password.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const userData = { email, name, password, role };
      const docRef = await addDoc(collection(db, "users"), userData);

      setMessage(`Usuário adicionado com sucesso! ID: ${docRef.id}`);

      setEmail("");
      setName("");
      setPassword("");
      setRole("user");
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      setMessage("Erro ao adicionar usuário.");
    }
  };

  return (
    <div>
      <h1>Adicionar Usuário</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Função:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit">Adicionar Usuário</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddUserForm;
