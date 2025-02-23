// authStore.js
import { create } from "zustand";
import { auth } from "../../firebase.config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// Zustand store
const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // Signup function
  signup: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user });
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  // Signin function
  signin: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user });
    } catch (error) {
      console.error("Signin error:", error);
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  // Listen for auth state changes
  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },
}));

export default useAuthStore;
