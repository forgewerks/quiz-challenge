/*------------------------------*/
/*------THREE.JS BOILERPLATE----*/
/*------------------------------*/

/*-----Canvas/Renderer/Scene Setup-----*/
const canvas = document.getElementById('face-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth/canvas.clientHeight, 0.1, 1000);
camera.position.z = 2.75;

/*-----Canvas Window Resize-----*/
function updateRendererSize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
updateRendererSize();
window.addEventListener('resize', updateRendererSize);

/*------Scene/Camera Setup-------*/

/*------------------------------*/
/*------SCREEN SPACE SETUP------*/
/*------------------------------*/

/*-----Lighting Setup-----*/
const light = new THREE.DirectionalLight( 0x707070 , 1);
light.position.set(0, 0, 5).normalize();
scene.add(light);
const lightA = new THREE.AmbientLight( 0xAAAAAA );
scene.add( lightA );

/*-----Model(Face)Loading-----*/
let head = null;
const loader = new THREE.GLTFLoader();

loader.load('./resources/face.glb', (gltf) => {
    head = gltf.scene;
    head.scale.set(1.5, 1.5, 1.5);
    scene.add(head);
}, undefined, (error) => {
    console.error('Error loading GLTF:', error);
});

/*-----Model-CursorFollow-----*/
let targetRotation = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((event.clientY - rect.top) / rect.height) * -2 - 1);
    targetRotation.y = x * 0.15; 
    targetRotation.x = y * 0.15;
});
function animate() {
    requestAnimationFrame(animate);
    if(head !== null){
        head.rotation.y += (targetRotation.y - head.rotation.y) * 0.1;
        head.rotation.x += (targetRotation.x - head.rotation.x) * 0.1;
    }
    renderer.render(scene, camera);
}
animate();