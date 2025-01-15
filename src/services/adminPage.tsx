import "../App.css";
import BookingsList from "../components/bookings";
import AddProfessionalForm from "../components/createProfissional";
import AddServiceForm from "../components/createService";
import UserList from "../components/getUsers";

const AdminDashboard = () => {
  
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-green-500 text-white py-4 text-center text-lg font-bold">
        Admin Dashboard
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

          <section id="services" className="bg-white rounded shadow p-4 mb-6">
           <AddServiceForm />
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
