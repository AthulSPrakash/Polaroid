import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [mode, setmode] = useState(true)
  const [mirror, setMirror] = useState(true)
  const [result, setResult] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')
  const [color, setColor] = useState('#ffffff')
  const constraints = {
    audio: false,
    video: {
      width: 720,
      height: 750,
      facingMode: (mode ? 'user' : 'environment')
    }
  }

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
    console.log(mirror)
  }

  function capturePic(){
    setResult(prevState => !prevState)
    const wrapper = document.querySelector('.wrapper')
    const video = document.querySelector('#frame')
    const canvas = document.querySelector('#canvas')
    const output = document.querySelector('#photo')
    
    const width = video.videoWidth
    const height = video.videoHeight
    const ctx = canvas.getContext('2d')
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

    wrapper.classList.add('hidden')
    output.classList.add('visible')
  }

  function retake(){
    setResult(prevState => !prevState)
    const wrapper = document.querySelector('.wrapper')
    const video = document.querySelector('#frame')
    const canvas = document.querySelector('#canvas')
    const output = document.querySelector('#photo')
    canvas.setAttribute('width', 720)
    canvas.setAttribute('height', 750)
    wrapper.classList.remove('hidden')
    output.classList.remove('visible')
  }

  return (
    <div className='App'>
      <div className='wrapper'>
        <video id='frame'></video>
      </div>
      <canvas id='canvas'>
      </canvas>
      <img id='photo' alt='Picture taken'/>
      <div className='btn-container'>
        { !result ? <button onClick={refresh} className='refresh'>refresh</button>
          : <button onClick={retake}>retake</button>
        }
        { !result ? <button onClick={capturePic} className='capture'>capture</button>
          : <a href={photoUrl} className='save' download>save</a> 
        }
        { !result && <button onClick={changeCam} className='flip'>flip</button>}
        { !result ? <button onClick={mirrorCam} className='mirror'>mirror</button>
          : <button className='share'>share</button>
        }
        { !result && <button className='color'>color</button>}
      </div>
    </div>
  )
}

export default App
