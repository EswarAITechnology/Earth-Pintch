/* =========================================================
   FRIDAY HOLOGRAPHIC EARTH
   Hand Gesture + Touchscreen Zoom
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const stage =
  document.getElementById("stage");

const video =
  document.getElementById("video");

const handCanvas =
  document.getElementById("hand-canvas");

const handCtx =
  handCanvas.getContext("2d");

const earthCanvas =
  document.getElementById("earth-canvas");

const gestureStatus =
  document.getElementById("gesture-status");

const zoomValue =
  document.getElementById("zoom-value");

const controlValue =
  document.getElementById("control-value");

const handState =
  document.getElementById("hand-state");

const touchState =
  document.getElementById("touch-state");

const touchHint =
  document.getElementById("touch-hint");

const messages =
  document.getElementById("messages");

const input =
  document.getElementById("user-input");

const sendBtn =
  document.getElementById("send-btn");

const micBtn =
  document.getElementById("mic-btn");


/* =========================================================
   CREATE HOLOGRAPHIC STARS
   ========================================================= */

const starsContainer =
  document.getElementById("stars");

for (
  let i = 0;
  i < 140;
  i++
) {

  const star =
    document.createElement("div");

  star.className =
    "star";

  star.style.left =
    Math.random() * 100 + "%";

  star.style.top =
    Math.random() * 100 + "%";

  star.style.animationDelay =
    Math.random() * 2 + "s";

  star.style.opacity =
    Math.random();

  starsContainer.appendChild(
    star
  );
}


/* =========================================================
   THREE.JS
   ========================================================= */

const scene =
  new THREE.Scene();


const camera =
  new THREE.PerspectiveCamera(
    42,
    1,
    0.1,
    1000
  );


/* =========================================================
   ZOOM SYSTEM
   ========================================================= */

/*
 * IMPORTANT:
 *
 * Smaller camera Z =
 * Earth appears CLOSER
 *
 * Larger camera Z =
 * Earth appears FARTHER
 *
 * Therefore:
 *
 * zoom IN  -> decrease Z
 * zoom OUT -> increase Z
 */

const MIN_ZOOM = 1.05;
const MAX_ZOOM = 14.0;


/*
 * Start position
 */

let currentZoom = 3.4;

let targetZoom = 3.4;


/*
 * Rotation
 */

let currentRotX = 0.18;
let targetRotX = 0.18;

let currentRotY = 0;
let targetRotY = 0;


/*
 * Control states
 */

let handZooming = false;

let touchZooming = false;


/* =========================================================
   RENDERER
   ========================================================= */

const renderer =
  new THREE.WebGLRenderer({

    canvas: earthCanvas,

    antialias: true,

    alpha: true,

    powerPreference:
      "high-performance"

  });


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio || 1,
    2
  )
);

renderer.setClearColor(
  0x000000,
  0
);


/* =========================================================
   LIGHTING
   ========================================================= */

scene.add(
  new THREE.AmbientLight(
    0x18263c,
    1.3
  )
);


const sun =
  new THREE.DirectionalLight(
    0xffffff,
    2.0
  );


sun.position.set(
  5,
  3,
  5
);


scene.add(sun);


/* =========================================================
   STARS
   ========================================================= */

const starGeometry =
  new THREE.BufferGeometry();

const starCount = 2200;

const positions =
  new Float32Array(
    starCount * 3
  );


for (
  let i = 0;
  i < starCount * 3;
  i++
) {

  positions[i] =
    (Math.random() - 0.5) * 180;

}


starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    positions,
    3
  )
);


const starPoints =
  new THREE.Points(

    starGeometry,

    new THREE.PointsMaterial({

      color: 0x8eefff,

      size: 0.11,

      transparent: true,

      opacity: 0.8

    })

  );


scene.add(starPoints);


/* =========================================================
   EARTH
   ========================================================= */

const earthMaterial =
  new THREE.MeshPhongMaterial({

    color: 0x2266aa,

    shininess: 25,

    specular: 0x446677

  });


const earth =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      1,
      96,
      96
    ),

    earthMaterial

  );


scene.add(earth);


/* =========================================================
   ATMOSPHERE
   ========================================================= */

