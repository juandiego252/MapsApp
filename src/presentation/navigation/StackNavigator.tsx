import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen } from '../screens/maps/MapScreen';
import { LoadingScreen } from '../screens/loading/LoadingScreen';
import { PermissionsScreen } from '../screens/permissions/PermissionsScreen';
import { LoginScreen } from '../screens/login/LoginScreen';
import { RegisterScreen } from '../screens/register/RegisterScreen';

export type RootStackParams = {
    LoadingScreen: undefined;
    PermissionScreen: undefined;
    MapsScreen: undefined;
    LoginScreen: undefined;
    RegisterScreen: undefined;
}

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='LoginScreen'
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: 'white'
                }
            }}>
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
            <Stack.Screen name="MapsScreen" component={MapScreen} />
            <Stack.Screen name="PermissionScreen" component={PermissionsScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            {/* <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Settings" component={Settings} /> */}
        </Stack.Navigator>
    );
}