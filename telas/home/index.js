import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import styles from './styles';

export default function Home({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>{Constants.expoConfig.name}</Text>

            <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Estudio')}>
                <Text style={styles.texto}>Estúdio 3D</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Realidade')}>
                <Text style={styles.texto}>Realidade Aumentada</Text>
            </TouchableOpacity>

            <StatusBar style="auto" />
        </View>
    );
}
