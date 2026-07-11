import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Subtle Three.js ambient layer: floating particles + soft parallax network.
 * Kept intentionally light — pure elegance, ~60fps.
 */
export function ThreeBackground({ intensity = 1 }: { intensity?: number }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Particles
    const count = 320;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const blue = new THREE.Color("#3b6fe0");
    const green = new THREE.Color("#3fb98a");
    const gold = new THREE.Color("#e6b34a");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const c = i % 5 === 0 ? gold : i % 2 === 0 ? blue : green;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.55 * intensity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geom, mat);
    scene.add(points);

    // Soft ambient glow orbs
    const orbs: THREE.Mesh[] = [];
    const orbColors = ["#3b6fe0", "#3fb98a", "#e6b34a"];
    orbColors.forEach((c, i) => {
      const g = new THREE.SphereGeometry(2.4, 24, 24);
      const m = new THREE.MeshBasicMaterial({
        color: c,
        transparent: true,
        opacity: 0.06 * intensity,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set((i - 1) * 10, Math.sin(i) * 3, -6);
      scene.add(mesh);
      orbs.push(mesh);
    });

    let mouseX = 0;
    let mouseY = 0;
    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const render = () => {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.03;
      points.rotation.x = Math.sin(t * 0.1) * 0.05;
      orbs.forEach((o, i) => {
        o.position.y = Math.sin(t * 0.4 + i) * 2;
      });
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geom.dispose();
      mat.dispose();
      orbs.forEach((o) => {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      });
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [intensity]);

  return (
    <div
      ref={mount}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: "radial-gradient(1200px 700px at 50% 0%, oklch(0.97 0.03 250 / 0.7), transparent 60%), #ffffff" }}
    />
  );
}