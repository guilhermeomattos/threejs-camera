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
    cena: {
        flex: 1,
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
        fontSize: 18,
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
    placar: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        padding: 10,
    },
    textoPlacar: {
        color: '#FFF',
        fontSize: 16,
    },
    areaMensagem: {
        position: 'absolute',
        bottom: 110,
        left: 10,
        right: 10,
        alignItems: 'center',
    },
    textoMensagem: {
        color: '#FFF',
        fontSize: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        padding: 8,
    },
    areaBotoes: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    botaoJogo: {
        backgroundColor: '#FFF',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
});

export default styles;
