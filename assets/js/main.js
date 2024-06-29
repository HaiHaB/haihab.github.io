import * as THREE from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const Renderer = {
    container: null,
    renderer: null,

    init: function () {
        this.container = document.getElementById('avatar-container');
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setAnimationLoop(this.onAnimate);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.shadowMap.enabled = true;

        window.addEventListener('resize', () => {
            this.onResize();
        });
    },

    onResize: function () {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        Head.onResize();
        Chart.onResize();
    },

    onAnimate: function () {
        Head.onAnimate();
        Chart.onAnimate();
        Matrix.onAnimate();
        Circle.onAnimate();
        Axis.onAnimate();
    },
};

const Head = {
    camera: null,
    scene: null,
    fbx: null,
    controls: null,

    init: function () {
        (new FBXLoader()).load('./assets/3D/humanhead.fbx', (fbx) => {
            this.ready(fbx);
        });
    },

    ready: function (fbx) {

        const container = Renderer.container;

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);
        this.camera.position.set(0, 0, 50);

        // Scene setup
        this.scene = new THREE.Scene();

        // Add OrbitControls for better interaction
        this.controls = new OrbitControls(this.camera, Renderer.renderer.domElement);
        this.controls.autoRotate = true; // set the autoRotate property to true
        this.controls.autoRotateSpeed = 1; // adjust the speed of rotation

        //@Todo Add axis helper, but better to remove it
        const axesHelper = new THREE.AxesHelper(50);
        this.scene.add(axesHelper)

        // Load avatar
        fbx.traverse(function (child) {
            if (child.isMesh) {
                // Original material
                child.material = new THREE.MeshStandardMaterial({
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
        this.scene.add(fbx);

        // Adjust the model scale and position if necessary
        fbx.position.set(0, 0, 0); // Center the object

        // Compute the bounding box to center the model
        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        fbx.position.sub(center);

        this.scene.add(fbx);

        this.fbx = fbx;
    },

    onResize: function () {
        this.camera.aspect = Renderer.container.clientWidth / Renderer.container.clientHeight;
        this.camera.updateProjectionMatrix();
    },

    onAnimate: function () {

        if (this.fbx === null) return;

        // Auto-rotate camera
        this.controls.update();

        const renderer = Renderer.renderer;
        const container = Renderer.container;
        renderer.setViewport(0, 0, container.clientWidth, container.clientHeight);
        renderer.setScissor(0, 0, container.clientWidth, container.clientHeight);
        renderer.setScissorTest(true);
        renderer.render(this.scene, this.camera);
    }
};


const Chart = {
    data: [],
    chartScene: null,
    chartCamera: null,
    chartLine: null,
    counter: 0,

    init: function () {

        // Create chart scene
        this.chartScene = new THREE.Scene();
        this.chartCamera = new THREE.OrthographicCamera(0, 51, 51, 0, -1, 1); // Adjusted right and top parameters

        // Initialize chart line
        const chartMaterial = new THREE.LineBasicMaterial({color: 0xFF00ff});
        const chartGeometry = new THREE.BufferGeometry().setFromPoints([]);

        this.chartLine = new THREE.Line(chartGeometry, chartMaterial);
        this.chartScene.add(this.chartLine);

        // Generate initial chart data
        for (let i = 0; i < 50; i++) {
            this.data.push({x: i, y: (Math.sin(i / 5)) * 15 + 25});
        }

        // Create X and Y axes
        const axesMaterial = new THREE.LineBasicMaterial({color: 0xFFFF00}); // Yellow color for axes

        // X axis
        const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1, 1, 0), new THREE.Vector3(51, 1, 0)]);
        const xAxis = new THREE.Line(xAxisGeometry, axesMaterial);
        this.chartScene.add(xAxis);

        // Arrow for X axis
        const xAxisArrow = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2, 4), axesMaterial);
        xAxisArrow.position.set(50, 1, 0); // Adjusted x position
        xAxisArrow.rotation.z = -Math.PI / 2;
        this.chartScene.add(xAxisArrow);

        // Y axis
        const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1, 1, 0), new THREE.Vector3(1, 51, 0)]);
        const yAxis = new THREE.Line(yAxisGeometry, axesMaterial);
        this.chartScene.add(yAxis);

        // Arrow for Y axis
        const yAxisArrow = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2, 4), axesMaterial);
        yAxisArrow.position.set(1, 50, 0); // Adjusted y position
        this.chartScene.add(yAxisArrow);
    },

    onResize: function () {
    },

    onAnimate: function () {
        this.counter++; // Increment the counter

        // Only add a new data point every 2 frames - use to slow down the chart
        if (this.counter % 2 === 0) {
            this.counter = 0;

            this.data.shift();

            let firstPoint = this.data[0];
            let lastPoint = this.data[this.data.length - 1];
            this.data.push({x: lastPoint.x + 1, y: (Math.sin((lastPoint.x + 1) / 5)) * 15 + 25});

            const points = this.data.map(d => new THREE.Vector3(d.x - firstPoint.x + 1, d.y, 0));
            this.chartLine.geometry.setFromPoints(points);
        }

        const renderer = Renderer.renderer;
        const container = Renderer.container;
        const chartWidth = container.clientWidth / 4;
        const chartHeight = container.clientHeight / 4;

        renderer.setViewport(0, 0, chartWidth, chartHeight);
        renderer.setScissor(0, 0, chartWidth, chartHeight);
        renderer.setScissorTest(true);
        renderer.render(this.chartScene, this.chartCamera);
    },
};

