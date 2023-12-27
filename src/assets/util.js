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
        this.winArr.push({ group: new THREE.Group(), rowArr: [], colArr: [] })
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
        winArr.boxGroup = new THREE.Group()
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


        const lengthArr = []
        for (let i = 1; i < winArr.colArr.length; i++) {
            lengthArr.push(winArr.colArr[i] - winArr.colArr[i - 1])
        }


        winArr.colLengthArr = lengthArr
        lengthArr.forEach((length, index) => {
            const geometry = new THREE.PlaneGeometry(length, this.height);
            const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
            const plane = new THREE.Mesh(geometry, material);
            plane.position.x = - this.width / 2 + winArr.colArr[index] + length / 2
            // this.sence.add(plane);
            winArr.boxGroup.add(plane)
        })
        this.sence.add(winArr.boxGroup)

    }

    addRow(arr) {
        let rowAllArr = [...arr]
        const location = rowAllArr[0]
        console.log(location)
        const rowArr = [...rowAllArr]
        rowArr.splice(0, 1)
        const winArr = this.winArr[this.winArr.length - 1]
        const group = this.winArr[this.winArr.length - 1].group
        const boxGroup = this.winArr[this.winArr.length - 1].boxGroup
        const colArr = this.winArr[this.winArr.length - 1].colArr
        const colLengthArr = this.winArr[this.winArr.length - 1].colLengthArr
        winArr.rowArr.push([...arr])
     
        console.log(this.winArr, colArr)
        // 计算每个横庭的长度
        const lengthArr = []
        for (let i = 1; i < colArr.length; i++) {
            lengthArr.push(colArr[i] - colArr[i - 1])
        }

        // 将每个竖庭区域的  横庭找出来 boxobj key
        const boxObj = {}
        for (let i = 0; i < colArr.length - 1; i++) {
            boxObj[colArr[i]] = [0]
        }
        console.log(boxObj)
        for (let i = 0; i < winArr.rowArr.length; i++) {
            const location = winArr.rowArr[i][0]
            const rowArr = [...winArr.rowArr[i]]
            rowArr.splice(0, 1)
            for (let i = 0; i < rowArr.length; i++) {
                console.log(rowArr[i] - 1)

                if (!boxObj[colArr[rowArr[i] - 1]].includes(location)) {
                    boxObj[colArr[rowArr[i] - 1]].push(location)
                }
            }
        }

        for (let i = 0; i < colArr.length - 1; i++) {
            boxObj[colArr[i]].push(this.height)
        }

        // 将每个竖庭的长度找出来
        const lengthObj = {}
        Object.keys(boxObj).forEach((key, index) => {
            lengthObj[key] = []
            for (let i = 1; i < boxObj[key].length; i++) {
                lengthObj[key].push(boxObj[key][i] - boxObj[key][i - 1])
            }
        })

        // console.log(boxObj)

        // 将横庭框架画上
        lengthArr.forEach((length, index) => {
            console.log(length)
            if (rowArr.includes(index + 1)) {
                const geometry = new THREE.BoxGeometry(length, this.MeshHeight, this.meshWeight);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const cube = new THREE.Mesh(geometry, material);
                // cube.position.y = -height/2
                // cube.rotation.z = Math.PI / 2
                cube.position.x = -(this.width / 2 - this.MeshHeight / 2) + colArr[index] + length / 2 - this.MeshHeight / 2
                cube.position.y = -this.MeshHeight / 2 - this.height / 2 + location
                group.add(cube)
            }
        })

        this.sence.remove(boxGroup)
        console.log(lengthObj)
        winArr.boxGroup = new THREE.Group()
        // 画完横庭之后，找出窗户被分割出来的区域
        Object.keys(lengthObj).forEach((key, indexs) => {

            lengthObj[key].forEach((length, index) => {
                console.log(length, colLengthArr[indexs],key,   this.width)
                const geometry = new THREE.PlaneGeometry(colLengthArr[indexs],length);
                const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
                const plane = new THREE.Mesh(geometry, material);
                plane.position.x = - this.width / 2 + Number(key) + colLengthArr[indexs] / 2
                plane.position.y = - this.height / 2 + length/2 + boxObj[key][index]
                // this.sence.add(plane);
                winArr.boxGroup.add(plane)
            })

            
        })

        this.sence.add(winArr.boxGroup)

        this.sence.add(group)
    }
}