import logo from './logo.svg';
import './App.css';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { Button, Drawer, Input } from 'antd';
import { DragControls } from 'three/addons/controls/DragControls.js';
import ThreeWinGroup from './assets/util';
function App() {
  const [open, setOpen] = useState(false);
  const [nowMesh, setNowMesh] = useState(null)
  const [col, setCol] = useState()
  const [row, setRow] = useState()
  const win = useRef()
  let camera, scene, renderer, controls;
  let selectedObject = null;
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const controls = new TrackballControls(camera, renderer.domElement);



    win.current = new ThreeWinGroup({ sence: scene })
    win.current.addWin({ width: 1000, height: 500, })
    camera.position.z = 1000;

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      controls.keys = {
        LEFT: 'ArrowLeft', //left arrow
        UP: 'ArrowUp', // up arrow
        RIGHT: 'ArrowRight', // right arrow
        BOTTOM: 'ArrowDown' // down arrow
      }
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.LEFT,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      }
      renderer.render(scene, camera);
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    window.addEventListener('click', onMouseClick, false);

    // 鼠标点击事件处理函数
    function onMouseClick(event) {
      // 计算鼠标点击位置的归一化设备坐标
      var mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      // 创建射线投射器
      var raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // 计算射线和物体的交点
      var intersects = raycaster.intersectObjects(scene.children);

      // 如果有交点，说明点击了物体
      if (intersects.length > 0) {
        var clickedObject = intersects[0].object;
        console.log('点击了物体:', clickedObject);
        setNowMesh(clickedObject)
        // 在这里添加你的事件处理逻辑
        showDrawer()
      }
    }

    // window.addEventListener('mousedown', onMouseDown, false);
    // window.addEventListener('mousemove', onMouseMove, false);
    // window.addEventListener('mouseup', onMouseUp, false);

    // 监听窗口大小变化
    window.addEventListener('resize', onWindowResize, false);

    // function onMouseDown(event) {
    //   event.preventDefault();

    //   // 计算鼠标位置
    //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //   // 设置射线的起点和方向
    //   raycaster.setFromCamera(mouse, camera);

    //   // 检测射线与物体的交点
    //   const intersects = raycaster.intersectObjects(scene.children);

    //   // 如果有交点，选中第一个物体
    //   if (intersects.length > 0) {
    //     selectedObject = intersects[0].object;
    //   }
    // }

    // function onMouseMove(event) {
    //   event.preventDefault();

    //   if (selectedObject) {
    //     // 计算鼠标位置
    //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //     // 设置射线的起点和方向
    //     raycaster.setFromCamera(mouse, camera);

    //     // 计算物体的新位置
    //     const intersects = raycaster.intersectObject(selectedObject);
    //     if(intersects[0]){const newPosition = intersects[0].point;

    //     // 更新物体的位置
    //     selectedObject.position.x = newPosition.x;
    //     selectedObject.position.y = newPosition.y;}
    //   }
    // }

    // function onMouseUp(event) {
    //   event.preventDefault();

    //   // 重置选中的物体
    //   selectedObject = null;
    // }




    let isDragging = false;

    function onMouseDown(event) {
      event.preventDefault();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        console.log(intersects)
        selectedObject = intersects[0].object;
        isDragging = true;
      }
    }

    function onMouseMove(event) {
      event.preventDefault();

      if (isDragging) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(selectedObject);
        if (intersects[0]) {
          const newPosition = intersects[0].point;

          const maxX = 5;
          const maxY = 5;
          const minX = -5;
          const minY = -5;

          // newPosition.x = Math.max(Math.min(newPosition.x, maxX), minX);
          // newPosition.y = Math.max(Math.min(newPosition.y, maxY), minY);
          selectedObject.parent.position.lerp(newPosition, 1);
          selectedObject.parent.position.x = newPosition.x;
          selectedObject.parent.position.y = newPosition.y;
          selectedObject.parent.position.z = 0;
        }
      }
    }

    function onMouseUp(event) {
      event.preventDefault();
      isDragging = false;
    }



    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }


    animate();
  }, [])


  return (
    <>
      <div className="App">
        <div className='boxItem'></div>
      </div>
      <Drawer title="添加属性" placement="right" onClose={onClose} open={open}>
        <div style={{ display: 'flex' }}>竖庭<Input value={col} onChange={(e) => {
          setCol(e.target.value)
        }} /> <Button onClick={() => {
          win.current.addCol(col.split(',').map((a) => Number(a)))
        }}>添加</Button></div>

        <div style={{ display: 'flex' }}>横庭<Input value={row} onChange={(e) => {
          setRow(e.target.value)
        }} /> <Button onClick={() => {
          win.current.addRow(row.split(',').map((a) => Number(a)))
        }}>添加</Button></div>
      </Drawer>
    </>

  );
}

export default App;
