import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './telas/home/index';
import Estudio from './telas/estudio/index';
import Realidade from './telas/realidade/index';

const telas = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <telas.Navigator initialRouteName="Home">
        <telas.Screen name="Home" component={Home} options={{ headerShown: false, animation: 'fade' }} />
        <telas.Screen name="Estudio" component={Estudio} options={{ title: 'Estúdio 3D', animation: 'slide_from_right' }} />
        <telas.Screen name="Realidade" component={Realidade} options={{ title: 'Realidade Aumentada', animation: 'slide_from_right' }} />
      </telas.Navigator>
    </NavigationContainer>
  );
}
