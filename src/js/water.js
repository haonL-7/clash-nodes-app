/* ── WebGL Water Surface ── */
(function() {
  var canvas = document.createElement('canvas');
  canvas.id = 'waterCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;opacity:1;transition:opacity .6s ease;';
  document.body.appendChild(canvas);

  // Hide in light mode
  var obs = new MutationObserver(function(ms) {
    ms.forEach(function(m) {
      if (m.attributeName === 'data-theme') {
        var t = document.documentElement.getAttribute('data-theme');
        canvas.style.opacity = t === 'light' ? '0' : '1';
      }
    });
  });
  obs.observe(document.documentElement, { attributes: true });

  var gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) return;

  var vertSrc = 'attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0,1);}';
  var fragSrc =
    'precision highp float;\n' +
    'uniform vec2 u_res;\n' +
    'uniform float u_time;\n' +
    'void main(){\n' +
    '  vec2 uv=gl_FragCoord.xy/u_res;\n' +
    '  float waterLine=0.62;\n' +
    '  float inWater=smoothstep(waterLine-0.005,waterLine,uv.y);\n' +
    // Sky
    '  vec3 sky=vec3(0.02,0.04,0.12)*(1.0-uv.y)+vec3(0.04,0.06,0.16)*uv.y;\n' +
    '  float t=u_time;\n' +
    // Water depth
    '  float depth=(uv.y-waterLine)/(1.0-waterLine);\n' +
    // Multi-octave wave field
    '  float w=0.0;\n' +
    '  w+=sin(uv.x*6.0+t*1.2+cos(uv.y*4.0+t*0.5)*2.0)*0.5;\n' +
    '  w+=sin(uv.x*11.0-t*0.9+uv.y*3.0)*0.3;\n' +
    '  w+=cos(uv.x*18.0+t*1.6)*0.15;\n' +
    '  w+=sin(uv.x*27.0-t*2.1+uv.y*8.0)*0.05;\n' +
    '  float wave=(w+1.0)*0.5;\n' +
    // Water colors
    '  vec3 shallow=vec3(0.04,0.12,0.28);\n' +
    '  vec3 deep=vec3(0.01,0.03,0.10);\n' +
    '  vec3 water=mix(deep,shallow,1.0-depth);\n' +
    // Moon reflection path
    '  float moonX=0.55+sin(t*0.1)*0.1;\n' +
    '  float path=exp(-abs(uv.x-moonX)*8.0);\n' +
    '  float ripple=sin(uv.y*40.0-t*3.0+w*3.0)*0.5+0.5;\n' +
    '  float reflection=path*ripple*pow(1.0-depth,6.0)*0.25;\n' +
    '  water+=reflection*vec3(0.7,0.8,1.0);\n' +
    // Specular wave crests
    '  float crest=pow(sin(w*3.14)*0.5+0.5,24.0);\n' +
    '  water+=crest*0.08*vec3(0.5,0.7,1.0)*(1.0-depth);\n' +
    // Horizon fresnel
    '  float fresnel=pow(1.0-depth,2.5);\n' +
    '  water+=fresnel*0.06*vec3(0.4,0.6,1.0);\n' +
    // Combine
    '  vec3 color=mix(sky,water,inWater);\n' +
    '  gl_FragColor=vec4(color,1.0);\n' +
    '}';

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
    return s;
  }
  var prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, 'u_res');
  var uTime = gl.getUniformLocation(prog, 'u_time');

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  function render(ts) {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, ts * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