const atmosphereMaterial =
  new THREE.MeshBasicMaterial({

    color: 0x00aaff,

    transparent: true,

    opacity: 0.16,

    side: THREE.BackSide

  });


const atmosphere =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      1.045,
      64,
      64
    ),

    atmosphereMaterial

  );


scene.add(atmosphere);


/* =========================================================
   OUTER HOLOGRAPHIC RINGS
   ========================================================= */

function createRing(
  radius,
  rotationX,
  rotationY,
  opacity
) {

  const geometry =
    new THREE.TorusGeometry(
      radius,
      0.008,
      8,
      128
    );


  const material =
    new THREE.MeshBasicMaterial({

      color: 0x00eaff,

      transparent: true,

      opacity: opacity

    });


  const ring =
    new THREE.Mesh(
      geometry,
      material
    );


  ring.rotation.x =
    rotationX;

  ring.rotation.y =
    rotationY;


  scene.add(ring);


  return ring;
}


const ring1 =
  createRing(
    1.25,
    Math.PI / 2,
    0,
    0.45
  );


const ring2 =
  createRing(
    1.34,
    0.4,
    0.7,
    0.2
  );


const ring3 =
  createRing(
    1.42,
    -0.5,
    1.1,
    0.12
  );


/* =========================================================
   EARTH TEXTURE
   ========================================================= */

const textureLoader =
  new THREE.TextureLoader();


textureLoader.load(

  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",

  function(texture) {

    texture.anisotropy =
      renderer.capabilities
        .getMaxAnisotropy();

    earthMaterial.map =
      texture;

    earthMaterial.needsUpdate =
      true;

  },

  undefined,

  function() {

    console.log(
      "Earth texture unavailable. Using fallback."
    );

  }

);


/* =========================================================
   RESIZE
   ========================================================= */

function resize() {

  const width =
    stage.clientWidth;

  const height =
    stage.clientHeight;


  if (
    width <= 0 ||
    height <= 0
  ) {
    return;
  }


  camera.aspect =
    width / height;


  camera.updateProjectionMatrix();


  renderer.setSize(
    width,
    height,
    false
  );


  handCanvas.width =
    width;

  handCanvas.height =
    height;

}


window.addEventListener(
  "resize",
  resize
);


window.addEventListener(
  "orientationchange",
  function() {

    setTimeout(
      resize,
      200
    );

  }
);


resize();


/* =========================================================
   ZOOM CLAMP
   ========================================================= */

function clampZoom(
  value
) {

  return Math.max(
    MIN_ZOOM,
    Math.min(
      MAX_ZOOM,
      value
    )
  );

}


/* =========================================================
   SET ZOOM
   ========================================================= */

function setZoom(
  value
) {

  targetZoom =
    clampZoom(value);

}


/* =========================================================
   TOUCHSCREEN ZOOM
   ========================================================= */

/*
 * We use the distance between
 * two fingers.
 *
 * Fingers APART:
 * distance increases
 * camera Z decreases
 * = ZOOM IN
 *
 * Fingers TOGETHER:
 * distance decreases
 * camera Z increases
 * = ZOOM OUT
 */


let previousTouchDistance =
  null;


function touchDistance(
  touch1,
  touch2
) {

  const dx =
    touch2.clientX -
    touch1.clientX;

  const dy =
    touch2.clientY -
    touch1.clientY;


  return Math.sqrt(
    dx * dx +
    dy * dy
  );

}


/* =========================================================
   TOUCH START
   ========================================================= */

earthCanvas.addEventListener(

  "touchstart",

  function(event) {

    if (
      event.touches.length !== 2
    ) {
      return;
    }


    event.preventDefault();


    previousTouchDistance =
      touchDistance(
        event.touches[0],
        event.touches[1]
      );


    touchZooming =
      true;

    handZooming =
      false;


    gestureStatus.textContent =
      "TOUCH ZOOM";


    controlValue.textContent =
      "TOUCH";


    touchState.textContent =
      "ZOOMING";


    touchHint.classList.add(
      "hidden"
    );

  },

  {
    passive: false
  }

);


/* =========================================================
   TOUCH MOVE
   ========================================================= */

