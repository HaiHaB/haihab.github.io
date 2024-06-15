
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

window.onload = () => loadModel();

function loadModel() {
	const loader = new FBXLoader();
	console.log(`Loading model ...`);
	loader.load("./assets/3D/humanhead.fbx",
		(fbx) => {
			setupScene(fbx);
			document.getElementById('avatar-loading').style.display = 'none';
		},
		(xhr) => {
			const percentCompletion = Math.round((xhr.loaded / xhr.total) * 100);
			document.getElementById('avatar-loading').innerText = `LOADING... ${percentCompletion}%`
			console.log(`Loading model... ${percentCompletion}%`);
		},
		(error) => {
			console.log(error);
		}
	);
}

function setupScene(fbx) {
	let mesh;
	let mouseX = 0;
	let mouseY = 0;
	let targetX = 0;
	let targetY = 0;

	// Container set up
	const container = document.getElementById('avatar-container');

	const renderer = new THREE.WebGLRenderer({ antialias: true ,  alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setAnimationLoop(animate);
	// renderer.setClearColor(0x343233);
	container.appendChild(renderer.domElement);
	renderer.shadowMap.enabled = true;


	// Camera setup
		const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);
	camera.position.set(0, 0, 50);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.enablePan = false;
	controls.enableZoom = false;
	controls.minDistance = 3;
	controls.minPolarAngle = 1.4;
	controls.maxPolarAngle = 1.4;
	controls.target = new THREE.Vector3(0, 0.75, 0);
	controls.update();

	// Scene setup
	const scene = new THREE.Scene();

	// Lighting setup;
	// scene.background = new THREE.Color(0x343233);

	// Load avatar
	fbx.traverse(function (child) {
		if (child.isMesh) {
			// Original material
			child.material = new THREE.MeshStandardMaterial({
				// color: 0x343233,
				side: THREE.FrontSide,
			});

			// Create wireframe geometry and material
			const wireframeGeometry = new THREE.WireframeGeometry(child.geometry);
			const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
			const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

			// Add the wireframe as a child of the mesh
			child.add(wireframe);
		}
	});
	scene.add(fbx);

	// Adjust the model scale and position if necessary
	fbx.position.set(0, 0, 0); // Center the object

	// Compute the bounding box to center the model
	const box = new THREE.Box3().setFromObject(fbx);
	const center = box.getCenter(new THREE.Vector3());
	fbx.position.sub(center); // Center the object

	scene.add(fbx);
	mesh = fbx;

	document.addEventListener("mousemove", onDocumentMouseMove);
	window.addEventListener("resize", onWindowResize);

	function onWindowResize() {
		renderer.setSize(container.clientWidth, container.clientHeight);

		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
	}

	function onDocumentMouseMove(event) {
		const rect = container.getBoundingClientRect();
		let clientX = event.clientX;
		let clientY = event.clientY;

		if (clientX < rect.left) {
			clientX = rect.left;
		} else if (clientX > rect.right) {
			clientX = rect.right;
		}

		if (clientY < rect.top) {
			clientY = rect.top;
		} else if (clientY > rect.bottom) {
			clientY = rect.bottom;
		}

		mouseX = clientX - container.clientWidth / 2;
		mouseY = clientY - container.clientHeight / 2;
	}

	function animate() {
		render();
	}

	function render() {
		targetX = mouseX * 0.001;
		targetY = mouseY * 0.0003;

		if (mesh) {
			mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
			mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);
		}

		renderer.render(scene, camera);
	}
}
