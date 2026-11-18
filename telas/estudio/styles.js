import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
    },
    areaCena: {
        flex: 1,
    },
    cena: {
        flex: 1,
    },
    info: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    textoInfo: {
        color: '#FFF',
        fontSize: 14,
    },
    painel: {
        backgroundColor: '#FFF',
        paddingTop: 10,
        paddingBottom: 30,
    },
    linha: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 8,
    },
    botao: {
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    textoBotao: {
        fontSize: 14,
    },
    botaoCor: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#000',
    },
});

export default styles;
