AFRAME.registerShader('alphamatte', {
    schema: {
        src: {type: 'map', is: 'uniform'},
        transparent: {default: true, is: 'uniform'}
    },
    init: function (data) {
        var videoTexture = new THREE.VideoTexture(data.src);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;

        this.material = new THREE.ShaderMaterial( {
        uniforms: {
            texture: {
                type: "t",
                value: videoTexture
            }
        },
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader });
    },

    update: function (data) {
        this.material.src = data.src;
        this.material.transparent = data.transparent;
    },

    vertexShader: [
        'varying vec2 vUv;',
        'varying float texU;',
        'void main()',
        '{',
        'vUv = uv;',
        'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
        'gl_Position = projectionMatrix * mvPosition;',
        '}'
    ].join('\n'),

    fragmentShader: [
        'uniform sampler2D texture;',
        'uniform vec3 color;',
        'varying vec2 vUv;',
        'void main()',
        '{',
        'vec2 texcoord = vec2(0.5, 0.0);',
        'vec2 halfTex = vec2(0.5, 1.0);',
        'vec3 tColor = texture2D( texture, ( vUv * halfTex ) ).rgb;',
        'vec3 aColor = texture2D( texture, ( (vUv * halfTex ) + texcoord ) ).rgb;',
        'float a = aColor.g;',
        'gl_FragColor = vec4(tColor, a);',
        '}'
    ].join('\n')
});