import { View } from 'react-native';
import { useEffect, useRef } from 'react';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import styles from './styles';
import { criaRenderer } from '../../utils/utils3d';

export default function Estudio() {

    const frameRef = useRef(null);

    useEffect(() => {
        return () => cancelAnimationFrame(frameRef.current);
    }, []);

    function iniciaCena(gl) {
        let renderer = criaRenderer(gl);

        let cena = new THREE.Scene();
        cena.background = new THREE.Color(0x222222);

        let camera = new THREE.PerspectiveCamera(60, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100);
        camera.position.z = 4;

        let geometria = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshStandardMaterial({ color: 0x00aaff });
        let objeto = new THREE.Mesh(geometria, material);
        cena.add(objeto);

        let luzAmbiente = new THREE.AmbientLight(0xffffff, 0.5);
        cena.add(luzAmbiente);

        let luz = new THREE.DirectionalLight(0xffffff, 2);
        luz.position.set(2, 3, 4);
        cena.add(luz);

        function animar() {
            frameRef.current = requestAnimationFrame(animar);
            objeto.rotation.x += 0.01;
            objeto.rotation.y += 0.01;
            renderer.render(cena, camera);
            gl.endFrameEXP();
        }

        animar();
    }

    return (
        <View style={styles.container}>
            <GLView style={styles.cena} onContextCreate={iniciaCena} />
        </View>
    );
}
