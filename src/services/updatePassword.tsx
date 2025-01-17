import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("Por favor, insira seu email.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage("Email de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.");
    } catch (err) {
      console.error("Erro ao enviar email de redefinição:", err);
      setError("Erro ao enviar email. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Recuperar Senha</h1>
      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-teal-500"
            placeholder="Digite seu email"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Link de Redefinição"}
        </button>
      </form>
      {message && <p className="text-green-500 text-center">{message}</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default PasswordReset;
