import { CiLogout } from "react-icons/ci";
import "../App.css";
import BookingsList from "../components/bookings";
import AddProfessionalForm from "../components/createProfissional";
import AddServiceForm from "../components/createService";
import AddUserForm from "../components/createUser";
import UserList from "../components/getUsers";
import { useNavigate } from "react-router-dom";
import { logout } from "./logout";

const AdminDashboard = () => {
  
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate("/login")
    
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-green-500 text-white py-4 text-center text-lg font-bold flex items-center justify-between px-20">
              <h1>Painel de Administrador</h1>
              <div className="flex items-center justify-center gap-3">
              <CiLogout />
                <button onClick={handleLogout}>Logout</button>
              </div>
            </header>

      <div className="flex flex-1">
        <nav className="w-64 bg-gray-800 text-white p-4">
          <ul className="space-y-4">
            <li>
              <a href="#" className="hover:bg-gray-700 block px-3 py-2 rounded">
                Overview
              </a>
            </li>
            <li>
              <button
                className="hover:bg-gray-700 block px-3 py-2 rounded"
              >
                Manage Users
              </button>
            </li>
            <li>
              <a
                href="#bookings"
                className="hover:bg-gray-700 block px-3 py-2 rounded"
              >
                Manage Bookings
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="hover:bg-gray-700 block px-3 py-2 rounded"
              >
                Manage Services
              </a>
            </li>
            <li>
              <a
                href="#professionals"
                className="hover:bg-gray-700 block px-3 py-2 rounded"
              >
                Manage Professionals
              </a>
            </li>
          </ul>
        </nav>
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
    </div>
  );
};

export default AdminDashboard;
