import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface User {
    uid: string;
    email: string;
    role: string;
    active: boolean;
}

interface CardComponentProps {
    user: User;
    onToggleActivation: (uid: string, currentStatus: boolean) => void;
    onDelete: (uid: string) => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({ user, onToggleActivation, onDelete }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{user.email}</Text>
            <Text style={styles.cardText}>Rol: {user.role}</Text>
            <Text style={styles.cardText}>Estado: {user.active ? 'Activo' : 'Inactivo'}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: user.active ? '#FFA500' : '#4CAF50' }]}
                    onPress={() => onToggleActivation(user.uid, user.active)}
                >
                    <Text style={styles.buttonText}>{user.active ? 'Desactivar' : 'Activar'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#FF0000' }]}
                    onPress={() => onDelete(user.uid)}
                >
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        marginBottom: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        flex: 1,
        marginHorizontal: 4,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});