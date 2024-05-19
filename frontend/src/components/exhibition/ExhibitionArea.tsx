import React, { useEffect, useState, useRef } from 'react';
import styles from "./css/ExhibitionArea.module.css";
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshObject } from './MeshObject.ts';
import { KeyController } from './KeyController.ts';
import { Player } from './Player.ts';
import showPhotoDetail from './showPhotoDetail.ts';
import { Circle } from 'rc-progress';
import { useNavigate, useLocation } from 'react-router-dom';
import { getExhibitionPhotos } from '../../apis/exhibitionApi.ts';

const ExhibitionArea: React.FC = () => {
	const navigate = useNavigate();
	const {state} = useLocation();
	const {exhibitionId} = state;
  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [tutorialClosed, setTutorialClosed] = useState<boolean>(false);
  const [chatExpanded, setChatExpanded] = useState<boolean>(true);
  const [chatContent ,setChatContent] = useState<{ nickname: string, content: string }[]>([
  ]);
  const [chatValue, setChatValue] = useState<string>('');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const handleLoading = (percent: number) => {
    setLoadingPercent(percent);
    if(percent === 100) {
      setTimeout(()=>{
        setIsLoading(false);
      }, 3000);
    }
  }
  useEffect(() => {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color('black');
		
		// Renderer
		const canvas = document.querySelector('#canvas');
    let renderer; // renderer 변수를 useEffect 함수 내에 선언

		getExhibitionPhotos(exhibitionId)
		.then(res => {
			const exhibitionPhotos = res;
			console.log(res)
			 // Loader
			 const gltfLoader = new GLTFLoader();
			 const textureLoader = new THREE.TextureLoader();
			 
			 if(canvas instanceof HTMLCanvasElement){
				 renderer = new THREE.WebGLRenderer({
					 canvas: canvas,
					 antialias: true
				 });
	 
			 renderer.setSize(window.innerWidth, window.innerHeight);
			 renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
			 renderer.shadowMap.enabled = true; 
			 renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	 
			 // Camera
			 const camera = new THREE.PerspectiveCamera(
				 60, // fov 화각
				 window.innerWidth / window.innerHeight, // aspect 가로세로 비율
				 0.1, // near 가장 가까운 거리
				 1000 // far 가장 먼 거리
			 );
			 camera.position.set(0, 1, 7);
			 camera.lookAt(-12, 1, 10)
			 scene.add(camera);
	 
			 // Light
	 
			 // 복도 조명
			 for(let i=0; i<5; i++){
				 const corridorLight = new THREE.PointLight('#bbbbbb', 10, 10);
				 corridorLight.castShadow = true;
				 corridorLight.position.y = 2;
				 corridorLight.position.x = 7.598 - i*6;
				 corridorLight.position.z = -12;
				 scene.add(corridorLight);
			 }
	 
			 // 각 사진 조명 추가
			 const paintLights = [ { x: 1, z: 8.7, type: 'models/paintLight_L.glb' }, { x: -5, z: 8.7, type: 'models/paintLight_L.glb' }, { x: -11.2, z: 8.7, type: 'models/paintLight_L.glb' }, 
														 { x: 0, z: 3.5, type: 'models/paintLight_S.glb' }, { x: -10, z: 3.5, type: 'models/paintLight_S.glb' }, { x: 0, z: -1.5, type: 'models/paintLight_S.glb' }, 
														 { x: -10, z: -1.5, type: 'models/paintLight_S.glb' }, { x: 0, z: -6.5, type: 'models/paintLight_S.glb' }, { x: -10, z: -6.5, type: 'models/paintLight_S.glb' }]
	 
			 exhibitionPhotos.content.forEach((data: any) => {
				 const index = data.number;
				 const paintLight = new THREE.PointLight('#eac6ab', 10, 10);
				 paintLight.castShadow = true;
				 paintLight.position.x = paintLights[index].x;
				 paintLight.position.y = 1;
				 paintLight.position.z = paintLights[index].z;      
				 scene.add(paintLight);
	 
				 new MeshObject({
					 scene,
					 light: true,
					 name: 'lightObj',
					 loader: gltfLoader,
					 x: paintLights[index].x,
					 z: paintLights[index].z,
					 modelSrc: paintLights[index].type,
				 })
			 })
	 
			 // Cannon(Physics)
			 const cannonWorld = new CANNON.World();
			 cannonWorld.gravity.set(0, -10, 0);
	 
			 const defaultCannonMaterial = new CANNON.Material('default');
			 const defaultContactMaterial = new CANNON.ContactMaterial(
				 defaultCannonMaterial,
				 defaultCannonMaterial,
				 {
					 friction: 1,
					 restitution: 0.2
				 }
			 );
			 cannonWorld.defaultContactMaterial = defaultContactMaterial;
			 
			 const cannonObjects: Array<MeshObject> = [];
	 
			 // Mesh
			 const imagePos = [
				 {x:1.18,y:2,z:9.95}, {x:-5,y:2,z:9.95}, {x:-11.167,y:2,z:9.95}, 
				 {x:0,y:1.3363,z:4.8}, {x:-10,y:1.3363,z:4.8}, {x:0,y:1.3363,z:-0.2}, 
				 {x:-10,y:1.3363,z:-0.28}, {x:0,y:1.3363,z:-5.199}, {x:-10,y:1.3363,z:-5.199}
			 ]
	 
			 const loadImage = (url: string, index: number) => {
					 const image = new Image();
					 image.crossOrigin = "anonymous";
					 image.src = url;
					 
					 image.onload = () => {
						 const texture = textureLoader.load(url);
						 makeMesh(texture, image, index);
					 };
			 };
	 
			 exhibitionPhotos.content.forEach((image: any) => {
				 loadImage(image.photoUrl, image.number);
			 });
	 
			 const makeMesh = (texture: THREE.Texture, image: HTMLImageElement & { title: string }, index: number) => {
				 let criteriaWidth, criteriaHeight;
					 if(index < 3){
						 criteriaWidth = (1.579 * 2);
						 criteriaHeight = (1.579 * 2);
					 }
					 else {
						 criteriaWidth = (1.0 * 2);
						 criteriaHeight = (0.793 * 2);
					 }
					 const ratioWidth = criteriaWidth / image.width;
					 const ratioHeight = criteriaHeight / image.height;
	 
					 let newWidth, newHeight;
					 if (ratioWidth < ratioHeight) {
							 newWidth = criteriaWidth;
							 newHeight = image.height * ratioWidth;
					 } else {
							 newHeight = criteriaHeight;
							 newWidth = image.width * ratioHeight;
					 }
	 
					 const photo = {
						 scene,
						 name: image.title,
						 width: newWidth,
						 height: newHeight,
						 depth: 0.05,
						 x: imagePos[index].x,
						 y: imagePos[index].y,
						 z: imagePos[index].z,
						 texture
					 }
					 new MeshObject(photo);
			 }
	 
			 new MeshObject({
				 scene,
				 name: 'exhibition',
				 loader: gltfLoader,
				 differenceY: 0,
				 mass: 0,
				 y: 1,
				 modelSrc: 'models/exhibition.glb',
				 onLoading: handleLoading
			 })
	 
			 // 물리법칙이 필요한 Mesh
			 const walls = new MeshObject({
				 scene,
				 cannonWorld,
				 cannonMaterial: defaultCannonMaterial,
				 name: 'walls',
				 loader: gltfLoader,
				 mass: 0,
				 color: 'red',
				 modelSrc: 'models/walls.glb'
			 })
			 cannonObjects.push(walls);
	 
			 const ground = new MeshObject({
				 scene,
				 cannonWorld,
				 cannonMaterial: defaultCannonMaterial,
				 name: 'ground',
				 width: 50,
				 height: 1,
				 depth: 50,
				 y: -1
			 });
			 cannonObjects.push(ground);
	 
			 const player = new Player({
				 scene,
				 cannonWorld,
				 cannonMaterial: defaultCannonMaterial,
				 mass: 100,
				 x: 10,
				 z:-12,
				 y: 1,
				 rotationZ: -90,
				 name: 'player'
			 });
	 
			 for(const object of cannonObjects) {
				 if(object.cannonBody) {
					 if(object.mesh !== undefined){
						 object.mesh.position.copy(object.cannonBody.position)
					 }
				 }
			 }
	 
			 // controller
	 
			 const key = new KeyController();
			 key.setWebsiteMode(true);
			 function move() {
				 if(key.keys['KeyW'] || key.keys['ArrowUp']) {
					 // 앞으로 가기
					 player.walk(-0.08, 'forward');
				 }
				 if(key.keys['KeyS'] || key.keys['ArrowDown']) {
					 // 뒤로 가기
					 player.walk(0.08, 'backward');
				 }
				 if(key.keys['KeyA'] || key.keys['ArrowLeft']) {
					 // 왼쪽으로 가기
					 player.walk(0.08, 'left');
				 }
				 if(key.keys['KeyD'] || key.keys['ArrowRight']) {
					 // 오른쪽으로 가기
					 player.walk(0.08, 'right');
				 }
				 const index = showPhotoDetail(camera.position.x, camera.position.z);
				 if(index !== -1 && title == ''){
					 exhibitionPhotos.content.forEach((paint: any) => {
						 if(paint.number === index) {
							 setTitle(paint.title);
							 setShowDetail(true);
						 }
					 })
					 
				 }
				 else{
					 setTitle('');
					 setShowDetail(false);
				 }
			 }
	 
			 let movementX = 0;
			 let movementY = 0;
			 let delta = 0;
			 function updateMovementValue(e: MouseEvent){
				 const sensitivity = 0.08;
				 movementX = e.movementX * delta * sensitivity;
				 movementY = e.movementY * delta * sensitivity;
			 }
	 
	 
			 // camera
	 
			 const euler = new THREE.Euler(0, 0, 0, 'YXZ');
			 const minPolarAngle = 0;
			 const maxPolarAngle = Math.PI;
	 
			 function rotateCamera() {
				 // rotation
				 delta = clock.getDelta();
				 euler.setFromQuaternion(camera.quaternion);
				 euler.y -= movementX;
				 euler.x -= movementY;
				 euler.x = Math.max(Math.PI/2 - maxPolarAngle, Math.min(Math.PI/2 - minPolarAngle, euler.x));
				 movementX -= movementX * 0.005;
				 movementY -= movementY * 0.005;
				 if(Math.abs(movementX) < 0.1) movementX = 0;
				 if(Math.abs(movementY) < 0.1) movementY = 0;
				 camera.quaternion.setFromEuler(euler);
				 player.rotationY = euler.y;
	 
				 // position
				 camera.position.x = player.x;
				 camera.position.y = player.y + 1.55;
				 camera.position.z = player.z;
			 }
	 
			 // Draw 
			 const clock = new THREE.Clock();
			 function draw() {
				 
				 let cannonStepTime = 1/60;
				 if(delta < 0.01) cannonStepTime = 1/120;
				 cannonWorld.step(cannonStepTime, delta, 3);
	 
				 rotateCamera();
				 renderer!.render(scene, camera);
				 renderer!.setAnimationLoop(draw);
	 
				 if(player.cannonBody != null){
					 player.mesh.position.copy(player.cannonBody.position);
					 player.x = player.cannonBody.position.x;
					 player.y = player.cannonBody.position.y;
					 player.z = player.cannonBody.position.z;
				 }
				 
				 move();
			 }
			 draw();
	 
			 function setMode(mode: string) {
				 document.body.dataset.mode = mode;
	 
				 if(mode === 'game'){
					 document.addEventListener('mousemove', updateMovementValue)
				 }else if(mode === 'website'){
					 document.removeEventListener('mousemove', updateMovementValue)
				 }
			 }
	 
			 // 반응형
			 function setLayout() {
				 camera.aspect = window.innerWidth / window.innerHeight;
				 camera.updateProjectionMatrix();
				 renderer!.setSize(window.innerWidth, window.innerHeight);
			 }
			 window.addEventListener('resize', setLayout);
	 
			 
			 let lastRequestTime = 0;
			 const requestInterval = 1000; // 1초
			 let pointerLockRequested = false;
			 
			 canvas.addEventListener('click', () => {
					 const currentTime = performance.now();
					 // 이전 요청 이후 1초가 지나지 않았으면 다시 요청하지 않음
					 if (currentTime - lastRequestTime > requestInterval && !pointerLockRequested) {
							 pointerLockRequested = true;
							 lastRequestTime = currentTime;
							 
							 // @ts-ingnore
							 canvas.requestPointerLock().catch(() => {
									 // 포인터락 요청이 실패한 경우
									 pointerLockRequested = false; // 요청 상태 초기화
							 });
					 }
			 });
			 
			 
			 document.addEventListener('pointerlockchange', () => {
					 pointerLockRequested = false;
					 if (document.pointerLockElement === canvas) {
							 setMode('game');
							 key.setWebsiteMode(false);
					 } else {
							 setMode('website');
							 key.setWebsiteMode(true);
					 }
			 });
			 }
		})
		.catch(err => console.log(err))

		return() => {
			while (scene.children.length > 0) {
				const child = scene.children[0];
				scene.remove(child);
				if (child instanceof THREE.Mesh) {
					child.geometry.dispose(); // geometry 해제
					child.material.dispose(); // material 해제
				}
			}
			renderer!.dispose();
		}
  }, [])

  useEffect(()=>{
    if(chatContainerRef.current)
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatContent])
  
  const handleCloseClick = () =>{
    setTutorialClosed(true);
  }
  const handleChatExpandClick = () =>{
    setChatExpanded(!chatExpanded);
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatValue(e.target.value);
  }
  const handleSendChat = ()=>{
    setChatContent([...chatContent, {nickname: '김규리', content: chatValue}]);
    setChatValue('');
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>{
    if(e.key === 'Enter') {
      handleSendChat()
    }
  }
  const handleChatExpand = () =>{
    setChatExpanded(false);
  }

  return (
    <div className={styles.main_container}>
      { !tutorialClosed &&
      <div className={styles.tutorial}>
        <div className={styles.description_exit}>
          <img src='imgs/twisted_arrow.png' alt='arrow'/>
          <h1>나가고 싶을 때 클릭하세요</h1>
        </div>
        <div className={styles.description_move}>
          <img src='imgs/keyboard.png' alt='arrow'/>
          <h1>방향키 혹은 W,A,S,D로 이동하세요</h1>
        </div>
        <div className={styles.description_camera}>
          <img src='imgs/directional_arrow.png' alt='arrow'/>
          <h1>클릭 & ESC키를 통해 전시회 화면을 오고 가세요!</h1>
        </div>
        <div className={styles.exit_tutorial} onClick={handleCloseClick}>튜토리얼 닫기</div>
      </div>
      }
      <div className={styles.btn_exit} onClick={()=>{navigate(-1);}}>나가기</div>
      {
        isLoading && 
          <div className={styles.loading}>
            <div>
              <Circle style={{width: '200px'}} percent={loadingPercent} strokeWidth={10} strokeColor='white'/>
              <h1 style={{color: 'white', width: '200px', margin:'20px auto'}}>{loadingPercent}%<br></br>Loading...</h1>
            </div>
          </div>
      }
      
      <div className={`${showDetail && styles.photo_info_visible} ${styles.photo_info}`}>
				<p>Title: {title}</p>
      </div>

      <div className={`${styles.chat_container} ${chatExpanded && styles.chat_container_clicked}`}>
        <div className={styles.chat_info_area}>
          <img src='imgs/keyboard-arrow.png' className={`${chatExpanded && styles.img_clicked}`} onClick={handleChatExpandClick} alt='arrow'/>
        </div>
        {/* 채팅영역 */}
        <div className={`${styles.chat_main} ${chatExpanded && styles.hide_chat}`} ref={chatContainerRef}>
          {
            chatContent.map(data => {
              return (
                <div className={styles.chat_content}>
                  <p className={styles.nickname}>{data.nickname}:</p>
                  <p className={styles.content}>{data.content}</p>
                </div>
              )
            })
          }
        </div>
        
        <div className={styles.chat_input_area}>
          <input onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={handleChatExpand} value={chatValue}/>
          <div className={styles.chat_send_btn} onClick={handleSendChat}>전송</div>
        </div>
      </div>
      <canvas id='canvas'></canvas>
      <div className={styles.target_marker}></div>
    </div>
  );
}

export default ExhibitionArea;
