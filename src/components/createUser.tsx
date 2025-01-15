import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const AddUserForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [message, setMessage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user] = useAuthState(auth);

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

      // Salva os dados adicionais no Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        name,
        role,
      });

      setMessage(`Usuário criado com sucesso! ID: ${uid}`);

      // Limpa o formulário
      setEmail("");
      setName("");
      setPassword("");
      setRole("user");
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      setMessage(`Erro ao criar usuário: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Adicionar Usuario</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl grid grid-cols-2 gap-6 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <label className="block text-sm font-medium mb-2">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Função:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="user">Usuário</option>
            {isAdmin && <option value="admin">Administrador</option>}
          </select>
        </div>
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Criar Usuário
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default AddUserForm;
