import { CiLogout } from "react-icons/ci";
import "../App.css";
import BookingsList from "../components/bookings";
import AddProfessionalForm from "../components/createProfissional";
import AddServiceForm from "../components/createService";
import AddUserForm from "../components/createUser";
import UserList from "../components/getUsers";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/logout";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";


interface User {
  id: string;
  name: string;
}


const AdminDashboard = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [user, loading] = useAuthState(auth);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({ id: userDoc.id, name: data?.name || "Usuário desconhecido" });
        } else {
          console.error("Documento do usuário não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar os dados do usuário:", err);
      }
    };

    if (!loading) {
      fetchUser();
    }
  }, [user, loading]);


  const handleLogout = async () => {
    await logout();
    navigate("/login")

  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-teal-500 text-white py-4 text-center text-lg font-bold flex items-center justify-between px-20">
        <div className="flex flex-col gap-1">
          <h1>Painel do Usuario</h1>
          <h2 className="text-sm">{userData?.name}</h2>
        </div>
        <div className="flex items-center justify-center gap-3">
          <CiLogout className="text-2xl" />
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>


      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <section id="services" className="bg-white rounded shadow p-4 mb-6">
          <UserList />
        </section>

        <section id="services" className="bg-white rounded shadow p-4 mb-6">
          <BookingsList />
        </section>

        <section id="services" className="bg-white rounded shadow p-4 mb-6 flex justify-between">
          <AddServiceForm />
          <AddUserForm />
        </section>

        <section id="professionals" className="bg-white rounded shadow p-4">
          <AddProfessionalForm />
        </section>
      </main>
    </div>

  );
};

export default AdminDashboard;
