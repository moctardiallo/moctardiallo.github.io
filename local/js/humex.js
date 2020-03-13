let hi;

window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('img');  // $('img')[0]
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            img.onload = imageIsLoaded;
        }
    });
  });
  
async function imageIsLoaded() { 
  // var canvas = document.createElement("canvas");
  let canvas = document.getElementById('my_canvas')
  var img = document.getElementById('your_image');
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);
 
  const net = await posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: { width: 640, height: 480 },
    multiplier: 0.75
  });

  const pose = await net.estimateSinglePose(img, {
    flipHorizontal: false
  });
  let y0_hi = pose['keypoints'][0]['position']['y']
  let y1_hi = pose['keypoints'][16]['position']['y']
  hi = Math.abs(y0_hi - y1_hi);
  const bodyPartsCoordinates = getBodyPartsCoordinates(pose['keypoints'], ['rightArm', 'leftThigh'])
  const measures = getMeasures(bodyPartsCoordinates)
  drawBodyParts(bodyPartsCoordinates, measures)

  var dataurl = canvas.toDataURL("image/png");
  img.src = dataurl;
}

// coordinates: {
//   "bodyPart":[x0, y0, x1, y1],
//    ... 
// }
// returns {
//   "bodyPart": 170cm,
//   ...
// }

// coordinates: [x0, y0, x1, y1] of two points in the canvas
// returns distance between those two points 
function distance(coordinates){
  // hr/hi == bpr/bpi
  let hr = document.getElementById("your_height").value;
  let a = coordinates[0] - coordinates[2]
  let b = coordinates[1] - coordinates[3]
  let bpi = Math.sqrt(a*a + b*b)
  let bpr = Math.round(bpi * hr/hi)
  return bpr;
}

function getMeasures(bodyPartsCoordinates){
  let measures = {}
  for (bp in bodyPartsCoordinates){
    measures[bp] = distance(bodyPartsCoordinates[bp])
  }
  // return {
  //   "rightArm": 30,
  //   "leftThigh":25
  // }
  return measures
}

// bodyParts: a list of body parts: ['rightArm', ...]
// returns an object of bodyPartsPoints corresponding to body parts: 
// {
//   'rightArm:' ['rightShoulder', 'rightElbow'], //e.g.: rigthShoulder is a point.
//   ...
// }
function getBodyPartsPoints(bodyParts){
  const bodyPartsPoints = {
    'rightArm': ['rightShoulder', 'rightElbow'],
    'leftThigh': ['leftHip', 'leftKnee']
  }
  return Object.assign({}, ...bodyParts.map(bp => bodyPartsPoints.hasOwnProperty(bp) ? ({[bp]: bodyPartsPoints[bp]}) : null));
}

// keypoints: from posenet inference: [{
//                                       'part': 'rightShoulder', // == bodyPoint
//                                       'position': {
//                                         'x': 130,
//                                         'y': 113,
//                                       }
//                                     },
//                                     ...
//                                     ]
// bodyParts: a list of body parts: ['rightArm', ...]
// returns a list of coordinates corresponding to each body part specified in bodyParts list 
function getBodyPartsCoordinates(keypoints, bodyParts){
  const bodyPartsPoints = getBodyPartsPoints(bodyParts)
  let x0, y0, x1, y1; // coordinates
  let bodyPartsCoordinates = {}
  for (bp of bodyParts){
    for (p of keypoints) {
      if (p['part'] == bodyPartsPoints[bp][0]){
        x0 = p['position']['x']
        y0 = p['position']['y']
      }
      if (p['part'] == bodyPartsPoints[bp][1]){
        x1 = p['position']['x']
        y1 = p['position']['y']
      }
    }
    bodyPartsCoordinates[bp] = [x0, y0, x1, y1]
  }
  return bodyPartsCoordinates
}

// bodyPartsCoordinates: a {bodyPart: [list of 4 coordinates]} corresponding to the coordinates of a body parts
// draws a segment between those two points
function drawBodyParts(bodyPartsCoordinates, measures) {
  const ctx = document.getElementById('my_canvas').getContext('2d')
  for (bp in bodyPartsCoordinates){
    const x0 = bodyPartsCoordinates[bp][0]
    const y0 = bodyPartsCoordinates[bp][1]
    const x1 = bodyPartsCoordinates[bp][2]
    const y1 = bodyPartsCoordinates[bp][3]
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = 3;
    const mx = Math.abs(x0+x1)/2 + 10
    const my = Math.abs(y0+y1)/2
    ctx.font = "30px Georgia";
    ctx.fillStyle = "red";
    ctx.fillText(measures[bp] + " cm", mx, my)
  
    // set line colorMath.abs(y0+y1)/2
    ctx.strokeStyle = '#0000ff';
    ctx.stroke();
  }
}