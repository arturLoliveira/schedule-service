import "../App.css";
import BookingsList from "../components/bookings";
import UserList from "../components/getUsers";
const AdminDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-green-500 text-white py-4 text-center text-lg font-bold">
        Admin Dashboard
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-800 text-white p-4">
          <ul className="space-y-4">
            <li><a href="#" className="hover:bg-gray-700 block px-3 py-2 rounded">Overview</a></li>
            <li><a href="#users" className="hover:bg-gray-700 block px-3 py-2 rounded">Manage Users</a></li>
            <li><a href="#bookings" className="hover:bg-gray-700 block px-3 py-2 rounded">Manage Bookings</a></li>
            <li><a href="#services" className="hover:bg-gray-700 block px-3 py-2 rounded">Manage Services</a></li>
            <li><a href="#professionals" className="hover:bg-gray-700 block px-3 py-2 rounded">Manage Professionals</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {/* Users Section */}
          <UserList />

          {/* Bookings Section */}
          <BookingsList />

          {/* Services Section */}
          <section id="services" className="bg-white rounded shadow p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Manage Services</h2>
            <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">Add Service</button>
          </section>

          {/* Professionals Section */}
          <section id="professionals" className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Manage Professionals</h2>
            <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">Add Professional</button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
