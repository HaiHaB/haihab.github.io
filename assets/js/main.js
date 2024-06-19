
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
		},

		(error) => {
			console.log(error);
		}
	);
}

function setupScene(fbx) {

	// Container set up
	const container = document.getElementById('avatar-container');

	const renderer = new THREE.WebGLRenderer({ antialias: true ,  alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setAnimationLoop(animate);
	container.appendChild(renderer.domElement);
	renderer.shadowMap.enabled = true;


	// Camera setup
	const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
	camera.position.set(10,20,40);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableZoom = false;

	controls.update();

	// Scene setup
	const scene = new THREE.Scene();

	const axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper)


	// Load avatar
	fbx.traverse(function (child) {
		if (child.isMesh) {
			// Original material
			child.material = new THREE.MeshStandardMaterial({
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
	window.addEventListener("resize", onWindowResize);

	function onWindowResize() {
		renderer.setSize(container.clientWidth, container.clientHeight);
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
	}

	function animate() {
		fbx.rotation.y += 0.005;
		renderer.render(scene, camera);
	}
}