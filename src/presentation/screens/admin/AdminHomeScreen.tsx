import React, { useEffect, useState } from 'react';
import { Text, View, Button, TextInput, FlatList, Alert } from 'react-native';
import { signUp, signIn, signOut, isAdmin, listUsers, toggleUserActivation, deleteUser } from '../../../services/authService';
import auth from '@react-native-firebase/auth';

export const AdminHomeScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [uid, setUid] = useState<string | null>(null);
  const [isAdminRole, setIsAdminRole] = useState(false);
  const [users, setUsers] = useState<Array<{ uid: string; email: string; role: string; active: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUid(user.uid);
      checkIfAdmin(user.uid);
    }
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
      Alert.alert('Usuario registrado', `Usuario ${userCredential.user.email} ha sido registrado exitosamente.`);
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', `No se pudo registrar el usuario: ${error}`);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signIn(email, password);
      Alert.alert('Usuario autenticado', `Usuario ${userCredential.user.email} ha iniciado sesión exitosamente.`);
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('Error', `No se pudo iniciar sesión: ${error}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Sesión cerrada', 'La sesión ha sido cerrada exitosamente.');
    } catch (error) {
      Alert.alert('Error', `No se pudo cerrar sesión: ${error}`);
    }
  };

  const handleToggleActivation = async (uid: string, currentStatus: boolean) => {
    try {
      await toggleUserActivation(uid, !currentStatus);
      Alert.alert('Estado actualizado', `El usuario ha sido ${!currentStatus ? 'activado' : 'desactivado'}.`);
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', `No se pudo actualizar el estado: ${error}`);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(uid);
              Alert.alert('Usuario eliminado', 'El usuario ha sido eliminado exitosamente.');
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', `No se pudo eliminar el usuario: ${error}`);
            }
          },
        },
      ],
      { cancelable: true }
    );
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
            <Text>Estado: {item.active ? 'Activo' : 'Inactivo'}</Text>
            <Button
              title={item.active ? 'Desactivar' : 'Activar'}
              onPress={() => handleToggleActivation(item.uid, item.active)}
            />
            <Button
              title="Eliminar"
              color="red"
              onPress={() => handleDeleteUser(item.uid)}
            />
          </View>
        )}
      />
    </View>
  );
};
