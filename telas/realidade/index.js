import { Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { GLView } from 'expo-gl';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { DeviceMotion } from 'expo-sensors';
import * as THREE from 'three';
import styles from './styles';
import { criaRenderer, orientaCamera } from '../../utils/utils3d';

const FORMAS = [
    () => new THREE.BoxGeometry(0.8, 0.8, 0.8),
    () => new THREE.SphereGeometry(0.5, 24, 12),
    () => new THREE.TorusGeometry(0.4, 0.15, 12, 32),
    () => new THREE.ConeGeometry(0.45, 0.9, 24),
    () => new THREE.OctahedronGeometry(0.55),
];

const CORES = [0x00aaff, 0xff8800, 0x33cc66, 0xff3366, 0xffdd00];

const TOTAL_ALVOS = 8;

export default function Realidade() {

    const [permissao, pedePermissao] = useCameraPermissions();
    const [jogando, setJogando] = useState(false);
    const [pontos, setPontos] = useState(0);
    const [tempo, setTempo] = useState(0);
    const [recorde, setRecorde] = useState(null);
    const [mensagem, setMensagem] = useState('Gire o celular para olhar ao redor');

    const frameRef = useRef(null);
    const cenaRef = useRef(null);
    const alvosRef = useRef([]);
    const rotacaoRef = useRef(null);
    const alphaInicialRef = useRef(null);
    const inicioRef = useRef(0);
    const relogioRef = useRef(null);
    const tamanhoRef = useRef({ largura: 1, altura: 1 });

    useEffect(() => {
        DeviceMotion.isAvailableAsync().then(disponivel => {
            if (!disponivel)
                setMensagem('Este aparelho não tem sensor de movimento');
        });

        DeviceMotion.setUpdateInterval(20);

        let assinatura = DeviceMotion.addListener(dados => {
            if (!dados.rotation)
                return;

            rotacaoRef.current = dados.rotation;

            if (alphaInicialRef.current === null)
                alphaInicialRef.current = dados.rotation.alpha;
        });

        return () => {
            assinatura.remove();
            cancelAnimationFrame(frameRef.current);
            clearInterval(relogioRef.current);
        };
    }, []);

    function iniciaCena(gl) {
        let renderer = criaRenderer(gl);

        let cena = new THREE.Scene();

        let camera = new THREE.PerspectiveCamera(60, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100);

        let demo = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xff8800 })
        );
        demo.position.set(0, 0, -4);
        cena.add(demo);

        cena.add(new THREE.AmbientLight(0xffffff, 0.6));

        let luz = new THREE.DirectionalLight(0xffffff, 2);
        luz.position.set(2, 3, 4);
        cena.add(luz);

        cenaRef.current = { cena, camera, demo };

        function animar() {
            frameRef.current = requestAnimationFrame(animar);

            let rotacao = rotacaoRef.current;
            if (rotacao)
                orientaCamera(camera, rotacao.alpha - alphaInicialRef.current, rotacao.beta, rotacao.gamma);

            demo.rotation.y += 0.02;

            alvosRef.current.forEach(alvo => {
                alvo.rotation.x += 0.01;
                alvo.rotation.y += 0.02;
            });

            renderer.render(cena, camera);
            gl.endFrameEXP();
        }

        animar();
    }

    function criaAlvos() {
        let cena = cenaRef.current.cena;
        let alvos = [];

        for (let i = 0; i < TOTAL_ALVOS; i++) {
            let angulo = (i / TOTAL_ALVOS) * Math.PI * 2;
            let distancia = 4 + Math.random() * 2;
            let altura = (Math.random() - 0.5) * 3;

            let alvo = new THREE.Mesh(
                FORMAS[i % FORMAS.length](),
                new THREE.MeshStandardMaterial({ color: CORES[i % CORES.length] })
            );
            alvo.position.set(Math.sin(angulo) * distancia, altura, -Math.cos(angulo) * distancia);

            cena.add(alvo);
            alvos.push(alvo);
        }

        alvosRef.current = alvos;
    }

    function removeAlvo(alvo) {
        cenaRef.current.cena.remove(alvo);
        alvo.geometry.dispose();
        alvo.material.dispose();
    }

    function limpaAlvos() {
        alvosRef.current.forEach(alvo => removeAlvo(alvo));
        alvosRef.current = [];
    }

    function centraliza() {
        if (rotacaoRef.current)
            alphaInicialRef.current = rotacaoRef.current.alpha;
    }

    function iniciar() {
        if (!cenaRef.current)
            return;

        limpaAlvos();
        centraliza();
        criaAlvos();
        cenaRef.current.demo.visible = false;

        setPontos(0);
        setTempo(0);
        setJogando(true);
        setMensagem('Ache e toque nos objetos!');

        inicioRef.current = Date.now();
        clearInterval(relogioRef.current);
        relogioRef.current = setInterval(() => {
            setTempo(Math.floor((Date.now() - inicioRef.current) / 1000));
        }, 1000);
    }

    function parar() {
        if (!cenaRef.current)
            return;

        clearInterval(relogioRef.current);
        limpaAlvos();
        cenaRef.current.demo.visible = true;
        setJogando(false);
        setMensagem('Desafio parado');
    }

    function terminou() {
        clearInterval(relogioRef.current);

        let total = Math.floor((Date.now() - inicioRef.current) / 1000);

        cenaRef.current.demo.visible = true;
        setTempo(total);
        setJogando(false);
        setRecorde(prev => (prev === null ? total : Math.min(prev, total)));
        setMensagem(`Você achou todos em ${total}s!`);
    }

    function captura(alvo) {
        removeAlvo(alvo);
        alvosRef.current = alvosRef.current.filter(item => item !== alvo);
        setPontos(TOTAL_ALVOS - alvosRef.current.length);

        if (alvosRef.current.length == 0)
            terminou();
    }

    function tocou(evento) {
        if (!jogando)
            return;

        let ponteiro = new THREE.Vector2(
            (evento.nativeEvent.locationX / tamanhoRef.current.largura) * 2 - 1,
            -(evento.nativeEvent.locationY / tamanhoRef.current.altura) * 2 + 1
        );

        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(ponteiro, cenaRef.current.camera);

        let acertos = raycaster.intersectObjects(alvosRef.current);

        if (acertos.length > 0)
            captura(acertos[0].object);
    }

    function guardaTamanho(evento) {
        tamanhoRef.current = {
            largura: evento.nativeEvent.layout.width,
            altura: evento.nativeEvent.layout.height,
        };
    }

    if (!permissao)
        return <View style={styles.container} />;

    if (!permissao.granted)
        return (
            <View style={styles.containerPermissao}>
                <Text style={styles.texto}>Precisamos da câmera para mostrar os objetos 3D no ambiente</Text>
                <TouchableOpacity style={styles.botao} onPress={() => pedePermissao()}>
                    <Text style={styles.textoBotao}>Permitir câmera</Text>
                </TouchableOpacity>
            </View>
        );

    return (
        <View style={styles.container}>
            <CameraView style={styles.camadaTotal} facing="back" />

            <View style={styles.camadaTotal} onTouchEnd={tocou} onLayout={guardaTamanho}>
                <GLView style={styles.cena} onContextCreate={iniciaCena} />
            </View>

            <View style={styles.placar} pointerEvents="none">
                <Text style={styles.textoPlacar}>Pontos: {pontos}/{TOTAL_ALVOS}</Text>
                <Text style={styles.textoPlacar}>Tempo: {tempo}s</Text>
                <Text style={styles.textoPlacar}>Recorde: {recorde === null ? '-' : recorde + 's'}</Text>
            </View>

            <View style={styles.areaMensagem} pointerEvents="none">
                <Text style={styles.textoMensagem}>{mensagem}</Text>
            </View>

            <View style={styles.areaBotoes}>
                <TouchableOpacity style={styles.botaoJogo} onPress={() => iniciar()}>
                    <Text style={styles.textoBotao}>{jogando ? 'Reiniciar' : 'Iniciar'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoJogo} onPress={() => parar()}>
                    <Text style={styles.textoBotao}>Parar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoJogo} onPress={() => centraliza()}>
                    <Text style={styles.textoBotao}>Centralizar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
