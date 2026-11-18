import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    botao: {
        width: '80%',
        height: 60,
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    texto: {
        fontSize: 22,
    },
});

export default styles;
