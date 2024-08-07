import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'
import { StackNavigator } from './presentation/navigation/StackNavigator'
import { PermissionsChecker } from './presentation/providers/PermissionsChecker';
import { useAuthStore } from './presentation/store/users/useAuthLocation';


export const MapsApp = () => {

  return (
    <NavigationContainer>
      <PermissionsChecker>
        <StackNavigator />
      </PermissionsChecker>
    </NavigationContainer>
  )
}
