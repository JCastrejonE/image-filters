// R,G,B = (R + G + B) / 3
function gray1(data) {
  for (var i = 0; i < data.length; i+= 4) {
    gray = parseInt((data[i] + data[i+1] + data[i+2]) / 3)
    data[i] = gray;   // Red channel
    data[i+1] = gray; // Green channel
    data[i+2] = gray; // Blue channel
  }
}

// R,G,B = (R*0.3 + G*0.59 + B*0.11) / 3
function gray2(data) {
  for (var i = 0; i < data.length; i+= 4) {
    gray = (data[i]*0.3 + data[i+1]*0.59 + data[i+2]*0.11)
    data[i] = gray;   // Red channel
    data[i+1] = gray; // Green channel
    data[i+2] = gray; // Blue channel
  }
}

// (R*0.2126 + G*0.7152 + B*0.0722) / 3
function gray3(data) {
  for (var i = 0; i < data.length; i+= 4) {
    gray = (data[i]*0.2126 + data[i+1]*0.7152 + data[i+2]*0.0722)
    data[i] = gray;   // Red channel
    data[i+1] = gray; // Green channel
    data[i+2] = gray; // Blue channel
  }
}

// R,G,B = (Max(R,G,B) + Min(R,G,B)) / 2
function gray4(data) {
  for (var i = 0; i < data.length; i+= 4) {
    gray = parseInt((Math.max(data[i],data[i+1],data[i+2]) +  Math.min(data[i],data[i+1],data[i+2]))/ 2)
    data[i] = gray;   // Red channel
    data[i+1] = gray; // Green channel
    data[i+2] = gray; // Blue channel
  }
}

// R,G,B = Max(R,G,B)
function gray5(data) {
  for (var i = 0; i < data.length; i+= 4) {
    gray = Math.max(data[i],data[i+1],data[i+2])
    data[i] = gray;   // Red channel
    data[i+1] = gray; // Green channel
    data[i+2] = gray; // Blue channel
  }
}

// R,G,B = Min(R,G,B)
function gray6(data) {
  for (var i = 0; i < data.length; i+= 4) {
    gray = Math.min(data[i],data[i+1],data[i+2])
    data[i] = gray;   // Red channel
    data[i+1] = gray; // Green channel
    data[i+2] = gray; // Blue channel
  }
}

// R,G,B = (R)
function gray7(data) {
  for (var i = 0; i < data.length; i+= 4) {
    gray = data[i];
    data[i] = gray;   // Red channel
    data[i+1] = gray; // Green channel
    data[i+2] = gray; // Blue channel
  }
}

// R,G,B = (G)
function gray8(data) {
  for (var i = 0; i < data.length; i+= 4) {
    gray = data[i+1];
    data[i] = gray;   // Red channel
    data[i+1] = gray; // Green channel
    data[i+2] = gray; // Blue channel
  }
}

// R,G,B = (B)
function gray9(data) {
  for (var i = 0; i < data.length; i+= 4) {
    gray = data[i+2];
    data[i] = gray;   // Red channel
    data[i+1] = gray; // Green channel
    data[i+2] = gray; // Blue channel
  }
}

// R,G,B = (R+k,G+k,B+k)
function brightness(data, value) {
  value = parseInt(value);
  if(value == 0)
    return;
  for (var i = 0; i < data.length; i+= 4) {
    // Add value and truncate
    data[i] = Math.min(Math.max(data[i] + value, 0), 255);     // Red channel
    data[i+1] = Math.min(Math.max(data[i+1] + value, 0), 255); // Green channel
    data[i+2] = Math.min(Math.max(data[i+2]+ value, 0), 255);  // Blue channel
  }
}

// Average of pixel's RGB value inside each mosaic when
// partitiong the image in [size] * [size] mosaics
function mosaic(imageData, size) {
  var mosaicWidth = parseInt(imageData.width*4/size);
  mosaicWidth += 4 - mosaicWidth % 4;
  var mosaicHeight = parseInt(imageData.height/size) + 1;

  // Iterate the mosaics
  for (var my = 0; my < size; my += 1) {
    for (var mx = 0; mx < size; mx += 1) {
      var r = 0, g = 0, b = 0;
      var pixels = 0;

      // Calculate the average rgb for every pixel inside the mosaic
      for (var y = my*mosaicHeight; y < (my+1)*mosaicHeight; y += 1) {
        if(y >= imageData.height)
          continue;
        for (var x = mx*mosaicWidth; x < (mx+1)*mosaicWidth; x += 4) {
          if(x >= imageData.width*4)
            continue;
          pixels++;
          r += imageData.data[x + (y*imageData.width*4)]
          g += imageData.data[x + (y*imageData.width*4) + 1]
          b += imageData.data[x + (y*imageData.width*4) + 2]
        }
      }
      r = r/pixels;
      g = g/pixels;
      b = b/pixels;

      // Color the image
      for (var y = my*mosaicHeight; y < (my+1)*mosaicHeight; y += 1) {
        if(y >= imageData.height)
          continue;
        for (var x = mx*mosaicWidth; x < (mx+1)*mosaicWidth; x += 4) {
          if(x >= imageData.width*4)
            continue;
          imageData.data[x + (y*imageData.width*4)] = r;
          imageData.data[x + (y*imageData.width*4) + 1] = g;
          imageData.data[x + (y*imageData.width*4) + 2] = b;
        }
      }
    }
  }
}

