import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ---------- Live shader backdrop: flowing aurora, reads like a looping video ---------- */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }
  void main(){
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(2.2, 1.3);
    float t = uTime * 0.09;
    vec2 m = uMouse * 0.15;
    float f1 = fbm(p*1.4 + vec2(t, -t*0.7) + m);
    float f2 = fbm(p*2.1 - vec2(t*1.2, t) + f1*1.6);
    vec3 violet = vec3(0.48, 0.36, 1.0);
    vec3 cyan   = vec3(0.18, 0.89, 0.90);
    vec3 pink   = vec3(1.0, 0.31, 0.60);
    vec3 col = mix(violet, cyan, smoothstep(0.25, 0.8, f2));
    col = mix(col, pink, smoothstep(0.55, 1.0, f1) * 0.55);
    float bands = smoothstep(0.35, 0.95, f2) * smoothstep(0.1, 0.8, 1.0 - uv.y + f1*0.3);
    float vig = smoothstep(1.15, 0.2, length(uv - vec2(0.62, 0.5)));
    float strength = bands * vig * 0.55;
    gl_FragColor = vec4(col * strength, 1.0);
  }
`;

function ShaderBackdrop() {
  const mat = useRef();
  useFrame(({ clock, pointer }) => {
    mat.current.uniforms.uTime.value = clock.elapsedTime;
    mat.current.uniforms.uMouse.value.lerp(pointer, 0.04);
  });
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() } }),
    []
  );
  return (
    <mesh position={[0, 0, -9]} scale={[1, 1, 1]}>
      <planeGeometry args={[46, 28]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

/* ---------- Hero orb: distorted glassy sphere + wireframe shell ---------- */
function Orb() {
  const group = useRef();
  const shell = useRef();
  useFrame(({ clock }, dt) => {
    group.current.rotation.y += dt * 0.15;
    shell.current.rotation.x -= dt * 0.12;
    shell.current.rotation.z += dt * 0.08;
  });
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.55, 24]} />
        <MeshDistortMaterial color="#8a6bff" emissive="#4a2fd0" emissiveIntensity={1.15} roughness={0.15} metalness={0.85} distort={0.42} speed={1.8} />
      </mesh>
      <mesh ref={shell} scale={1.28}>
        <icosahedronGeometry args={[1.55, 2]} />
        <meshBasicMaterial color="#2de2e6" wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

/* ---------- Orbiting rings ---------- */
function Rings() {
  const a = useRef();
  const b = useRef();
  const c = useRef();
  useFrame((_, dt) => {
    a.current.rotation.z += dt * 0.35;
    b.current.rotation.z -= dt * 0.25;
    c.current.rotation.y += dt * 0.4;
  });
  return (
    <group rotation={[0.5, 0.2, 0]}>
      <mesh ref={a} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.7, 0.012, 16, 200]} />
        <meshBasicMaterial color="#2de2e6" />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 3.2, 0.6, 0]}>
        <torusGeometry args={[3.2, 0.01, 16, 200]} />
        <meshBasicMaterial color="#ff4f9a" />
      </mesh>
      <mesh ref={c} rotation={[Math.PI / 2, 0.3, 0.9]}>
        <torusGeometry args={[3.7, 0.008, 16, 200]} />
        <meshBasicMaterial color="#7b5cff" />
      </mesh>
    </group>
  );
}

/* ---------- Floating "tech" shapes ---------- */
const shapes = [
  { p: [-3.6, 1.6, 0.5], c: "#2de2e6", g: "box", s: 0.55 },
  { p: [3.7, 2.0, -0.5], c: "#ff4f9a", g: "oct", s: 0.6 },
  { p: [3.4, -1.9, 0.8], c: "#7b5cff", g: "box", s: 0.45 },
  { p: [-3.2, -2.0, -0.3], c: "#ff4f9a", g: "tetra", s: 0.6 },
  { p: [0.2, 3.1, -1], c: "#2de2e6", g: "oct", s: 0.38 },
  { p: [-1.2, -3.0, 0.6], c: "#7b5cff", g: "tetra", s: 0.42 },
];
function Shapes({ count }) {
  return shapes.slice(0, count).map((s, i) => (
    <Float key={i} speed={1.6 + i * 0.25} rotationIntensity={1.6} floatIntensity={1.8}>
      <mesh position={s.p} scale={s.s}>
        {s.g === "box" && <boxGeometry args={[1, 1, 1]} />}
        {s.g === "oct" && <octahedronGeometry args={[0.8]} />}
        {s.g === "tetra" && <tetrahedronGeometry args={[0.9]} />}
        <meshStandardMaterial color={s.c} emissive={s.c} emissiveIntensity={0.55} roughness={0.2} metalness={0.7} />
      </mesh>
    </Float>
  ));
}

/* ---------- Mouse parallax camera ---------- */
function Rig({ children }) {
  const ref = useRef();
  useFrame(({ pointer }) => {
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.35, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.22, 0.05);
  });
  return <group ref={ref}>{children}</group>;
}

export default function Hero3D({ lite = false, active = true }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, lite ? 12.5 : 8], fov: 45 }}
      dpr={lite ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={90} color="#2de2e6" />
        <pointLight position={[-6, -3, 3]} intensity={70} color="#ff4f9a" />
        <pointLight position={[0, 4, -4]} intensity={50} color="#7b5cff" />
        <ShaderBackdrop />
        <Stars radius={60} depth={40} count={lite ? 800 : 2200} factor={3.2} saturation={0.6} fade speed={1.2} />
        <Sparkles count={lite ? 30 : 70} scale={[12, 8, 6]} size={3} speed={0.4} color="#2de2e6" />
        <Rig>
          <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0.2}>
            <Orb />
          </Float>
          <Rings />
          <Shapes count={lite ? 3 : shapes.length} />
        </Rig>
      </Suspense>
    </Canvas>
  );
}
