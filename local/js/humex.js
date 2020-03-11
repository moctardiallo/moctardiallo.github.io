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
  var canvas = document.createElement("canvas");
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
  const bodyPartsCoordinates = getBodyPartsCoordinates(pose['keypoints'], ['rightArm'])
  drawBodyPart(ctx, bodyPartsCoordinates)

  var dataurl = canvas.toDataURL("image/png");
  img.src = dataurl;
}

// bodyParts: a list of body parts: ['rightArm', ...]
// returns an object of bodyPartsPoints corresponding to body parts: 
// {
//   'rightArm:' ['rightShoulder', 'rightElbow'], //e.g.: rigthShoulder is a point.
//   ...
// }
function getBodyPartsPoints(bodyParts){
  const bodyPartsPoints = {
    'rightArm': ['rightShoulder', 'rightElbow']
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

// bodyPartsCoordinates: a list of 4 points corresponding to the coordinates of a body part
// draws a segment between those two points
function drawBodyPart(ctx, bodyPartsCoordinates) {
  const x0 = bodyPartsCoordinates['rightArm'][0]
  const y0 = bodyPartsCoordinates['rightArm'][1]
  const x1 = bodyPartsCoordinates['rightArm'][2]
  const y1 = bodyPartsCoordinates['rightArm'][3]
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineWidth = 3;

  // set line color
  ctx.strokeStyle = '#0000ff';
  ctx.stroke();
}