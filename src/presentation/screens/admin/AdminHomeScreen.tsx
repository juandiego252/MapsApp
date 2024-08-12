// AdminHomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { Text, View, Button, TextInput, FlatList } from 'react-native';
import { signUp, signIn, signOut, isAdmin, listUsers } from '../../../services/authService';
import auth from '@react-native-firebase/auth';  // Para obtener el UID del usuario actual

export const AdminHomeScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Puedes cambiarlo a 'administrador' si es necesario
  const [uid, setUid] = useState<string | null>(null);
  const [isAdminRole, setIsAdminRole] = useState(false);
  const [users, setUsers] = useState<Array<{ uid: string; email: string; role: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener UID del usuario autenticado y verificar si es administrador
    const user = auth().currentUser;
    if (user) {
      setUid(user.uid);
      checkIfAdmin(user.uid);
    }

    // Listar usuarios
    fetchUsers();
  }, []);

  const checkIfAdmin = async (uid: string) => {
    const admin = await isAdmin(uid);
    setIsAdminRole(admin);
  };

  const fetchUsers = async () => {
    try {
      const userList = await listUsers();
      setUsers(userList);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await signUp(email, password, role);
      console.log("Usuario registrado:", userCredential.user.email);
      setEmail('');
      setPassword('');
      fetchUsers(); // Refrescar la lista de usuarios después de registrar uno nuevo
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signIn(email, password);
      console.log("Usuario autenticado:", userCredential.user.email);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("Usuario cerró sesión");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View>
        <Text>Cargando usuarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Administración de Usuarios</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 8, margin: 4 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={{ borderWidth: 1, padding: 8, margin: 4 }}
      />
      <TextInput
        placeholder="Role"
        value={role}
        onChangeText={setRole}
        style={{ borderWidth: 1, padding: 8, margin: 4 }}
      />

      <Button title="Registrar Usuario" onPress={handleSignUp} />

      {isAdminRole ? (
        <Text>Este usuario es administrador.</Text>
      ) : (
        <Text>Este usuario NO es administrador.</Text>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>Email: {item.email}</Text>
            <Text>Rol: {item.role}</Text>
          </View>
        )}
      />
    </View>
  );
};
