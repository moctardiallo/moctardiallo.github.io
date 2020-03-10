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
  drawMeasure(ctx, pose['keypoints'])

  var dataurl = canvas.toDataURL("image/png");
  img.src = dataurl;
}

function drawMeasure(ctx, keypoints) {
  let x0, y0, x1, y1;
  for (p of keypoints) {
    if (p['part'] == 'rightShoulder'){
      x0 = p['position']['x']
      y0 = p['position']['y']
    }
    if (p['part'] == 'rightElbow'){
      x1 = p['position']['x']
      y1 = p['position']['y']
    }

    if (p['part'] == 'leftWrist'){
      x2 = p['position']['x']
      y2 = p['position']['y']
    }
    if (p['part'] == 'leftKnee'){
      x3 = p['position']['x']
      y3 = p['position']['y']
    }

  }
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.moveTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineWidth = 3;

  // set line color
  ctx.strokeStyle = '#0000ff';
  ctx.stroke();
}