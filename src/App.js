import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [mode, setmode] = useState(true)
  const [mirror, setMirror] = useState(true)
  const [result, setResult] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')
  const [color, setColor] = useState('#FFFFFF')
  const constraints = {
    audio: false,
    video: {
      width: 720,
      height: 680,
      facingMode: (mode ? 'user' : 'environment')
    }
  }
  const root = document.querySelector(':root')
  root.style.setProperty('--frame',color)

  function camStart(prop){
    navigator.mediaDevices.getUserMedia(prop)
    .then(stream =>{
      const video = document.querySelector('#frame')
      const canvas = document.querySelector('#canvas')
      if('srcObject' in video) video.srcObject = stream
      else video.src = window.URL.createObjectURL(stream)
      video.addEventListener('loadedmetadata', ()=> video.play())
      video.addEventListener('canplay', ()=>{
        canvas.setAttribute('width', 720)
        canvas.setAttribute('height', 750)
      })
    })
    .catch(err => console.log(err.name + ':' + err.message))
  }

  useEffect(()=>{
    camStart(constraints)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  function refresh(){
    camStart(constraints)
  }

  function changeCam(){
    setmode(prevMode => !prevMode)
    camStart(constraints)
  }

  function mirrorCam(){
    setMirror(prevState => !prevState)
    document.querySelector('#frame').classList.toggle('mirror')
  }

  function showColor(){
    document.querySelector('.colors').classList.toggle('visibiliy')
  }

  function changeColor(e){
    document.querySelector('.colors').classList.remove('visibiliy')
    const color = document.querySelector('.fa-swatchbook')
    const colorPad = document.querySelector('.color')
    colorPad.style.background = '#FFF'
    if(e.target.id==='#FFFFFF') color.style.color = 'grey'
    else if(e.target.id==='gradient'){ 
      color.style.color = '#fff'
      color.style.transform = 'rotateZ(-45deg)'
      colorPad.style.background = 'linear-gradient(to right, #FFFF66, #f8037e, #036bd3)'
      colorPad.style.transform = 'rotateZ(45deg)'
    }
    else color.style.color = e.target.id
    setColor(e.target.id)
  }

  function capturePic(){
    setResult(prevState => !prevState)
    const video = document.querySelector('#frame')
    const canvas = document.querySelector('#canvas')
    const output = document.querySelector('#photo')
    
    // const width = video.videoWidth
    // const height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if(color==='gradient'){
      const my_gradient = ctx.createLinearGradient(0, 0, 720, 680)
      my_gradient.addColorStop(0, "#FFFF66")
      my_gradient.addColorStop(0.5, "#f8037e")
      my_gradient.addColorStop(1, "#036bd3")
      ctx.fillStyle = my_gradient
    }
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if(mirror){
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video,0,0, 600,680,35,35,650,750)
    const imageData = canvas.toDataURL('image/jpeg', 1.0)
    output.setAttribute('src', imageData)
    setPhotoUrl(imageData)

    video.classList.add('hidden')
    output.classList.add('visible')
  }

  function retake(){
    setResult(prevState => !prevState)
    const video = document.querySelector('#frame')
    const canvas = document.querySelector('#canvas')
    const output = document.querySelector('#photo')
    canvas.setAttribute('width', 720)
    canvas.setAttribute('height', 750)
    video.classList.remove('hidden')
    output.classList.remove('visible')
  }

  return (
    <div className='App'>
      <div className='wrapper'><video id='frame'></video></div>
      <canvas id='canvas'>
      </canvas>
      <img id='photo' alt='Polaroid'/>
      <div className='btn-container'>
        { !result ? 
          <button onClick={refresh} className='refresh'>
            <i className="fas fa-redo-alt"></i>
          </button>
          : 
          <button className='retake' onClick={retake}>
            <i className="fas fa-redo-alt"></i>
          </button>
        }
        { !result && <button onClick={changeCam} className='flip'><i className="fas fa-mobile-alt"></i></button>}
        { !result ? 
          <button onClick={capturePic} className='capture'>
            <i className="fas fa-camera"></i>
          </button>
          : 
          <a href={photoUrl} className='save' download>
            <i className="fas fa-save"></i>
          </a> 
        }
        { !result && <button onClick={mirrorCam} className='mirror'><i className="fas fa-grip-lines-vertical"></i></button>}
        { !result && <button onClick={showColor} className='color'><i className="fas fa-swatchbook"></i></button>}
        <div className='colors'>
          <span onClick={changeColor} id='#FFFFFF' className='white'></span>
          <span onClick={changeColor} id='#9932CC' className='purple'></span>
          <span onClick={changeColor} id='#FF69B4' className='pink'></span>
          <span onClick={changeColor} id='#FF6347' className='orange'></span>
          <span onClick={changeColor} id='#1E90FF' className='blue'></span>
          <span onClick={changeColor} id='gradient' className='gradient'></span>
        </div>
      </div>
    </div>
  )
}

export default App
