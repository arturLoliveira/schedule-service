import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));

        const data = querySnapshot.docs.map((doc) => {
          const bookingData = doc.data();
          return {
            id: doc.id,
            email: bookingData.email,
            name: bookingData.name,
            role: bookingData.role
          };
        });

        setUsers(data);
      } catch (err) {
        console.error("Erro ao buscar usuarios:", err);
        setError("Erro ao carregar os usuarios.");
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  const deleteUser = async (userId: string) => {
    try {
      const useRef = doc(db, "users", userId);
      await deleteDoc(useRef);
      setMessage(`Usuario deletado com sucesso!`);
    } catch (error) {
      console.error("Erro ao deletar usuario:", error);
      setMessage("Erro ao deletar usuario.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {users.length > 0 ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Lista de Usuários</h2>
          {message && (
            <p
              className={`mb-4 px-4 py-2 rounded ${
                message.includes("sucesso")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </p>
          )}
          <table className="min-w-full border border-gray-300 rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-6 py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-6 py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Nome
                </th>
                <th className="text-left px-6 py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Função
                </th>
                <th className="text-center px-6 py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Gerenciar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Não há usuários cadastrados</h2>
        </div>
      )}
    </div>
  );
  
};

export default UserList;
