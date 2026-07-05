/* ── WebGL Water Surface ── */
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

  var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) { console.warn('WebGL not available, water disabled'); return; }

  var vertSrc = 'attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}';
  var fragSrc =
    'precision highp float;\n'+
    'uniform vec2 r;\n'+
    'uniform float t;\n'+
    'void main(){\n'+
    '  vec2 uv=gl_FragCoord.xy/r;\n'+
    '  float line=.58;\n'+
    // Sky region: fully transparent
    '  if(uv.y<line-.01){gl_FragColor=vec4(0,0,0,0);return;}\n'+
    '  float d=(uv.y-line)/(1.0-line);\n'+
    // Wave field — 4 octaves
    '  float w=sin(uv.x*5.3+t*1.3)*.42;\n'+
    '  w+=sin(uv.x*9.7-t*1.1+uv.y*2.6)*.28;\n'+
    '  w+=cos(uv.x*15.5+t*1.7)*.18;\n'+
    '  w+=sin(uv.x*23.0-t*2.3+uv.y*6.0)*.08;\n'+
    // Water color — teal blue gradient
    '  vec3 surf=vec3(.06,.22,.42);\n'+
    '  vec3 bottom=vec3(.02,.08,.20);\n'+
    '  vec3 col=mix(surf,bottom,d);\n'+
    // Wave highlights
    '  float crest=pow(sin(w*3.14)*.5+.5,18.0);\n'+
    '  col+=crest*.12*vec3(.4,.7,1.0)*(1.0-d);\n'+
    // Moon reflection
    '  float mx=.52+sin(t*.08)*.06;\n'+
    '  float beam=exp(-abs(uv.x-mx)*6.0);\n'+
    '  float rip=sin(uv.y*35.0-t*2.5+w*4.0)*.5+.5;\n'+
    '  col+=beam*rip*pow(1.0-d,5.0)*.22*vec3(.6,.8,1.0);\n'+
    // Fresnel at horizon
    '  col+=pow(1.0-d,2.2)*.08*vec3(.3,.5,.9);\n'+
    // Smooth fade at shoreline
    '  float alpha=smoothstep(line-.01,line+.005,uv.y);\n'+
    '  gl_FragColor=vec4(col,alpha);\n'+
    '}';

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn('Shader error:', gl.getShaderInfoLog(s));
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
  var a = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

  var uR = gl.getUniformLocation(prog, 'r');
  var uT = gl.getUniformLocation(prog, 't');

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  function render(ts) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, ts * .001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
