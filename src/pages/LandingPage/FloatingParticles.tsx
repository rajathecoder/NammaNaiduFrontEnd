import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── 3D Kolam Mandala ─────────────────────────────────── */

function KolamMandala() {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Group>(null!);

  /* Build concentric kolam rings using lines & dots */
  const ringData = useMemo(() => {
    const rings: { radius: number; dots: number; color: string; size: number }[] = [
      { radius: 0.6, dots: 8, color: '#D4A017', size: 0.06 },
      { radius: 1.0, dots: 12, color: '#1B5E20', size: 0.05 },
      { radius: 1.4, dots: 16, color: '#D4A017', size: 0.04 },
      { radius: 1.8, dots: 20, color: '#4CAF50', size: 0.045 },
      { radius: 2.2, dots: 24, color: '#F9A825', size: 0.035 },
      { radius: 2.6, dots: 28, color: '#1B5E20', size: 0.04 },
      { radius: 3.0, dots: 32, color: '#D4A017', size: 0.03 },
    ];
    return rings;
  }, []);

  /* Floating gold particles around the mandala */
  const particleCount = 120;
  const [particlePositions, particleSizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 4;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 2;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, []);

  const particleRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    /* Slow outer rotation */
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
    }

    /* Counter-rotate inner rings */
    if (innerRef.current) {
      innerRef.current.rotation.z = -t * 0.08;
    }

    /* Animate floating particles */
    if (particleRef.current) {
      const posArr = particleRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArr[i3 + 1] += Math.sin(t * 0.4 + i * 0.7) * 0.0015;
        posArr[i3] += Math.cos(t * 0.3 + i * 0.5) * 0.0008;
      }
      particleRef.current.geometry.attributes.position.needsUpdate = true;
      particleRef.current.rotation.y = t * 0.03;
    }
  });

  return (
    <>
      {/* Main kolam group */}
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Outer rings */}
        {ringData.filter((_, i) => i % 2 === 0).map((ring, idx) => (
          <KolamRing key={`outer-${idx}`} {...ring} />
        ))}

        {/* Inner counter-rotating rings */}
        <group ref={innerRef}>
          {ringData.filter((_, i) => i % 2 === 1).map((ring, idx) => (
            <KolamRing key={`inner-${idx}`} {...ring} />
          ))}
        </group>

        {/* Center lotus dot */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#D4A017" emissive="#D4A017" emissiveIntensity={0.5} />
        </mesh>

        {/* Petal curves radiating from center */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <KolamPetal key={`petal-${i}`} angle={angle} color={i % 2 === 0 ? '#1B5E20' : '#D4A017'} />
          );
        })}
      </group>

      {/* Floating particles */}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={particlePositions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={particleCount} array={particleSizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          color="#D4A017"
          size={0.04}
          transparent
          opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

/* ─── Single Kolam Ring (dots in a circle) ──────────────── */

function KolamRing({ radius, dots, color, size }: { radius: number; dots: number; color: string; size: number }) {
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < dots; i++) {
      const a = (i / dots) * Math.PI * 2;
      pos.push([Math.cos(a) * radius, Math.sin(a) * radius, 0]);
    }
    return pos;
  }, [radius, dots]);

  /* Ring outline */
  const ringPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
    }
    return pts;
  }, [radius]);

  const ringGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(ringPoints), [ringPoints]);

  return (
    <group>
      {/* Ring circle */}
      <line geometry={ringGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.25} />
      </line>
      {/* Dots on the ring */}
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[size, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Kolam Petal (curved line from center) ─────────────── */

function KolamPetal({ angle, color }: { angle: number; color: string }) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let t = 0; t <= 1; t += 0.05) {
      const r = t * 2.8;
      const wobble = Math.sin(t * Math.PI * 2) * 0.3;
      const x = Math.cos(angle + wobble * 0.2) * r;
      const y = Math.sin(angle + wobble * 0.2) * r;
      pts.push(new THREE.Vector3(x, y, wobble * 0.15));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [angle]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.15} />
    </line>
  );
}

/* ─── Export ─────────────────────────────────────────────── */

export default function FloatingParticles() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.4} color="#D4A017" />
        <pointLight position={[-5, -3, 3]} intensity={0.3} color="#4CAF50" />
        <KolamMandala />
      </Canvas>
    </div>
  );
}