const Matrix = {
    matrixScene: null,
    matrixCamera: null,
    matrixText: [],
    font: null,
    counter: 0,

    init: function () {
        // Create matrix scene
        this.matrixScene = new THREE.Scene();
        this.matrixCamera = new THREE.OrthographicCamera(0, 30, 60, 0, -1, 1);

        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            this.font = font;

            // Create lines
            const symbols = ['i1', 'i2', 'i3'];
            const color = new THREE.Color(0xFFFFFF);
            const matLite = new THREE.MeshBasicMaterial({
                color: color,
                //transparent: true,
                //opacity: 0.4,
                side: THREE.DoubleSide
            });

            for(let i = 0; i < 3; i++) {

                const offset = 5 + (i * 20);

                const shapes = this.font.generateShapes(symbols[i], 1);
                const material = new THREE.LineBasicMaterial({color: 0xFFFFFF});

                const geometry = new THREE.ShapeGeometry(shapes);
                const text = new THREE.Mesh(geometry, matLite);
                text.position.x = 2;
                text.position.y = 9 + (i * 20);
                this.matrixScene.add(text);

                const points = [
                    new THREE.Vector3(5, offset + 4.5, 0),
                    new THREE.Vector3(6, offset + 4.5, 0),
                ];
                const geom = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geom, material);
                this.matrixScene.add(line);

                const pointsL = [
                    new THREE.Vector3(11, offset, 0),
                    new THREE.Vector3(10, offset, 0),
                    new THREE.Vector3(10, offset + 10, 0),
                    new THREE.Vector3(11, offset + 10, 0),
                ];
                const geometryL = new THREE.BufferGeometry().setFromPoints(pointsL);
                const lineL = new THREE.Line(geometryL, material);
                this.matrixScene.add(lineL);

                const pointsR = [
                    new THREE.Vector3(19, offset, 0),
                    new THREE.Vector3(20, offset, 0),
                    new THREE.Vector3(20, offset + 10, 0),
                    new THREE.Vector3(19, offset + 10, 0),
                ];
                const geometryR = new THREE.BufferGeometry().setFromPoints(pointsR);
                const lineR = new THREE.Line(geometryR, material);
                this.matrixScene.add(lineR);
            }
        });
    },

    onAnimate: function () {

        if (!this.font) {
            return;
        }

        // Rotate each text mesh
        this.matrixText.forEach(text => {
            text.rotation.y += 0.01;
        });

        // Delay and random number generation
        this.counter++; // Increment the counter

        // Only update the numbers every 5 frames
        if (this.counter % 5 === 0) {
            this.counter = 0;

            // Generate new random numbers
            const newMatrix = [
                [(Math.random() * 9).toFixed(4), (Math.random() * 9).toFixed(4), (Math.random() * 9).toFixed(4), (Math.random() * 9).toFixed(4)],
                [(Math.random() * 9).toFixed(4), (Math.random() * 9).toFixed(4), (Math.random() * 9).toFixed(4), (Math.random() * 9).toFixed(4)],
                [(Math.random() * 9).toFixed(4), (Math.random() * 9).toFixed(4), (Math.random() * 9).toFixed(4), (Math.random() * 9).toFixed(4)],
            ];

            // Update the matrix with the new numbers
            this.updateMatrix(newMatrix);
        }

        const renderer = Renderer.renderer;
        const container = Renderer.container;
        const matrixWidth = container.clientWidth / 4;
        const matrixHeight = container.clientHeight / 4;

        renderer.setViewport(0, matrixHeight, matrixWidth, matrixHeight * 3);
        renderer.setScissor(0, matrixHeight, matrixWidth, matrixHeight * 3);
        renderer.setScissorTest(true);
        renderer.render(this.matrixScene, this.matrixCamera);
    },

    updateMatrix: function (matrixes) {
        // Remove old text meshes from the scene
        this.matrixText.forEach(text => {
            this.matrixScene.remove(text);
        });

        // Clear the matrixText array
        this.matrixText = [];

        // Create new text meshes with updated numbers
        const color = new THREE.Color(0xFFFFFF);
        const matLite = new THREE.MeshBasicMaterial({
            color: color,
            //transparent: true,
            //opacity: 0.4,
            side: THREE.DoubleSide
        });

        matrixes.forEach((array, i) => {
            array.forEach((str, j) => {
                let offset = 0;

                for (const letter of str) {
                    const shapes = this.font.generateShapes(letter, 1);
                    const geometry = new THREE.ShapeGeometry(shapes);
                    const text = new THREE.Mesh(geometry, matLite);

                    text.position.x = 12 + offset;
                    text.position.y = 7 + (i * 20) + j * 1.5;

                    this.matrixScene.add(text);
                    this.matrixText.push(text);

                    // Increase the offset for the next character
                    if (letter === '.') {
                        offset += 0.7;
                    } else {
                        offset += 1.2;
                    }
                }
            });
        });
    },
};

