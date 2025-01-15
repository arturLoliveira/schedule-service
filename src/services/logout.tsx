import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("Usuário deslogado com sucesso!");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};
