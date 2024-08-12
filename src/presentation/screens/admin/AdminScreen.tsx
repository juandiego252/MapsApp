import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapScreen } from '../maps/MapScreen';
import { AdminHomeScreen } from './AdminHomeScreen';

const Tab = createBottomTabNavigator();

export const AdminTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="AdminHome" component={AdminHomeScreen} />
      <Tab.Screen name="Maps" component={MapScreen} />
    </Tab.Navigator>
  );
};
