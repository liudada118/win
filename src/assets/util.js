import * as THREE from 'three';

export default class ThreeWinGroup {
    constructor({ sence }) {
        this.MeshHeight = 10
        this.meshWeight = 10
        this.sence = sence
        this.winArr = []
        this.colArr = []
        this.colGroup = new THREE.Group()
    }

    addWin({ width, height }) {
        this.winArr.push({ group: new THREE.Group() })
        this.width = width
        this.height = height
        const geometryL = new THREE.BoxGeometry(height, this.MeshHeight, this.meshWeight);
        const materialL = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cubeL = new THREE.Mesh(geometryL, materialL);
        const group = this.winArr[this.winArr.length - 1].group
        // cubeL.position.y = height/2
        cubeL.rotation.z = Math.PI / 2
        cubeL.position.x = width / 2 - this.MeshHeight / 2
        cubeL.position.y = this.MeshHeight / 2

        const geometryR = new THREE.BoxGeometry(height, this.MeshHeight, this.meshWeight);
        const materialR = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cubeR = new THREE.Mesh(geometryR, materialR);
        // cubeR.position.y = -height/2
        cubeR.rotation.z = Math.PI / 2
        cubeR.position.x = -(width / 2 - this.MeshHeight / 2)
        cubeR.position.y = this.MeshHeight / 2

        const geometryT = new THREE.BoxGeometry(width, this.MeshHeight, this.meshWeight);
        const materialT = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cubeT = new THREE.Mesh(geometryT, materialT);
        cubeT.position.y = -height / 2


        const geometryB = new THREE.BoxGeometry(width, this.MeshHeight, this.meshWeight);
        const materialB = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cubeB = new THREE.Mesh(geometryB, materialB);
        cubeB.position.y = height / 2


        const geometryBox = new THREE.PlaneGeometry(width - this.MeshHeight, height - this.MeshHeight);
        const materialBox = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        const cubeBox = new THREE.Mesh(geometryBox, materialBox);
        cubeBox.position.z = - this.MeshHeight / 2

        group.add(cubeL)
        group.add(cubeR)
        group.add(cubeT)
        group.add(cubeB)
        // group.add(cubeBox)
        this.sence.add(group)
    }

    addCol(arr) {
        const winArr = this.winArr[this.winArr.length - 1]
        const group = this.winArr[this.winArr.length - 1].group
        arr.forEach(col => {
            const geometry = new THREE.BoxGeometry(this.height, this.MeshHeight, this.meshWeight);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            // cube.position.y = -height/2
            cube.rotation.z = Math.PI / 2
            cube.position.x = -(this.width / 2 - this.MeshHeight / 2) + col
            cube.position.y = this.MeshHeight / 2
            group.add(cube)
        });
        this.sence.add(group)
        winArr.colArr = [0, ...arr, this.width]
    }

    addRow(arr) {
        let rowAllArr = [...arr]
        const location = rowAllArr[0]
        console.log(location)
        const rowArr = rowAllArr.splice(0, 1)
        const group = this.winArr[this.winArr.length - 1].group
        const colArr = this.winArr[this.winArr.length - 1].colArr
        console.log(this.winArr,colArr)
        const lengthArr = []
        for (let i = 1; i < colArr.length; i++) {
            lengthArr.push(colArr[i] - colArr[i - 1])
        }

        lengthArr.forEach((length,index) => {
            console.log(length)
            const geometry = new THREE.BoxGeometry(length, this.MeshHeight, this.meshWeight);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            // cube.position.y = -height/2
            // cube.rotation.z = Math.PI / 2
            cube.position.x = -(this.width / 2 - this.MeshHeight / 2) + colArr[index] + length / 2 - this.MeshHeight / 2 
            cube.position.y = -this.MeshHeight / 2 + location
            group.add(cube)
        })


        this.sence.add(group)
    }
}