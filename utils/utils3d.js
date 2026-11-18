import * as THREE from 'three';

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
