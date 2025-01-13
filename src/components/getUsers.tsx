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
      <h1>Lista de Usuarios</h1>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <p><strong>Nome:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Cargo:</strong> {user.role}</p>

            </li>
          ))}
        </ul>
      ) : (
        <p>Sem agendamentos disponíveis.</p>
      )}
    </div>
  );
};

export default UserList;
