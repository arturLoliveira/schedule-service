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
    <div>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl grid grid-cols-2 gap-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-2">Senha:</label>
          <input 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            className="w-full border border-gray-300 rounded px-3 py-2"
        />
        </div>
        <div className="col-span-2 mt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Atualizar Senha
          </button>
        </div>
      </form>
      {message && <p className="text-green-500 mb-4">{message}</p>}
    </div>
  );
};

export default UpdateUserForm;
