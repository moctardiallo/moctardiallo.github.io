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
    // alert(this.src);  // blob url
    // update width and height ...
    var canvas = document.createElement("canvas");
        //var canvas = $("<canvas>", {"id":"testing"})[0];
        var img = document.getElementById('your_image');  // $('img')[0]
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 400;
        var MAX_HEIGHT = 300;
        var width = img.width;
        var height = img.height;

        // if (width > height) {
        //   if (width > MAX_WIDTH) {
        //     height *= MAX_WIDTH / width;
        //     width = MAX_WIDTH;
        //   }
        // } else {
        //   if (height > MAX_HEIGHT) {
        //     width *= MAX_HEIGHT / height;
        //     height = MAX_HEIGHT;
        //   }
        // }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
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