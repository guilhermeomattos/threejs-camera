import { Text, TouchableOpacity, View, PanResponder } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import styles from './styles';
import { criaRenderer } from '../../utils/utils3d';

const FORMAS = [
    { nome: 'Cubo', cria: () => new THREE.BoxGeometry(1.2, 1.2, 1.2) },
    { nome: 'Esfera', cria: () => new THREE.SphereGeometry(0.8, 32, 16) },
    { nome: 'Torus', cria: () => new THREE.TorusGeometry(0.6, 0.25, 16, 48) },
    { nome: 'Cone', cria: () => new THREE.ConeGeometry(0.7, 1.4, 32) },
];

const CORES = ['#00AAFF', '#FF8800', '#33CC66', '#FF3366'];

const ORBITA_INICIAL = { raio: 4, theta: 0, phi: 1.2 };

export default function Estudio() {

    const [info, setInfo] = useState(null);

    const frameRef = useRef(null);
    const cenaRef = useRef(null);
    const orbitaRef = useRef({ ...ORBITA_INICIAL });
    const inicioArrastoRef = useRef(null);
    const ortograficaRef = useRef(false);
    const girandoRef = useRef(true);

    const arrasto = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            inicioArrastoRef.current = { theta: orbitaRef.current.theta, phi: orbitaRef.current.phi };
        },
        onPanResponderMove: (evento, gesto) => {
            let orbita = orbitaRef.current;
            orbita.theta = inicioArrastoRef.current.theta - gesto.dx * 0.01;
            orbita.phi = Math.min(Math.PI - 0.1, Math.max(0.1, inicioArrastoRef.current.phi - gesto.dy * 0.01));
            posicionaCamera();
            atualizaInfo();
        },
    })).current;

    useEffect(() => {
        return () => cancelAnimationFrame(frameRef.current);
    }, []);

    function iniciaCena(gl) {
        let proporcao = gl.drawingBufferWidth / gl.drawingBufferHeight;

        let renderer = criaRenderer(gl);

        let cena = new THREE.Scene();
        cena.background = new THREE.Color(0x222222);

        let perspectiva = new THREE.PerspectiveCamera(60, proporcao, 0.1, 100);
        let ortografica = new THREE.OrthographicCamera(-2 * proporcao, 2 * proporcao, 2, -2, 0.1, 100);

        let material = new THREE.MeshStandardMaterial({ color: CORES[0] });
        let objeto = new THREE.Mesh(FORMAS[0].cria(), material);
        cena.add(objeto);

        let grade = new THREE.GridHelper(4, 8);
        grade.position.y = -1;
        cena.add(grade);

        cena.add(new THREE.AmbientLight(0xffffff, 0.5));

        let luz = new THREE.DirectionalLight(0xffffff, 2);
        luz.position.set(2, 3, 4);
        cena.add(luz);

        cenaRef.current = { objeto, perspectiva, ortografica };
        posicionaCamera();
        atualizaInfo();

        function animar() {
            frameRef.current = requestAnimationFrame(animar);

            if (girandoRef.current)
                objeto.rotation.y += 0.01;

            let camera = ortograficaRef.current ? ortografica : perspectiva;
            renderer.render(cena, camera);
            gl.endFrameEXP();
        }

        animar();
    }

    function posicionaCamera() {
        let dados = cenaRef.current;
        let orbita = orbitaRef.current;

        [dados.perspectiva, dados.ortografica].forEach(camera => {
            camera.position.setFromSphericalCoords(orbita.raio, orbita.phi, orbita.theta);
            camera.lookAt(0, 0, 0);
        });

        dados.ortografica.zoom = 4 / orbita.raio;
        dados.ortografica.updateProjectionMatrix();
    }

    function atualizaInfo() {
        let dados = cenaRef.current;
        let camera = ortograficaRef.current ? dados.ortografica : dados.perspectiva;

        setInfo({
            tipo: ortograficaRef.current ? 'Ortográfica' : 'Perspectiva',
            x: camera.position.x.toFixed(1),
            y: camera.position.y.toFixed(1),
            z: camera.position.z.toFixed(1),
            distancia: orbitaRef.current.raio.toFixed(1),
            fov: dados.perspectiva.fov,
            zoom: dados.ortografica.zoom.toFixed(2),
            vertices: dados.objeto.geometry.attributes.position.count,
            girando: girandoRef.current,
        });
    }

    function trocaForma(indice) {
        let objeto = cenaRef.current.objeto;
        objeto.geometry.dispose();
        objeto.geometry = FORMAS[indice].cria();
        atualizaInfo();
    }

    function trocaCor(cor) {
        cenaRef.current.objeto.material.color.set(cor);
    }

    function alternaMalha() {
        let material = cenaRef.current.objeto.material;
        material.wireframe = !material.wireframe;
    }

    function alternaCamera() {
        ortograficaRef.current = !ortograficaRef.current;
        atualizaInfo();
    }

    function alternaGiro() {
        girandoRef.current = !girandoRef.current;
        atualizaInfo();
    }

    function aproxima(valor) {
        let orbita = orbitaRef.current;
        orbita.raio = Math.min(10, Math.max(3, orbita.raio + valor));
        posicionaCamera();
        atualizaInfo();
    }

    function mudaFov(valor) {
        let perspectiva = cenaRef.current.perspectiva;
        perspectiva.fov = Math.min(120, Math.max(20, perspectiva.fov + valor));
        perspectiva.updateProjectionMatrix();
        atualizaInfo();
    }

    function resetaCamera() {
        orbitaRef.current = { ...ORBITA_INICIAL };
        cenaRef.current.perspectiva.fov = 60;
        cenaRef.current.perspectiva.updateProjectionMatrix();
        posicionaCamera();
        atualizaInfo();
    }

    return (
        <View style={styles.container}>

            <View style={styles.areaCena} {...arrasto.panHandlers}>
                <GLView style={styles.cena} onContextCreate={iniciaCena} />
                {
                    info &&
                    <View style={styles.info} pointerEvents="none">
                        <Text style={styles.textoInfo}>Câmera: {info.tipo}</Text>
                        <Text style={styles.textoInfo}>Posição: x {info.x}  y {info.y}  z {info.z}</Text>
                        <Text style={styles.textoInfo}>
                            {info.tipo == 'Perspectiva' ? `Distância: ${info.distancia}  FOV: ${info.fov}°` : `Zoom: ${info.zoom}`}
                        </Text>
                        <Text style={styles.textoInfo}>Vértices: {info.vertices}</Text>
                    </View>
                }
            </View>

            <View style={styles.painel} pointerEvents={info ? 'auto' : 'none'}>

                <View style={styles.linha}>
                    {
                        FORMAS.map((forma, indice) => (
                            <TouchableOpacity key={forma.nome} style={styles.botao} onPress={() => trocaForma(indice)}>
                                <Text style={styles.textoBotao}>{forma.nome}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>

                <View style={styles.linha}>
                    {
                        CORES.map(cor => (
                            <TouchableOpacity key={cor} style={[styles.botaoCor, { backgroundColor: cor }]} onPress={() => trocaCor(cor)} />
                        ))
                    }
                    <TouchableOpacity style={styles.botao} onPress={() => alternaMalha()}>
                        <Text style={styles.textoBotao}>Malha</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.linha}>
                    <TouchableOpacity style={styles.botao} onPress={() => alternaCamera()}>
                        <Text style={styles.textoBotao}>Trocar câmera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botao} onPress={() => alternaGiro()}>
                        <Text style={styles.textoBotao}>{info && info.girando ? 'Parar giro' : 'Girar'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botao} onPress={() => resetaCamera()}>
                        <Text style={styles.textoBotao}>Resetar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.linha}>
                    <TouchableOpacity style={styles.botao} onPress={() => aproxima(-0.5)}>
                        <Text style={styles.textoBotao}>Aproximar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botao} onPress={() => aproxima(0.5)}>
                        <Text style={styles.textoBotao}>Afastar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botao} onPress={() => mudaFov(10)}>
                        <Text style={styles.textoBotao}>FOV +</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botao} onPress={() => mudaFov(-10)}>
                        <Text style={styles.textoBotao}>FOV -</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}
