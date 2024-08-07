import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { GlobalStyles } from '../../../config/theme/styles'
import { usePermissionStore } from '../../store/permissions/usePermissionStore'

export const PermissionsScreen = () => {

  const { locationStatus, requestLocationPermission } = usePermissionStore();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Habilitar Ubicacion</Text>
      <Pressable style={GlobalStyles.btnPrimary} onPress={requestLocationPermission}>
        <Text style={{ color: 'white' }}>Habilitar localizacion</Text>
      </Pressable>
      <Text>Estado actual: {locationStatus} </Text>
    </View>
  )
}
