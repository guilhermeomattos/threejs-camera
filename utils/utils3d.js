import * as THREE from 'three';

const euler = new THREE.Euler();
const ajusteCamera = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

export function orientaCamera(camera, alpha, beta, gamma) {
    euler.set(beta, alpha, -gamma, 'YXZ');
    camera.quaternion.setFromEuler(euler);
    camera.quaternion.multiply(ajusteCamera);
}

export function criaRenderer(gl) {
    let largura = gl.drawingBufferWidth;
    let altura = gl.drawingBufferHeight;

    let canvas = {
        width: largura,
        height: altura,
        clientHeight: altura,
        style: {},
        addEventListener: () => { },
        removeEventListener: () => { },
        getContext: () => gl,
    };

    let renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setPixelRatio(1);
    renderer.setSize(largura, altura, false);
    renderer.setClearColor(0x000000, 0);

    return renderer;
}