earthCanvas.addEventListener(

  "touchmove",

  function(event) {

    if (
      event.touches.length !== 2 ||
      !touchZooming
    ) {
      return;
    }


    event.preventDefault();


    const currentDistance =
      touchDistance(
        event.touches[0],
        event.touches[1]
      );


    if (
      previousTouchDistance === null
    ) {

      previousTouchDistance =
        currentDistance;

      return;

    }


    const delta =
      currentDistance -
      previousTouchDistance;


    /*
     * This is the critical part.
     *
     * Fingers apart:
     * delta POSITIVE
     * targetZoom goes DOWN
     * Earth gets closer.
     *
     * Fingers together:
     * delta NEGATIVE
     * targetZoom goes UP
     * Earth gets farther.
     */


    const sensitivity =
      0.018;


    setZoom(
      targetZoom -
      delta * sensitivity
    );


    previousTouchDistance =
      currentDistance;


    if (delta > 0) {

      gestureStatus.textContent =
        "ZOOM IN";

    }

    else if (delta < 0) {

      gestureStatus.textContent =
        "ZOOM OUT";

    }


    zoomValue.textContent =
      currentZoom.toFixed(2) +
      "x";

  },

  {
    passive: false
  }

);


/* =========================================================
   TOUCH END
   ========================================================= */

function stopTouchZoom() {

  previousTouchDistance =
    null;

  touchZooming =
    false;


  touchState.textContent =
    "READY";


  gestureStatus.textContent =
    "READY";


  controlValue.textContent =
    "IDLE";

}


earthCanvas.addEventListener(
  "touchend",
  stopTouchZoom,
  {
    passive: false
  }
);


earthCanvas.addEventListener(
  "touchcancel",
  stopTouchZoom,
  {
    passive: false
  }
);


/* =========================================================
   HAND TRACKING
   ========================================================= */

let previousPinchDistance =
  null;


/*
 * Hand pinch thresholds.
 *
 * These are deliberately more
 * forgiving than the previous version.
 */

const HAND_PINCH_START =
  0.12;

const HAND_PINCH_END =
  0.18;


/* =========================================================
   HAND RESULTS
   ========================================================= */

function onHandResults(
  results
) {

  handCtx.clearRect(
    0,
    0,
    handCanvas.width,
    handCanvas.height
  );


  if (
    !results.multiHandLandmarks ||
    results.multiHandLandmarks.length === 0
  ) {

    handZooming =
      false;

    previousPinchDistance =
      null;


    handState.textContent =
      "SEARCHING";


    if (!touchZooming) {

      gestureStatus.textContent =
        "READY";

      controlValue.textContent =
        "IDLE";

    }


    return;

  }


  const landmarks =
    results.multiHandLandmarks[0];


  handState.textContent =
    "TRACKED";


  /*
   * Draw hand skeleton
   */

  if (
    typeof drawConnectors ===
    "function"
  ) {

    drawConnectors(
      handCtx,
      landmarks,
      HAND_CONNECTIONS,
      {
        color: "#00eaff",
        lineWidth: 2
      }
    );


    drawLandmarks(
      handCtx,
      landmarks,
      {
        color: "#00ffcc",
        lineWidth: 1,
        radius: 3
      }
    );

  }


  /*
   * Thumb
   */

  const thumb =
    landmarks[4];


  /*
   * Index finger
   */

  const index =
    landmarks[8];


  /*
   * Distance between thumb
   * and index finger.
   */

  const distance =
    Math.hypot(
      thumb.x - index.x,
      thumb.y - index.y
    );


  /*
   * START PINCH
   */

  if (
    distance <
    HAND_PINCH_START
  ) {

    if (
      !handZooming
    ) {

      handZooming =
        true;


      previousPinchDistance =
        distance;


      gestureStatus.textContent =
        "HAND ZOOM";


      controlValue.textContent =
        "HAND";

    }


    /*
     * Calculate movement.
     */

    if (
      previousPinchDistance !==
      null &&
      !touchZooming
    ) {

      const delta =
        distance -
        previousPinchDistance;


      /*
       * Fingers move apart:
       *
       * distance increases
       * delta positive
       * zoom IN
       *
       * Fingers move together:
       *
       * distance decreases
       * delta negative
       * zoom OUT
       */


      const sensitivity =
        16;


      setZoom(
        targetZoom -
        delta * sensitivity
      );


      if (delta > 0) {

        gestureStatus.textContent =
          "HAND ZOOM IN";

      }

      else if (
        delta < 0
      ) {

        gestureStatus.textContent =
          "HAND ZOOM OUT";

      }


      previousPinchDistance =
        distance;

    }


  }


  /*
   * END PINCH
   */

  else if (
    distance >
    HAND_PINCH_END
  ) {

    handZooming =
      false;


    previousPinchDistance =
      null;


    if (!touchZooming) {

      gestureStatus.textContent =
        "READY";

      controlValue.textContent =
        "HAND";

    }

  }


  /*
   * HAND ROTATION
   *
   * Palm position controls
   * Earth rotation.
   */

  if (!touchZooming) {

    const wrist =
      landmarks[0];


    const palmX =
      wrist.x;


    const palmY =
      wrist.y;


    targetRotY =
      (0.5 - palmX) *
      2.2;


    targetRotX =
      (palmY - 0.45) *
      1.7;

  }

}


