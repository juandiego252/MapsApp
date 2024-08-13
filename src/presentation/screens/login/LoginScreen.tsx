import React, { useState } from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { GlobalStyles } from '../../../config/theme/styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { signIn } from '../../../services/authService';
import firestore from '@react-native-firebase/firestore';
import { useAuthStore } from '../../store/users/useAuthLocation';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { setIsAuthenticated, setUserRole } = useAuthStore();

    const handleLogin = async () => {
        try {
            const userCredential = await signIn(email, password);

            if (userCredential.user) {
                // Navegar basado en el rol del usuario
                const userDoc = await firestore().collection('usuarios').doc(userCredential.user.uid).get();
                const userRole = userDoc.data()?.role || 'user';

                if (userRole === 'administrador') {
                    navigation.navigate('AdminScreen');
                } else {
                    navigation.navigate('PermissionScreen');
                }
            }
        } catch (error) {Alert.alert('Error de inicio de sesión', error instanceof Error ? error.message : 'Error desconocido');}
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.loginContainer}>
                <Text style={styles.title}>Bienvenido MapsApp!</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ejemplo@correo.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tu contraseña"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={[GlobalStyles.btnPrimary, styles.button]} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </Pressable>
                    <Pressable style={[GlobalStyles.btnPrimary, styles.button, styles.registerButton]} onPress={() => navigation.navigate('RegisterScreen')}>
                        <Text style={styles.buttonText}>Registrarse</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 19,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 29,
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 19,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 21,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 12,
        borderRadius: 40,
        alignItems: 'center',
    },
    registerButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});