const Circle = {
    circleScene: null,
    circleCamera: null,
    circles: [],
    lines: [],
    degrees: [],
    radius: 8,
    font: null,
    counter: 0,

    init: function () {
        // Create circle scene
        this.circleScene = new THREE.Scene();
        this.circleCamera = new THREE.OrthographicCamera(0, 30, 60, 0, -1, 1);

        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            this.font = font;

            // Create circles and lines
            const symbols = ['y', 'p', 'R'];
            const material = new THREE.LineBasicMaterial({color: 0xFFFFFF});
            const color = new THREE.Color(0xFFFFFF);
            const matLite = new THREE.MeshBasicMaterial({
                color: color,
                //transparent: true,
                //opacity: 0.4,
                side: THREE.DoubleSide
            });

            for (let i = 0; i < 3; i++) {

                const shapes = this.font.generateShapes(symbols[i], 1);
                const material = new THREE.LineBasicMaterial({color: 0xFFFFFF});

                const textGeometry = new THREE.ShapeGeometry(shapes);
                const text = new THREE.Mesh(textGeometry, matLite);
                text.position.x = 8;
                text.position.y = 12 + (i * 20);
                this.circleScene.add(text);

                const geometry = new THREE.CircleGeometry(this.radius, 32); // 5 is the radius and 32 is the number of segments
                const edges = new THREE.EdgesGeometry(geometry);
                const circle = new THREE.Line(edges, material);
                circle.position.x = 20;
                circle.position.y = 12 + (i * 20); // Adjust the x position for each circle
                this.circleScene.add(circle);
                this.circles.push(circle);

                // Create a line from the center to the right of the circle
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(circle.position.x, circle.position.y, 0), new THREE.Vector3(circle.position.x + this.radius, circle.position.y, 0)]);
                const line = new THREE.Line(lineGeometry, material);
                this.circleScene.add(line);
                this.lines.push(line);

                // Create a line from the center to a point on the circle based on a degree value
                const degree = Math.random() * 360; // Random initial degree
                this.degrees.push(degree);
                const radian = degree * Math.PI / 180;
                const lineGeometry2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(circle.position.x, circle.position.y, 0), new THREE.Vector3(circle.position.x + this.radius * Math.cos(radian), circle.position.y + this.radius * Math.sin(radian), 0)]);
                const line2 = new THREE.Line(lineGeometry2, material);
                this.circleScene.add(line2);
                this.lines.push(line2);
            }
        });
    },

    onAnimate: function () {
        if (!this.font) {
            return;
        }

        // Delay and random number generation
        this.counter++; // Increment the counter

        // Only update the numbers every 10 frames
        if (this.counter % 5 === 0) {
            this.counter = 0;

            // Update the degree values randomly and update the lines
            for (let i = 0; i < 3; i++) {
                this.degrees[i] += (Math.random() - 0.5) * 45; // Random change in degree
                const radian = this.degrees[i] * Math.PI / 180;
                const circle = this.circles[i];
                const line = this.lines[i * 2 + 1]; // The line from the center to a point on the circle
                line.geometry.setFromPoints([new THREE.Vector3(circle.position.x, circle.position.y, 0), new THREE.Vector3(circle.position.x + this.radius * Math.cos(radian), circle.position.y + this.radius * Math.sin(radian), 0)]);
            }
        }

        const renderer = Renderer.renderer;
        const container = Renderer.container;
        const circleWidth = container.clientWidth / 4;
        const circleHeight = container.clientHeight / 4;

        renderer.setViewport(3 * circleWidth, circleHeight, circleWidth, circleHeight * 3);
        renderer.setScissor(3 * circleWidth, circleHeight, circleWidth, circleHeight * 3);
        renderer.setScissorTest(true);
        renderer.render(this.circleScene, this.circleCamera);
    },
};

