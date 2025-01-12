import BookingsList from "./components/bookings"
import BookingForm from "./components/createBookings"
import AddServiceForm from "./components/createService"

function App() {
  return (   
    <div>

      <BookingsList />
      <AddServiceForm />
      <BookingForm />
    </div>
  )
}

export default App
