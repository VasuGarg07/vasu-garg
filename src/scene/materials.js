import * as THREE from 'three';

export const red = new THREE.MeshStandardMaterial({ color: 0xc42a17, roughness: 0.55, emissive: 0x3a0800 });
export const ink = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.8 });
export const stone = new THREE.MeshStandardMaterial({ color: 0x6c6a78, roughness: 0.95 });
export const wood = new THREE.MeshStandardMaterial({ color: 0x4a2c1a, roughness: 0.9 });
export const glow = new THREE.MeshStandardMaterial({ color: 0x3a2412, emissive: 0xffa24a, emissiveIntensity: 2.6 });
export const blossom = new THREE.MeshStandardMaterial({ color: 0xffa8c8, emissive: 0x5a1f3a, flatShading: true, roughness: 1 });
