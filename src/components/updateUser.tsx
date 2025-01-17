import { getAuth, updatePassword } from "firebase/auth";
import { useState } from "react";

const UpdateUserForm: React.FC = () => {
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);

    const auth = getAuth();
    const user = auth.currentUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novaSenha = password;
    if (user) {
      updatePassword(user, novaSenha)
        .then(() => {
          console.log("Senha atualizada com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao atualizar a senha:", error);
        });
        setMessage(`Senha atualizada com sucesso!`);
        setPassword("")
    } else {
      console.error("Nenhum usuário autenticado.");
    }
  };

   return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Atualizar Senha</h2>
      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes("sucesso")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Nova Senha:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua nova senha"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Atualizar Senha
        </button>
      </form>
    </div>
  );
};

export default UpdateUserForm;
