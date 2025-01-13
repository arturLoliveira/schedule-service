import BookingsList from "./components/bookings"
import BookingForm from "./components/createBookings"
import AddProfessionalForm from "./components/createProfissional"
import AddServiceForm from "./components/createService"
import AddUserForm from "./components/createUser"
import UserList from "./components/getUsers"
import UpdateBookingStatusForm from "./components/updateBookingStatus"
import UpdateUserStatusForm from "./components/updateUserStatus"

function App() {
  return (   
    <div>

      <BookingsList />
      <UserList />
      <AddServiceForm />
      <BookingForm />
      <AddProfessionalForm />
      <UpdateBookingStatusForm />
      <UpdateUserStatusForm />
      <AddUserForm />
    </div>
  )
}

export default App