/* =========================================================
   MEDIAPIPE
   ========================================================= */

try {

  const hands =
    new Hands({

      locateFile:
        function(file) {

          return (
            "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" +
            file
          );

        }

    });


  hands.setOptions({

    maxNumHands: 1,

    modelComplexity: 1,

    minDetectionConfidence: 0.65,

    minTrackingConfidence: 0.55

  });


  hands.onResults(
    onHandResults
  );


  const cameraFeed =
    new Camera(
      video,
      {

        width: 640,

        height: 480,

        onFrame:
          async function() {

            await hands.send({
              image: video
            });

          }

      }
    );


  cameraFeed.start()

    .catch(
      function(error) {

        console.error(
          error
        );


        gestureStatus.textContent =
          "TOUCH MODE";


        handState.textContent =
          "CAMERA OFF";


        addMessage(
          "Camera unavailable. Touchscreen pinch zoom remains active.",
          "system"
        );

      }
    );


}

catch (error) {

  console.error(
    "MediaPipe error:",
    error
  );


  handState.textContent =
    "UNAVAILABLE";


  gestureStatus.textContent =
    "TOUCH MODE";

}


/* =========================================================
   THREE.JS ANIMATION
   ========================================================= */

let lastFrame =
  performance.now();


function animate(
  time
) {

  requestAnimationFrame(
    animate
  );


  /*
   * Very smooth camera zoom.
   */

  currentZoom +=
    (
      targetZoom -
      currentZoom
    ) * 0.12;


  /*
   * Smooth rotation.
   */

  currentRotX +=
    (
      targetRotX -
      currentRotX
    ) * 0.08;


  currentRotY +=
    (
      targetRotY -
      currentRotY
    ) * 0.08;


  /*
   * Camera.
   */

  camera.position.z =
    currentZoom;


  /*
   * Earth.
   */

  earth.rotation.x =
    currentRotX;


  earth.rotation.y =
    currentRotY;


  atmosphere.rotation.x =
    currentRotX;


  atmosphere.rotation.y =
    currentRotY;


  /*
   * Holographic rings.
   */

  ring1.rotation.z +=
    0.0015;


  ring2.rotation.z -=
    0.001;


  ring3.rotation.z +=
    0.0007;


  /*
   * Background stars.
   */

  starPoints.rotation.y +=
    0.00015;


  /*
   * Slowly rotate Earth
   * when there is no active
   * hand rotation.
   */

  if (
    !handZooming &&
    !touchZooming
  ) {

    targetRotY +=
      0.0008;

  }


  /*
   * HUD zoom display.
   */

  zoomValue.textContent =
    currentZoom.toFixed(2) +
    "x";


  /*
   * Render.
   */

  renderer.render(
    scene,
    camera
  );


  lastFrame =
    time;

}


requestAnimationFrame(
  animate
);


/* =========================================================
   CHAT
   ========================================================= */

