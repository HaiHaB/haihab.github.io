console.log(`Loading model 123... }%`);
import * as THREE from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";


window.onload = () => loadModel();

function loadModel() {
const loader = new FBXLoader();
loader.load("./assets/3d/humanhead.fbx",
    (fbx) => {
      setupScene(fbx);
      document.getElementById('avatar-loading').style.display = 'none';
    },
    (xhr) => {
      const percentCompletion = Math.round((xhr.loaded / xhr.total) * 100);
      document.getElementById('avatar-loading').innerText = `LOADING... ${percentCompletion}%`
      console.log(`Loading model123... ${percentCompletion}%`);
    },
    (error) => {
      console.log(error);
    }
  );
	console.log(`In loadModel`);
}

function setupScene(fbx) {
	// Container set up
    const container = document.getElementById('avatar-container');

	// Renderer setup
    // const renderer = new THREE.WebGLRenderer({
    //   antialias: true,
    //   alpha: true
    // });
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    // renderer.setSize(container.clientWidth, container.clientHeight);
    // renderer.setPixelRatio(window.devicePixelRatio);

    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // container.appendChild(renderer.domElement);

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setAnimationLoop(animate);
	renderer.setClearColor(0x3d3a3a);
	container.appendChild(renderer.domElement);
	renderer.shadowMap.enabled = true;


    // Camera setup
    // const camera = new THREE.PerspectiveCamera(
    //   45, container.clientWidth / container.clientHeight);
    // camera.position.set(0.2, 0.5, 1);
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

    // Lighting setup
    // scene.add(new THREE.AmbientLight());
  	scene.background = new THREE.Color(0x3d3a3a);

    // const spotlight = new THREE.SpotLight(0xffffff, 20, 8, 1);
    // spotlight.penumbra = 0.5;
    // spotlight.position.set(0, 4, 2);
    // spotlight.castShadow = true;
    // scene.add(spotlight);

    // const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    // keyLight.position.set(1, 1, 2);
    // keyLight.lookAt(new THREE.Vector3());
    // scene.add(keyLight);

    // Load avatar
    fbx.traverse(function (child) {
      if (child.isMesh) {
        // Original material
        child.material = new THREE.MeshStandardMaterial({
          color: 0x3d3a3a,
          side: THREE.FrontSide,
        });

        // Create wireframe geometry and material
        const wireframeGeometry = new THREE.WireframeGeometry(child.geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

        // Add the wireframe as a child of the mesh
        child.add(wireframe);
      }
    });
	scene.add(fbx);

    // Adjust the model scale and position if necessary
    //object.scale.set(9, 9, 9); // Adjust the scale
    fbx.position.set(0, 0, 0); // Center the object

    // Compute the bounding box to center the model
    const box = new THREE.Box3().setFromObject(fbx);
    const center = box.getCenter(new THREE.Vector3());
    fbx.position.sub(center); // Center the object

    scene.add(fbx);
    mesh = fbx;

    // const avatar = gltf.scene;
    // avatar.traverse((child) => {
    //   if (child.isMesh) {
    //     child.castShadow = true;
    //     child.receiveShadow = true;
    //   }
    // });

    // scene.add(avatar);

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


//     // Create pedestal
//     const groundGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 64);
//     const groundMaterial = new THREE.MeshStandardMaterial();
//     const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
//     groundMesh.castShadow = false;
//     groundMesh.receiveShadow = true;
//     groundMesh.position.y -= 0.05;
//     scene.add(groundMesh);

//     // Load animations
//     const mixer = new THREE.AnimationMixer(avatar);
//     const clips = gltf.animations;
//     const waveClip = THREE.AnimationClip.findByName(clips, 'waving');
//     const stumbleClip = THREE.AnimationClip.findByName(clips, 'stagger');
//     const waveAction = mixer.clipAction(waveClip);
//     const stumbleAction = mixer.clipAction(stumbleClip);

//     let isStumbling = false;
//     const raycaster = new THREE.Raycaster();
//     container.addEventListener('mousedown', (ev) => {
//       const coords = {
//         x: (ev.offsetX / container.clientWidth) * 2 - 1,
//         y: -(ev.offsetY / container.clientHeight) * 2 + 1
//       };

//       raycaster.setFromCamera(coords, camera);
//       const intersections = raycaster.intersectObject(avatar);

//       if (intersections.length > 0) {
//         if (isStumbling) return;

//         isStumbling = true;
//         stumbleAction.reset();
//         stumbleAction.play();
//         waveAction.crossFadeTo(stumbleAction, 0.3);

//         setTimeout(() => {
//           waveAction.reset();
//           waveAction.play();
//           stumbleAction.crossFadeTo(waveAction, 1);
//           setTimeout(() => isStumbling = false, 1000);
//         }, 4000)
//       }
//     });

//     window.addEventListener('resize', () => {
//       camera.aspect = container.clientWidth / container.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(container.clientWidth, container.clientHeight);
//     });

//     const clock = new THREE.Clock();
//     function animate() {
//       requestAnimationFrame(animate);
//       mixer.update(clock.getDelta());
//       renderer.render(scene, camera);
//     }

//     animate();
//     waveAction.play();
// }


// import * as THREE from 'three';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setAnimationLoop( animate );
// document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// function animate() {

// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;

// 	renderer.render( scene, camera );

// }

// import WebGL from 'three/addons/capabilities/WebGL.js';

// if ( WebGL.isWebGLAvailable() ) {

// 	// Initiate function or other initializations here
// 	animate();

// } else {

// 	const warning = WebGL.getWebGLErrorMessage();
// 	document.getElementById( 'container' ).appendChild( warning );

// }