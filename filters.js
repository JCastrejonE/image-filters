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
    data[i] += value    // Red channel
    data[i+1] += value; // Green channel
    data[i+2] += value; // Blue channel

    data[i] = Math.max(0, data[i]);
    data[i] = Math.min(255, data[i]);
    data[i+1] = Math.max(0, data[i+1]);
    data[i+1] = Math.min(255, data[i+1]);
    data[i+2] = Math.max(0, data[i+2]);
    data[i+2] = Math.min(255, data[i+2]);
  }
}

function mosaic(imageData, size) {
  var mosaicWidth = parseInt(imageData.width*4/size);
  mosaicWidth += 4 - mosaicWidth % 4;
  var mosaicHeight = parseInt(imageData.height/size) + 1;

  for (var my = 0; my < size; my += 1) {
    for (var mx = 0; mx < size; mx += 1) {
      var r = 0;
      var g = 0;
      var b = 0;
      var pixels = 0;
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