const Axis = {
    axisScene: null,
    axisCamera: null,

    init: function () {
        // Create axis scene
        this.axisScene = new THREE.Scene();
        this.axisCamera = new THREE.PerspectiveCamera(75, Renderer.container.clientWidth / Renderer.container.clientHeight, 0.1, 1000);
        this.axisCamera.position.set(9, 9, 9); // Adjust the camera position
        this.axisCamera.lookAt(0, 0, 0); // Make the camera look at the origin

        // Create an AxesHelper and add it to the scene
        const axesHelper = new THREE.AxesHelper(7); // Reduce the size of the axes
        const axesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const axes = new THREE.LineSegments(axesHelper.geometry, axesMaterial);
        this.axisScene.add(axes);

        // Create ArrowHelpers for each axis
        const arrowSize = 1.4; // Reduce the size of the arrows
        const arrowDir = new THREE.Vector3(1, 0, 0);
        const arrowOrigin = new THREE.Vector3(7, 0, 0); // Adjust the origin of the arrows
        const arrowHelperX = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowSize, 0xffffff);
        this.axisScene.add(arrowHelperX);

        arrowDir.set(0, 1, 0);
        arrowOrigin.set(0, 7, 0);
        const arrowHelperY = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowSize, 0xffffff);
        this.axisScene.add(arrowHelperY);

        arrowDir.set(0, 0, 1);
        arrowOrigin.set(0, 0, 7);
        const arrowHelperZ = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowSize, 0xffffff);
        this.axisScene.add(arrowHelperZ);
    },

    onResize: function () {
        this.axisCamera.aspect = Renderer.container.clientWidth / Renderer.container.clientHeight;
        this.axisCamera.updateProjectionMatrix();
    },

    onAnimate: function () {

        if (!Head.fbx) {
            return;
        }

        this.axisScene.rotation.copy(Head.camera.rotation);

        const renderer = Renderer.renderer;
        const container = Renderer.container;
        const axisWidth = container.clientWidth / 4;
        const axisHeight = container.clientHeight / 4;

        renderer.setViewport(3 * axisWidth, 0, axisWidth, axisHeight);
        renderer.setScissor(3 * axisWidth, 0, axisWidth, axisHeight);
        renderer.setScissorTest(true);
        renderer.render(this.axisScene, this.axisCamera);
    },
};

(function () {
    Renderer.init();

    Head.init();
    Chart.init();
    Matrix.init();
    Circle.init();
    Axis.init();
})();