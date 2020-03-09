window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('img');  // $('img')[0]
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            img.onload = imageIsLoaded;
        }
    });
  });
  
  function imageIsLoaded() { 
    var canvas = document.createElement("canvas");
    var img = document.getElementById('your_image');
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    pose = [
      {
        'part': "leftShoulder",
        'position': {
          'x': 110,
          'y': 250
        }
      },
      {
        'part': "leftElbow",
        'position': {
          'x': 130,
          'y': 130
        }
      }
    ]
    drawPose(ctx, pose)

    var dataurl = canvas.toDataURL("image/png");
    img.src = dataurl;
  }

  function drawPose(ctx, pose) {
    ctx.beginPath();
    ctx.moveTo(pose[0]['position']['x'], pose[0]['position']['y']);
    ctx.lineTo(pose[1]['position']['x'], pose[1]['position']['y']);
    ctx.lineWidth = 3;

    // set line color
    ctx.strokeStyle = '#0000ff';
    ctx.stroke();
  }