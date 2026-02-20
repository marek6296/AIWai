"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
// import { Environment } from "@react-three/drei";

function Wave() {
    const mesh = useRef<THREE.Points>(null!);
    const count = 2000;

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Hexagon-ish spread or just plane
            const x = (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 15;
            const y = 0;
            positions.set([x, y, z], i * 3);
        }
        return positions;
    }, [count]);

    useFrame((state) => {
        const { clock } = state;
        const time = clock.getElapsedTime();

        // Animate positions
        // We access the buffer attribute directly
        const positions = mesh.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = particlesPosition[i3]; // Original x
            const z = particlesPosition[i3 + 2]; // Original z

            // Wave equation
            // Simple sine wave based on position and time
            const y = Math.sin(x * 0.5 + time * 0.5) * Math.sin(z * 0.5 + time * 0.5) * 0.5;

            // Mouse interaction (subtle)
            // distance from mouse to particle
            // We need to map screen mouse to world space roughly or just use normalized
            // For now, let's keep it simple ambient wave

            positions[i3 + 1] = y;
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#D8B98A" // Brand Sand
                transparent
                opacity={0.8}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

export default function WaveBackground() {
    const mouse = useRef<[number, number]>([0, 0]);

    return (
        <div className="absolute inset-0">
            <Canvas
                camera={{ position: [0, 5, 5], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                onMouseMove={(e) => {
                    // Normalized mouse -1 to 1
                    mouse.current = [
                        (e.clientX / window.innerWidth) * 2 - 1,
                        -(e.clientY / window.innerHeight) * 2 + 1
                    ]
                }}
            >
                <Wave />
                {/* <Environment preset="city" /> */}
            </Canvas>
        </div>
    );
}
