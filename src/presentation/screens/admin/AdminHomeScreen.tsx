import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { signUp, signIn, signOut, isAdmin, listUsers, toggleUserActivation, deleteUser } from '../../../services/authService';
import auth from '@react-native-firebase/auth';
import { CardComponent } from '../../../presentation/components/ui/CardComponent';
import { Picker } from '@react-native-picker/picker';

interface User {
  uid: string;
  email: string;
  role: string;
  active: boolean;
}

export const AdminHomeScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [uid, setUid] = useState<string | null>(null);
  const [isAdminRole, setIsAdminRole] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
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
      <View style={styles.container}>
        <Text>Cargando usuarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administración de Usuarios</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.input}
      />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Selecciona el rol</Text>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Usuario" value="user" />
          <Picker.Item label="Administrador" value="administrador" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrar Usuario</Text>
      </TouchableOpacity>

      <Text style={styles.adminStatus}>
        {isAdminRole ? "Este usuario es administrador." : "Este usuario NO es administrador."}
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <CardComponent
            user={item}
            onToggleActivation={handleToggleActivation}
            onDelete={handleDeleteUser}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  adminStatus: {
    marginVertical: 10,
    fontStyle: 'italic',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});