//
function highContrast(data) {
  gray4(data);
  for (var i = 0; i < data.length; i += 4) {
    // Note: after gray4() R = G = B
    if(data[i] > 127) {
      data[i] = 255;   // Red channel
      data[i+1] = 255; // Green channel
      data[i+2] = 255; // Blue channel
    } else {
      data[i] = 0;   // Red channel
      data[i+1] = 0; // Green channel
      data[i+2] = 0; // Blue channel
    }
  }
}

//
function highContrastInverse(data) {
  gray4(data);
  for (var i = 0; i < data.length; i += 4) {
    // Note: after gray4() R = G = B
    if(data[i] > 127) {
      data[i] = 0;   // Red channel
      data[i+1] = 0; // Green channel
      data[i+2] = 0; // Blue chan nel
    } else {
      data[i] = 255;   // Red channel
      data[i+1] = 255; // Green channel
      data[i+2] = 255; // Blue channel
    }
  }
}

//
function RGBComponents(data, rgb) {
  for (var i = 0; i < data.length; i += 4) {
    data[i] &= rgb.red;     // Red channel
    data[i+1] &= rgb.green; // Green channel
    data[i+2] &= rgb.blue;  // Blue channel
  }
}

//
function convolution(imageData, filter, factor=1.0, bias=0.0) {
  var result = new Array(imageData.data.length);
  // Apply the filter
  for (var x = 0; x < imageData.width*4; x += 4) {
    for (var y = 0; y < imageData.height; y++) {
      var r = 0, g = 0, b = 0;

      // Multiply every value of the filter with corresponding image pixel
      for (var fy = 0; fy < filter.length; fy++) {
        for (var fx = 0; fx < filter.length; fx++) {
          var posX = x - parseInt(filter.length/2) + parseInt(filter.length/2)*-3 + fx*3 + fx;
          var posY = y - parseInt(filter.length/2) + fy;
          // NoWrap
          posX = Math.min(Math.max(posX, 0), imageData.width*4 - 4);
          posY = Math.min(Math.max(posY, 0), imageData.height - 1);

          r += imageData.data[posX + (posY*imageData.width*4)] * filter[fy][fx];
          g += imageData.data[posX + (posY*imageData.width*4) + 1] * filter[fy][fx];
          b += imageData.data[posX + (posY*imageData.width*4) + 2] * filter[fy][fx];
        }
      }
      // Truncate values smaller than zero and larger than 255
      result[x + (y*imageData.width*4)] = Math.min(Math.max(parseInt(factor * r + bias), 0), 255);
      result[x + (y*imageData.width*4) + 1] = Math.min(Math.max(parseInt(factor * g + bias), 0), 255);
      result[x + (y*imageData.width*4) + 2] = Math.min(Math.max(parseInt(factor * b + bias), 0), 255);
      result[x + (y*imageData.width*4) + 3] = 255;
    }
  }
  for (var i = 0; i < imageData.data.length; i++) {
    imageData.data[i] = result[i];
  }
}

function blur1(imageData) {
  var filter = [
    [ 0.0, 0.2, 0.0 ],
    [ 0.2, 0.2, 0.2 ],
    [ 0.0, 0.2, 0.0 ]
  ];
  convolution(imageData, filter);
}

function blur2(imageData) {
  var filter = [
    [ 0, 0, 1, 0, 0 ],
    [ 0, 1, 1, 1, 0 ],
    [ 1, 1, 1, 1, 1 ],
    [ 0, 1, 1, 1, 0 ],
    [ 0, 0, 1, 0, 0 ]
  ];
  convolution(imageData, filter, factor=1.0/13.0);
}

function motionBlur(imageData) {
  var filter = [
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1 ]
  ];
  convolution(imageData, filter, factor=1.0/9.0);
}

function findEdges(imageData) {
  var filter = [
    [ -1,  0, 0,  0,  0 ],
    [  0, -2, 0,  0,  0 ],
    [  0,  0, 6,  0,  0 ],
    [  0,  0, 0, -2,  0 ],
    [  0,  0, 0,  0, -1 ]
  ];
  convolution(imageData, filter);
}

function sharpen(imageData) {
  var filter = [
    [ -1, -1, -1 ],
    [ -1,  9, -1 ],
    [ -1, -1, -1 ]
  ];
  convolution(imageData, filter);
}

function emboss(imageData) {
  var filter = [
    [ -1, -1, -1, -1, 0 ],
    [ -1, -1, -1,  0, 1 ],
    [ -1, -1,  0,  1, 1 ],
    [ -1,  0,  1,  1, 1 ],
    [  0,  1,  1,  1, 1 ]
  ];
  convolution(imageData, filter, factor=1.0, bias=128);
}