import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
// Import the Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

// Tailwind CSS is assumed to be available.
// For production, this would be a separate file, but here we include a style tag for demonstration.
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');
  body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; overflow: hidden; background-color: #0d0d1b; color: #E0E0E0; }
  #root, .canvas-container { width: 100vw; height: 100vh; }
`;

// Helper component for loading screen
const Loader = () => {
  const { progress } = useProgress();
  return <Html center><div className="text-white text-lg">{Math.round(progress)} % loaded</div></Html>;
};

// Panel component to display UI in 3D space
const Panel = ({ position, rotation, title, children, onClick, active, index }) => {
  const meshRef = useRef();
  const htmlRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    // Subtle floating animation
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001 + index) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh onClick={onClick}>
        <planeGeometry args={[3, 2, 32, 32]} />
        <meshBasicMaterial transparent opacity={0.1} color={hovered ? '#00eaff' : '#33334e'} side={THREE.DoubleSide} />
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[3, 2, 1, 1]} />
          <meshStandardMaterial emissive={hovered ? '#00eaff' : '#00aaff'} emissiveIntensity={hovered ? 2 : 0.5} toneMapped={false} />
        </mesh>
      </mesh>
      <Html ref={htmlRef} transform position={[0, 0, 0.1]} style={{ transition: 'all 0.5s', opacity: active ? 1 : 0.8 }} center>
        <div className="w-[450px] h-[300px] bg-gradient-to-br from-[#1c1c3c] to-[#0e0e2a] border-4 border-[#00eaff] rounded-xl shadow-2xl p-6 flex flex-col justify-between"
             style={{ opacity: active ? 1 : 0.9, transition: 'all 0.5s' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-[#00eaff]">{title}</h2>
          </div>
          <div className="text-gray-300 flex-grow overflow-y-auto custom-scrollbar">
            {children}
          </div>
          <button
            onClick={onClick}
            className="mt-4 px-6 py-2 bg-[#00eaff] text-black font-bold rounded-lg shadow-lg hover:bg-white transition-all duration-300"
          >
            {active ? 'Back' : 'Explore'}
          </button>
        </div>
      </Html>
    </group>
  );
};

// Globe component
const Globe = () => {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });
  return (
    <Sphere ref={meshRef} args={[1.5, 32, 32]}>
      <pointsMaterial color="#00eaff" size={0.01} />
    </Sphere>
  );
};

// Background animation
const Background = () => {
  const points = useRef();
  const { viewport } = useThree();
  // Get viewport dimensions without unused variables
  viewport.getCurrentViewport(viewport.camera, [0, 0, 0]);

  const [positions] = useState(() => {
    const arr = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 25;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 25;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return arr;
  });

  useFrame(() => {
    if (points.current) {
      points.current.rotation.x += 0.0005;
      points.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#00eaff" size={0.02} sizeAttenuation={true} transparent opacity={0.6} />
    </points>
  );
};

// Main application component
const App = () => {
  const [activePanel, setActivePanel] = useState(null);
  const controlsRef = useRef();
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [guestbookMessages, setGuestbookMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Firebase configuration from environment variables
  const firebaseConfig = useMemo(() => {
    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };
    
    // For development, use a default config if environment variables are not set
    const isDevelopment = process.env.NODE_ENV === 'development';
    const useDefaultConfig = Object.values(config).some(v => v === undefined || v === null);
    
    if (isDevelopment && useDefaultConfig) {
      console.warn('Using default Firebase config for development. For production, please set up environment variables.');
      return {
        apiKey: 'AIzaSyDummyKeyDummyKeyDummyKeyDummyKeyDummy',
        authDomain: 'dummy-project.firebaseapp.com',
        projectId: 'dummy-project',
        storageBucket: 'dummy-project.appspot.com',
        messagingSenderId: '123456789012',
        appId: '1:123456789012:web:abc123def456'
      };
    }
    
    return config;
  }, []);

  useEffect(() => {
    // Initialize Firebase and Auth
    const app = initializeApp(firebaseConfig);
    const firestoreDb = getFirestore(app);
    const firebaseAuth = getAuth(app);
    setDb(firestoreDb);

    const authenticate = async () => {
      try {
        // Always sign in anonymously for now
        await signInAnonymously(firebaseAuth);
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    };

    authenticate();

    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(crypto.randomUUID());
      }
    });
    
    // Clean up the auth listener on unmount
    return () => unsubscribeAuth();
  }, [firebaseConfig]);

  useEffect(() => {
    if (!db || !userId) return;

    // Set up real-time listener for guestbook
    const guestbookPath = `/artifacts/${firebaseConfig.appId}/public/data/guestbook`;
    const q = query(collection(db, guestbookPath));

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuestbookMessages(messages.sort((a, b) => b.timestamp - a.timestamp));
    });

    return () => unsubscribeSnapshot();
  }, [db, userId, firebaseConfig.appId]);

  const handlePanelClick = (panelId, position) => {
    if (activePanel === panelId) {
      setActivePanel(null);
    } else {
      setActivePanel(panelId);
    }
  };

  // CameraController component to handle camera movement
  const CameraController = () => {
    const { camera } = useThree();
    
    useFrame(() => {
      if (controlsRef.current) {
        if (activePanel) {
          const position = panelPositions[activePanel];
          // Move camera closer to the active panel
          const target = new THREE.Vector3().set(...position).add(new THREE.Vector3(0, 0, 3));
          camera.position.lerp(target, 0.05);
          camera.lookAt(new THREE.Vector3(...position));
          controlsRef.current.enabled = false;
        } else {
          // Return camera to original position
          const defaultPosition = new THREE.Vector3(0, 0, 8);
          camera.position.lerp(defaultPosition, 0.05);
          camera.lookAt(new THREE.Vector3(0, 0, 0));
          controlsRef.current.enabled = true;
        }
      }
    });
    
    return null;
  };

  const panelPositions = {
    about: [-4, 2, 0],
    skills: [-4, -2, 0],
    projects: [4, 2, 0],
    contact: [4, -2, 0],
  };

  const panelRotations = {
    about: [0, 0.5, 0],
    skills: [0, 0.5, 0],
    projects: [0, -0.5, 0],
    contact: [0, -0.5, 0],
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      const guestbookPath = `/artifacts/${firebaseConfig.appId}/public/data/guestbook`;
      await addDoc(collection(db, guestbookPath), {
        message: newMessage,
        userId: userId,
        timestamp: serverTimestamp()
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  
  return (
    <>
      <style>{styles}</style>
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={window.devicePixelRatio} linear={false}>
          <React.Suspense fallback={<Loader />}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00aaff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#eaff00" />
            <OrbitControls ref={controlsRef} enablePan={false} enableZoom={true} minDistance={5} maxDistance={20} />
            <CameraController />
            <Background />
            <Globe />
            <Text position={[0, 4, 0]} fontSize={0.6} color="#00eaff" anchorX="center" anchorY="middle">
              ALEX CHEN
            </Text>

            <Panel
              index={0}
              title="About"
              position={panelPositions.about}
              rotation={panelRotations.about}
              onClick={() => handlePanelClick('about', panelPositions.about)}
              active={activePanel === 'about'}
            >
              <div className="flex items-center space-x-4 mb-4">
                <img src="https://placehold.co/80x80/00eaff/000?text=AC" alt="Developer" className="rounded-full border-2 border-[#00eaff]" />
                <div>
                  <h3 className="text-xl font-bold">Alex Chen</h3>
                  <p className="text-sm text-gray-400">Full Stack Developer</p>
                </div>
              </div>
              <p>
                I am a passionate and results-driven full stack developer with over 8 years of experience. I specialize in building robust, scalable, and high-performance web applications using modern technologies. My expertise spans across front-end frameworks like React and Vue.js, and back-end environments such as Node.js, Python (Django), and Go.
              </p>
            </Panel>

            <Panel
              index={1}
              title="Skills"
              position={panelPositions.skills}
              rotation={panelRotations.skills}
              onClick={() => handlePanelClick('skills', panelPositions.skills)}
              active={activePanel === 'skills'}
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-lg font-bold text-[#00eaff]">Frontend</h4>
                  <ul className="list-disc list-inside text-sm mt-1">
                    <li>React.js</li>
                    <li>Next.js</li>
                    <li>Vue.js</li>
                    <li>Tailwind CSS</li>
                    <li>Three.js</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#00eaff]">Backend</h4>
                  <ul className="list-disc list-inside text-sm mt-1">
                    <li>Node.js</li>
                    <li>Express.js</li>
                    <li>Python (Django)</li>
                    <li>Go</li>
                    <li>REST APIs</li>
                  </ul>
                </div>
                <div className="col-span-2">
                  <h4 className="text-lg font-bold text-[#00eaff]">Database & DevOps</h4>
                  <ul className="list-disc list-inside text-sm mt-1">
                    <li>PostgreSQL, MongoDB</li>
                    <li>Firebase, Firestore</li>
                    <li>Docker, Kubernetes</li>
                    <li>AWS, GCP</li>
                    <li>CI/CD</li>
                  </ul>
                </div>
              </div>
            </Panel>

            <Panel
              index={2}
              title="Projects"
              position={panelPositions.projects}
              rotation={panelRotations.projects}
              onClick={() => handlePanelClick('projects', panelPositions.projects)}
              active={activePanel === 'projects'}
            >
              <div className="space-y-4">
                <div className="bg-[#2c2c4a] p-4 rounded-lg border border-[#00eaff]">
                  <h4 className="text-xl font-bold">Project Pulse</h4>
                  <p className="text-sm mt-1">A project management tool with real-time collaboration. Built with React and Firebase.</p>
                  <button className="text-[#00eaff] hover:underline text-sm mt-2 block bg-transparent border-none p-0 cursor-pointer">View Project</button>
                </div>
                <div className="bg-[#2c2c4a] p-4 rounded-lg border border-[#00eaff]">
                  <h4 className="text-xl font-bold">Quantum Wallet</h4>
                  <p className="text-sm mt-1">A secure crypto wallet with integrated analytics. Developed using Go and Vue.js.</p>
                  <button className="text-[#00eaff] hover:underline text-sm mt-2 block bg-transparent border-none p-0 cursor-pointer">View Project</button>
                </div>
                <div className="bg-[#2c2c4a] p-4 rounded-lg border border-[#00eaff]">
                  <h4 className="text-xl font-bold">DataSphere Analytics</h4>
                  <p className="text-sm mt-1">A data visualization platform for large datasets. Features interactive 3D charts with Three.js.</p>
                  <button className="text-[#00eaff] hover:underline text-sm mt-2 block bg-transparent border-none p-0 cursor-pointer">View Project</button>
                </div>
              </div>
            </Panel>

            <Panel
              index={3}
              title="Contact"
              position={panelPositions.contact}
              rotation={panelRotations.contact}
              onClick={() => handlePanelClick('contact', panelPositions.contact)}
              active={activePanel === 'contact'}
            >
              <div>
                <p className="mb-4">
                  Feel free to connect with me! Check out my work or leave a message.
                </p>
                <div className="flex space-x-4 mb-4 justify-center">
                  <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-[#00eaff] hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.23c2.45-.25 5-1.25 5-5.5.08-1.5-.52-2.7-1-3.23 0 0-1.07-.33-3.5-.94C13.2 5.04 12.33 4 12 4s-1.2.04-2.5.94c-2.43.61-3.5.94-3.5.94-.48.53-1.08 1.73-1 3.23 0 4.25 2.55 5.25 5 5.5a4.8 4.8 0 0 0-1 3.23v4"/></svg>
                  </a>
                  <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-[#00eaff] hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href="mailto:example@example.com" className="text-[#00eaff] hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.93 1.93 0 0 1-2.06 0L2 7"/></svg>
                  </a>
                </div>
                <div className="bg-[#2c2c4a] p-4 rounded-lg border border-[#00eaff] max-h-52 overflow-y-auto custom-scrollbar">
                  <h4 className="text-xl font-bold mb-2">Guestbook</h4>
                  <div className="space-y-2 mb-4">
                    {guestbookMessages.length > 0 ? (
                      guestbookMessages.map((msg, index) => (
                        <div key={index} className="bg-[#1c1c3c] p-2 rounded-md text-sm">
                          <p>{msg.message}</p>
                          <p className="text-right text-xs text-gray-500">by {msg.userId ? msg.userId.substring(0, 8) : 'Unknown'}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm text-center">No messages yet. Be the first to say hi!</p>
                    )}
                  </div>
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Leave a message..."
                      className="flex-grow p-2 rounded-md bg-[#0e0e2a] border border-[#00eaff] focus:outline-none focus:ring-2 focus:ring-[#00eaff] text-white"
                    />
                    <button type="submit" className="px-4 py-2 bg-[#00eaff] text-black font-bold rounded-md hover:bg-white transition-colors">
                      Send
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2">Your user ID: {userId}</p>
                </div>
              </div>
            </Panel>
          </React.Suspense>
        </Canvas>
      </div>
    </>
  );
};

export default App;