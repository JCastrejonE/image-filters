// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


// Globals
var imgSrc = './assets/img/dark-placeholder.png';
var originalImg = new Image();

// Canvas
var original;
var filtered;
var output;

// Keep data
var imageFiltered;

window.addEventListener('load', initCanvas);
window.addEventListener('resize', updateCanvas);

function initCanvas() {
  original = document.getElementById("original");
  filtered = document.getElementById("filtered");
  output = document.getElementById("output");
  originalImg.onload = function () {
    updateCanvas();
  }
  originalImg.src = imgSrc;
}

function updateCanvas() {
  var width = $("#original").width();
  var scale = width / originalImg.width
  var height = originalImg.height * scale;
  original.width = width;
  filtered.width = width;
  original.height = height;
  filtered.height = height;
  context = original.getContext('2d');
  context.drawImage(originalImg, 0, 0, width, height);
  var brightness = $('#brightness').val();
  applyFilter($('#filterSel').val(), brightness, false);
}

function applyFilter(filter, value, saving) {
  if(!saving) {
    var context = original.getContext('2d');
    var imageData = context.getImageData(0, 0, original.width, original.height);
  } else {
    var context = output.getContext('2d');
    var imageData = context.getImageData(0, 0, output.width, output.height);
  }
  $("#mosaicsSlider").addClass("d-none");
  switch (filter) {
    case "1":
      gray1(imageData.data);
      break;
    case "2":
      gray2(imageData.data);
      break;
    case "3":
      gray3(imageData.data);
      break;
    case "4":
      gray4(imageData.data);
      break;
    case "5":
      gray5(imageData.data);
      break;
    case "6":
      gray6(imageData.data);
      break;
    case "7":
      gray7(imageData.data);
      break;
    case "8":
      gray8(imageData.data);
      break;
    case "9":
      gray9(imageData.data);
      break;
    case "10":
      $("#mosaicsSlider").removeClass("d-none");
      mosaic(imageData, $("#mosaics").val());
      break;
  }
  if (!saving) {
    imageFiltered = new ImageData(imageData.data.slice(), imageData.width, imageData.height);
  }
  brightness(imageData.data, value);
  if (!saving) {
    context = filtered.getContext('2d');
  } else {
    context = output.getContext('2d');
  }
  context.putImageData(imageData, 0, 0);
}

$('#selectImg').on('click', function() {
  window.api.send('open-file-dialog');
})

$('#saveImg').on('click', function() {
  saveProcedure();
})

function saveProcedure() {
  var width = originalImg.width;
  var height = originalImg.height;
  output.width = width;
  output.height = height;
  context = output.getContext('2d');
  context.drawImage(originalImg, 0, 0, width, height);
  var brightness = $('#brightness').val();
  applyFilter($('#filterSel').val(), brightness, true);

  var imageURI = output.toDataURL("image/jpeg", 0.9);
  var filePath = imgSrc.split('.');
  filePath.pop();
  filePath = filePath.toString().concat("-EDITED.jpg");
  window.api.send('save-dialog', {defaultPath: filePath, image: imageURI});
}

window.api.receive('selected-image', (path) => {
  imgSrc = path;
  $('#imgPath').val(imgSrc);
  $('#filterSel').prop('disabled', false);
  $('#filterSel').val("0");
  $('#brightness').prop('disabled', false);
  $('#brightness').val("0");
  $('#saveImg').prop('disabled', false);
  initCanvas();
})

window.api.receive('save-image', (path) => {
  if(!$('#saveImg').prop('disabled'))
    saveProcedure();
})

$('#filterSel').on('change', function() {
  var brightness = $('#brightness').val();
  applyFilter(this.value, brightness, false);
})

$(document).on('input', '#brightness', function() {
  let imageBrightened = {};
  imageBrightened = new ImageData(imageFiltered.data.slice(), imageFiltered.width, imageFiltered.height);
  brightness(imageBrightened.data, this.value);
  context = filtered.getContext('2d');
  context.putImageData(imageBrightened, 0, 0);
})

$(document).on('input', '#mosaics', function() {
  applyFilter("10", $("#brightness").val(), false);
})