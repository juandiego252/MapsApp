import React, { useState } from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { GlobalStyles } from '../../../config/theme/styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { signUp } from '../../../services/authService';
import { Picker } from '@react-native-picker/picker';

export const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');  // Estado para manejar el rol seleccionado
    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const handleRegister = async () => {
        try {
            await signUp(email, password, role);  // Pasar el rol seleccionado al método signUp
            Alert.alert('Éxito', 'Registro exitoso');
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.registerContainer}>
                    <Text style={styles.title}>Crear Cuenta</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tu nombre completo"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

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

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Selecciona tu rol</Text>
                        <Picker
                            selectedValue={role}
                            style={styles.picker}
                            onValueChange={(itemValue) => setRole(itemValue)}
                        >
                            <Picker.Item label="Usuario" value="user" />
                            <Picker.Item label="Administrador" value="administrador" />
                        </Picker>
                    </View>

                    <Pressable
                        style={[GlobalStyles.btnPrimary, styles.button]}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonText}>Registrarse</Text>
                    </Pressable>

                    <View style={styles.loginPromptContainer}>
                        <Text style={styles.loginPrompt}>¿Ya tienes una cuenta?</Text>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Text style={styles.loginLink}>Inicia sesión</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    registerContainer: {
        padding: 20,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
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
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    picker: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        marginTop: 10,
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginPromptContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    loginPrompt: {
        color: '#333',
        marginRight: 5,
    },
    loginLink: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});
