// Main/UserContext.jsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [avatarVersion, setAvatarVersion] = useState(Date.now());

  return (
    <UserContext.Provider value={{ avatarVersion, setAvatarVersion }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
