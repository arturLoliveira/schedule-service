import express from "express";
import cors from "cors";
import addService from "./src/services/addService.js";
import addProfessional from "./src/services/addProfessional.js";  
import addUser from "./src/services/addUser.js";  
import createBooking from "./src/services/createBooking.js";
import getBookings from "./src/services/getBookings.js";

import updateBookingStatus from "./src/services/updateBookingStatus.js";


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/services", async (req, res) => {
  try {
    const { description, name, price, professionalId } = req.body;
    if (!description || !name || !price || !professionalId) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    const serviceData = { description, name, price, professionalId };
    const result = await addService(serviceData);
    res.status(201).json({
      message: "Serviço adicionado com sucesso!",
      id: result.id,
    });
  } catch (error) {
    console.error("Erro ao adicionar serviço:", error);
    res.status(500).json({ error: "Erro ao adicionar serviço." });
  }
});
app.post("/api/professionals", async (req, res) => {
  try {
    const { name, schedule, specialization } = req.body;
    if (!schedule || !name || !specialization) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    const professionalData = { schedule, name, specialization };
    const result = await addProfessional(professionalData);
    res.status(201).json({
      message: "Profissional adicionado com sucesso!",
      id: result.id,
    });
  } catch (error) {
    console.error("Erro ao adicionar profissional:", error);
    res.status(500).json({ error: "Erro ao adicionar profissional." });
  }
});
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !name || !password || !role) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    const userData = { email, name, password, role };
    const result = await addUser(userData);
    res.status(201).json({
      message: "Usuario adicionado com sucesso!",
      id: result.id,
    });
  } catch (error) {
    console.error("Erro ao adicionar usuario:", error);
    res.status(500).json({ error: "Erro ao adicionar usuario." });
  }
});
app.post("/api/bookings", createBooking);

app.get("/api/bookings", getBookings);

app.put("/api/bookings/update-status", updateBookingStatus);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
