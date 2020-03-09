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
    ctx.beginPath();
    ctx.moveTo(110, 250);
    ctx.lineTo(130, 130);
    ctx.lineWidth = 3;

    // set line color
    ctx.strokeStyle = '#0000ff';
    ctx.stroke();

    var dataurl = canvas.toDataURL("image/png");
    img.src = dataurl;
  }