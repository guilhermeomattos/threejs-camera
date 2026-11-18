import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camadaTotal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    containerPermissao: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    texto: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    textoBotao: {
        fontSize: 20,
    },
    botao: {
        width: '80%',
        height: 60,
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default styles;
