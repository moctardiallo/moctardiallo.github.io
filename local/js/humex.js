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
  const measure = getMeasure(pose['keypoints'], 'rightArm')
  drawMeasure(ctx, measure)

  var dataurl = canvas.toDataURL("image/png");
  img.src = dataurl;
}

function getPoints(bodyPart){
  const body = {
    'rightArm': ['rightShoulder', 'rightElbow']
  }
  return body[bodyPart]
}

function getMeasure(keypoints, bodyPart){
  const bodyPartPoints = getPoints(bodyPart)
  let x0, y0, x1, y1;
  for (p of keypoints) {
    if (p['part'] == bodyPartPoints[0]){
      x0 = p['position']['x']
      y0 = p['position']['y']
    }
    if (p['part'] == bodyPartPoints[1]){
      x1 = p['position']['x']
      y1 = p['position']['y']
    }

  }
  return [x0, y0, x1, y1]
}

function drawMeasure(ctx, measure) {
  ctx.beginPath();
  ctx.moveTo(measure[0], measure[1]);
  ctx.lineTo(measure[2], measure[3]);
  ctx.lineWidth = 3;

  // set line color
  ctx.strokeStyle = '#0000ff';
  ctx.stroke();
}