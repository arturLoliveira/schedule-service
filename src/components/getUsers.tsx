import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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

  return (
    <div>

      {users.length > 0 ? (
        <ul>
           <div className="p-6 bg-white rounded shadow">
           <h2 className="text-xl font-semibold mb-4">Lista de Usuários</h2>
           <table className="w-full border-collapse">
             <thead>
               <tr className="bg-gray-200">
                 <th className="border px-4 py-2 text-left">ID</th>
                 <th className="border px-4 py-2 text-left">Name</th>
                 <th className="border px-4 py-2 text-left">Email</th>
                 <th className="border px-4 py-2 text-left">Role</th>
                 <th className="border px-4 py-2 text-left">Actions</th>
               </tr>
             </thead>
             <tbody>
               {users.map((user) => (
                 <tr key={user.id}>
                   <td className="border px-4 py-2">{user.id}</td>
                   <td className="border px-4 py-2">{user.name}</td>
                   <td className="border px-4 py-2">{user.email}</td>
                   <td className="border px-4 py-2">{user.role}</td>
                   <td className="border px-4 py-2">
                     <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                       Edit
                     </button>
                     <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                       Delete
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
        </ul>
      ) : (
        <p>Sem agendamentos disponíveis.</p>
      )}
    </div>
  );
};

export default UserList;
