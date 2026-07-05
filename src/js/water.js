/* ── Three.js Water Surface ── */
(function() {
  var canvas = document.createElement('canvas');
  canvas.id = 'waterCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;transition:opacity .6s ease;';
  document.body.appendChild(canvas);

  var obs = new MutationObserver(function(ms) {
    ms.forEach(function(m) {
      if (m.attributeName === 'data-theme') {
        canvas.style.opacity = document.documentElement.getAttribute('data-theme') === 'light' ? '0' : '1';
      }
    });
  });
  obs.observe(document.documentElement, { attributes: true });

  if (typeof THREE === 'undefined') { console.warn('Three.js not loaded'); return; }

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.5, 2.8);
  camera.lookAt(0, 0.5, 0);

  // Large water plane
  var geo = new THREE.PlaneGeometry(8, 4, 120, 60);
  geo.rotateX(-Math.PI / 2);

  var mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#0a3060') },
      uColor2: { value: new THREE.Color('#041830') },
      uHighlight: { value: new THREE.Color('#6098d0') },
    },
    vertexShader: [
      'uniform float uTime;',
      'varying vec3 vPos;',
      'varying vec2 vUv;',
      'void main() {',
      '  vec3 pos = position;',
      // Multi-layer wave displacement
      '  float w = sin(pos.x * 3.5 + uTime * 1.2) * 0.12;',
      '  w += cos(pos.x * 5.8 - uTime * 0.9 + pos.z * 2.0) * 0.08;',
      '  w += sin(pos.x * 9.1 + uTime * 1.5 + pos.z * 4.1) * 0.05;',
      '  w += cos(pos.x * 14.0 - uTime * 2.0) * 0.03;',
      '  pos.y += w;',
      '  vPos = pos;',
      '  vUv = uv;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform float uTime;',
      'uniform vec3 uColor1;',
      'uniform vec3 uColor2;',
      'uniform vec3 uHighlight;',
      'varying vec3 vPos;',
      'varying vec2 vUv;',
      'void main() {',
      // Depth factor: near edge = shallow, far = deep
      '  float depth = 1.0 - vUv.y;',
      // Water color gradient
      '  vec3 col = mix(uColor1, uColor2, depth);',
      // Specular on wave crests (from vertex displacement stored in vPos)
      '  float wave = sin(vPos.x * 10.0 + uTime * 1.3) * 0.5 + 0.5;',
      '  float crest = pow(wave, 20.0);',
      '  col += crest * 0.15 * uHighlight;',
      // Moon reflection
      '  float mx = 0.0;',
      '  float beam = exp(-abs(vPos.x - mx) * 2.5);',
      '  float rip = sin(vPos.x * 8.0 - uTime * 2.0 + vPos.y * 20.0) * 0.5 + 0.5;',
      '  col += beam * rip * (1.0 - depth) * 0.15 * uHighlight;',
      // Fresnel at horizon (top of water)
      '  col += pow(1.0 - vUv.y, 3.0) * 0.08 * uHighlight;',
      // Alpha: transparent at horizon, opaque at bottom
      '  float alpha = smoothstep(0.0, 0.4, vUv.y) * 0.92;',
      '  gl_FragColor = vec4(col, alpha);',
      '}'
    ].join('\n'),
    transparent: true,
    depthWrite: false,
  });

  var water = new THREE.Mesh(geo, mat);
  scene.add(water);

  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Position water at bottom 35% of viewport
    water.position.y = -0.25;
    water.scale.set(1, 1, 0.55);
  }
  window.addEventListener('resize', resize);
  resize();

  function render(ts) {
    mat.uniforms.uTime.value = ts * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
