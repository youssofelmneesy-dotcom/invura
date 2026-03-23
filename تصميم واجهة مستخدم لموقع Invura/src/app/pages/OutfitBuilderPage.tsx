import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, ZoomIn, ZoomOut, ShoppingCart, Ruler } from "lucide-react";
import { api } from "../lib/api";
import type { Product } from "../lib/types";
import { useStore } from "../contexts/StoreContext";

const categories = ["Gym Wear", "Running", "Accessories", "VIP"];

export function OutfitBuilderPage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const avatarRef = useRef<THREE.Group | null>(null);

  const { addToCart } = useStore();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Record<string, Product>>({});
  const [activeCategory, setActiveCategory] = useState("Gym Wear");
  const [height, setHeight] = useState(175);
  const [rotationY, setRotationY] = useState(0);
  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    api.products().then((response) => setAllProducts(response.items));
  }, []);

  const products = useMemo(
    () => allProducts.filter((p) => p.category === activeCategory),
    [activeCategory, allProducts],
  );

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f5f5f5");

    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / 420, 0.1, 100);
    camera.position.set(0, 1.5, zoom);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, 420);
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight("#ffffff", 1.1);
    light.position.set(3, 4, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight("#ffffff", 0.6);
    scene.add(ambient);

    const group = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.55, 1.4, 32),
      new THREE.MeshStandardMaterial({ color: "#242424" }),
    );
    body.position.y = 1.1;

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 32, 32),
      new THREE.MeshStandardMaterial({ color: "#d7b899" }),
    );
    head.position.y = 2.05;

    group.add(body, head);
    scene.add(group);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 32),
      new THREE.MeshStandardMaterial({ color: "#d7d7d7" }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    avatarRef.current = group;

    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }
      cameraRef.current.aspect = mountRef.current.clientWidth / 420;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, 420);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!avatarRef.current) {
      return;
    }
    avatarRef.current.scale.y = Math.max(0.8, Math.min(1.2, height / 175));
  }, [height]);

  useEffect(() => {
    if (!avatarRef.current) {
      return;
    }
    avatarRef.current.rotation.y = rotationY;
  }, [rotationY]);

  useEffect(() => {
    if (!cameraRef.current) {
      return;
    }
    cameraRef.current.position.z = zoom;
  }, [zoom]);

  const totalPrice = Object.values(selected).reduce((sum, item) => sum + item.pricing.final, 0);

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-7 bg-white rounded-xl shadow p-6">
        <h1 className="text-4xl font-extrabold mb-4">Outfit Builder 3D</h1>
        <p className="text-gray-600 mb-6">عاين الزي بزاوية 360° وعدّل الطول قبل إضافة العناصر إلى السلة.</p>

        <div ref={mountRef} className="w-full rounded-lg overflow-hidden border mb-5" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="border rounded-lg py-2 font-bold flex items-center justify-center gap-2" onClick={() => setRotationY((v) => v + Math.PI / 4)}>
            <RotateCw className="w-4 h-4" /> تدوير
          </button>
          <button className="border rounded-lg py-2 font-bold flex items-center justify-center gap-2" onClick={() => setZoom((v) => Math.max(2.8, v - 0.2))}>
            <ZoomIn className="w-4 h-4" /> تكبير
          </button>
          <button className="border rounded-lg py-2 font-bold flex items-center justify-center gap-2" onClick={() => setZoom((v) => Math.min(6, v + 0.2))}>
            <ZoomOut className="w-4 h-4" /> تصغير
          </button>
          <div className="border rounded-lg py-2 px-3 flex items-center justify-center gap-2">
            <Ruler className="w-4 h-4" />
            <input
              type="range"
              min={150}
              max={200}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3">الطول الحالي: {height} سم</p>
      </section>

      <section className="lg:col-span-5 bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`py-2 rounded-lg font-bold ${activeCategory === category ? "bg-black text-white" : "bg-gray-100"}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="max-h-[360px] overflow-auto space-y-3">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelected((prev) => ({ ...prev, [activeCategory]: product }))}
              className={`w-full border rounded-lg p-3 flex gap-3 text-right ${selected[activeCategory]?.id === product.id ? "border-red-600" : "border-gray-200"}`}
            >
              <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded object-cover" loading="lazy" />
              <div>
                <p className="font-bold">{product.name}</p>
                <p className="text-sm text-gray-600">{product.pricing.final} ر.س</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 space-y-3">
          <p className="text-xl font-extrabold">الإجمالي: {totalPrice} ر.س</p>
          <button
            disabled={!Object.values(selected).length}
            onClick={async () => {
              for (const product of Object.values(selected)) {
                await addToCart({ productId: product.id, qty: 1 });
              }
            }}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> إضافة الزي إلى السلة
          </button>
        </div>
      </section>
    </div>
  );
}
