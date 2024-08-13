import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapScreen } from '../maps/MapScreen';
import { AdminHomeScreen } from './AdminHomeScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { color } from 'react-native-elements/dist/helpers';

const Tab = createBottomTabNavigator();
export const AdminTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Administrador" component={AdminHomeScreen} options={{ tabBarIcon: ({ color, size }) => (<Icon name='people-outline' size={25} color={'black'} />) }} />
      <Tab.Screen name="Mapa" component={MapScreen} options={{ tabBarIcon: ({ color, size }) => (<Icon name='map-outline' size={25} color={'black'} />) }} />
    </Tab.Navigator>
  );
};