function addMessage(
  text,
  type = "friday"
) {

  const message =
    document.createElement(
      "div"
    );


  message.className =
    "message " +
    type;


  message.textContent =
    text;


  messages.appendChild(
    message
  );


  messages.scrollTop =
    messages.scrollHeight;

}


/* =========================================================
   SPEECH
   ========================================================= */

function speak(
  text
) {

  if (
    !window.speechSynthesis
  ) {
    return;
  }


  speechSynthesis.cancel();


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  utterance.lang =
    "en-IN";


  utterance.rate =
    1.05;


  utterance.pitch =
    1.1;


  speechSynthesis.speak(
    utterance
  );

}


/* =========================================================
   CHAT API
   ========================================================= */

/*
 * IMPORTANT:
 *
 * Do NOT put a real OpenRouter
 * secret key in GitHub Pages.
 *
 * Connect this function to your
 * Flask/Render backend.
 */

const BACKEND_URL =
  "https://YOUR-RENDER-BACKEND.onrender.com/api/chat";


const conversation = [

  {
    role: "system",

    content:
      "You are FRIDAY, a concise futuristic AI assistant. Be helpful, intelligent and slightly witty."
  }

];


async function askAI(
  text
) {

  conversation.push({

    role: "user",

    content: text

  });


  const response =
    await fetch(
      BACKEND_URL,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify({

            messages:
              conversation

          })

      }
    );


  if (
    !response.ok
  ) {

    throw new Error(
      "Backend error"
    );

  }


  const data =
    await response.json();


  const reply =
    data.reply ||
    data.message ||
    "I couldn't generate a response.";


  conversation.push({

    role: "assistant",

    content: reply

  });


  return reply;

}


/* =========================================================
   SEND MESSAGE
   ========================================================= */

async function sendMessage() {

  const text =
    input.value.trim();


  if (!text) {
    return;
  }


  addMessage(
    text,
    "user"
  );


  input.value =
    "";


  sendBtn.disabled =
    true;


  addMessage(
    "Processing...",
    "system"
  );


  try {

    const reply =
      await askAI(text);


    const systemMessages =
      messages.querySelectorAll(
        ".message.system"
      );


    const last =
      systemMessages[
        systemMessages.length - 1
      ];


    if (last) {
      last.remove();
    }


    addMessage(
      reply,
      "friday"
    );


    speak(reply);

  }

  catch (error) {

    console.error(
      error
    );


    const systemMessages =
      messages.querySelectorAll(
        ".message.system"
      );


    const last =
      systemMessages[
        systemMessages.length - 1
      ];


    if (last) {
      last.remove();
    }


    addMessage(
      "FRIDAY backend is unavailable.",
      "system"
    );

  }


  sendBtn.disabled =
    false;

}


sendBtn.addEventListener(
  "click",
  sendMessage
);


input.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Enter"
    ) {

      sendMessage();

    }

  }
);


/* =========================================================
   VOICE INPUT
   ========================================================= */

if (
  "SpeechRecognition" in window ||
  "webkitSpeechRecognition" in window
) {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  const recognition =
    new SpeechRecognition();


  recognition.lang =
    "en-IN";


  recognition.continuous =
    false;


  recognition.interimResults =
    false;


  recognition.onstart =
    function() {

      micBtn.classList.add(
        "active"
      );

      addMessage(
        "Listening...",
        "system"
      );

    };


  recognition.onresult =
    function(event) {

      input.value =
        event
          .results[0][0]
          .transcript;


      sendMessage();

    };


  recognition.onerror =
    function() {

      addMessage(
        "Voice input failed.",
        "system"
      );

    };


  recognition.onend =
    function() {

      micBtn.classList.remove(
        "active"
      );

    };


  micBtn.addEventListener(
    "click",
    function() {

      if (
        micBtn.classList.contains(
          "active"
        )
      ) {

        recognition.stop();

      }

      else {

        recognition.start();

      }

    }
  );

}

else {

  micBtn.disabled =
    true;

}


/* =========================================================
   STARTUP
   ========================================================= */

setTimeout(
  function() {

    speak(
      "Friday online. Holographic Earth interface ready."
    );

  },
  900
);