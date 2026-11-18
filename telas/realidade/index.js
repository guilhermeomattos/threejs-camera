import { Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { GLView } from 'expo-gl';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as THREE from 'three';
import styles from './styles';
import { criaRenderer } from '../../utils/utils3d';

export default function Realidade() {

    const [permissao, pedePermissao] = useCameraPermissions();
    const frameRef = useRef(null);

    useEffect(() => {
        return () => cancelAnimationFrame(frameRef.current);
    }, []);

    function iniciaCena(gl) {
        let renderer = criaRenderer(gl);

        let cena = new THREE.Scene();

        let camera = new THREE.PerspectiveCamera(60, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100);
        camera.position.z = 4;

        let objeto = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xff8800 })
        );
        cena.add(objeto);

        cena.add(new THREE.AmbientLight(0xffffff, 0.5));

        let luz = new THREE.DirectionalLight(0xffffff, 2);
        luz.position.set(2, 3, 4);
        cena.add(luz);

        function animar() {
            frameRef.current = requestAnimationFrame(animar);
            objeto.rotation.y += 0.02;
            renderer.render(cena, camera);
            gl.endFrameEXP();
        }

        animar();
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
            <GLView style={styles.camadaTotal} onContextCreate={iniciaCena} />
        </View>
    );
}
