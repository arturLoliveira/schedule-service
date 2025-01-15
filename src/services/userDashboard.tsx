import "../App.css";
import BookingForm from "../components/createBookings";
import AddUserForm from "../components/createUser";

const UserDashboard = () => {
  return (
    <div className="flex flex-col h-screen">

      <header className="bg-green-500 text-white py-4 text-center text-lg font-bold">
        User Dashboard
      </header>

      <div className="flex flex-1">
 
        <nav className="w-64 bg-gray-800 text-white p-4">
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="hover:bg-gray-700 block px-3 py-2 rounded transition"
              >
                Overview
              </a>
            </li>
            <li>
              <a
                href="#users"
                className="hover:bg-gray-700 block px-3 py-2 rounded transition"
              >
                Manage Users
              </a>
            </li>
            <li>
              <a
                href="#bookings"
                className="hover:bg-gray-700 block px-3 py-2 rounded transition"
              >
                Manage Bookings
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="hover:bg-gray-700 block px-3 py-2 rounded transition"
              >
                Manage Services
              </a>
            </li>
            <li>
              <a
                href="#professionals"
                className="hover:bg-gray-700 block px-3 py-2 rounded transition"
              >
                Manage Professionals
              </a>
            </li>
          </ul>
        </nav>

        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto space-y-6">
          <section
            id="add-user"
            className="bg-white rounded shadow p-4 space-y-4"
          >
            <h2 className="text-xl font-semibold mb-2">Adicionar Usuário</h2>
            <AddUserForm />
          </section>

          <section
            id="create-booking"
            className="bg-white rounded shadow p-4 space-y-4"
          >
            <h2 className="text-xl font-semibold mb-2">Criar Agendamento</h2>
            <BookingForm />
          </section>

          <section
            id="services"
            className="bg-white rounded shadow p-4 space-y-4"
          >
            <h2 className="text-xl font-semibold mb-2">Manage Services</h2>
          </section>

          <section
            id="professionals"
            className="bg-white rounded shadow p-4 space-y-4"
          >
            <h2 className="text-xl font-semibold mb-2">Manage Professionals</h2>
            <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition">
              Add Professional
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
