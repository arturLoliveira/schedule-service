import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const AddUserForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [message, setMessage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userRole = userDoc.data()?.role;
          if (userRole === "admin") {
            setIsAdmin(true);
          }
        }
      }
    };
    fetchRole();
  }, [user]);
  


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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        name,
        role,
      });

      setMessage(`Usuário criado com sucesso! ID: ${uid}`);

      navigate("/login")
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      setMessage(`Erro ao criar usuário: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Adicionar Usuário</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Função:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="user">Usuário</option>
            {isAdmin && <option value="admin">Administrador</option>}
          </select>
        </div>
        <div className="col-span-full flex justify-center mt-4">
          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-2 rounded-md shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Criar Usuário
          </button>
        </div>
      </form>
      {message && <p className="text-center text-red-600 font-medium">{message}</p>}
    </div>
  );
  
};

export default AddUserForm;
