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
  applyFilter($('#filterSel').val(), brightness);
}

function applyFilter(filter, value, saving=false) {
  if(!saving) {
    var context = original.getContext('2d');
    var imageData = context.getImageData(0, 0, original.width, original.height);
  } else {
    var context = output.getContext('2d');
    var imageData = context.getImageData(0, 0, output.width, output.height);
  }
  hideSliders();
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
    case "11":
      highContrast(imageData.data);
      break;
    case "12":
      highContrastInverse(imageData.data);
      break;
    case "13":
      $("#RGBSliders").removeClass("d-none");
      var rgb = {
        "red": parseInt($("#red").val()),
        "green": parseInt($("#green").val()),
        "blue": parseInt($("#blue").val())
      }
      RGBComponents(imageData.data, rgb);
      break;
    case "14":
      blur1(imageData);
      break;
    case "15":
      blur2(imageData);
      break;
    case "16":
      motionBlur(imageData);
      break;
    case "17":
      findEdges(imageData);
      break;
    case "18":
      sharpen(imageData);
      break;
    case "19":
      emboss(imageData);
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

function hideSliders() {
  $("#mosaicsSlider").addClass("d-none");
  $("#RGBSliders").addClass("d-none");
}

$('#selectImg').on('click', function() {
  window.api.send('open-file-dialog');
})

$('#saveImg').on('click', function() {
  saveLoading();
})

function saveLoading() {
  $('#saveImg').prop('disabled', true);
  $('#save-ready').addClass('d-none');
  $('#save-loading').removeClass('d-none');
  setTimeout(function(){saveProcedure();}, 1);
}

function saveProcedure() {
  var width = originalImg.width;
  var height = originalImg.height;
  output.width = width;
  output.height = height;
  context = output.getContext('2d');
  context.drawImage(originalImg, 0, 0, width, height);
  var brightness = $('#brightness').val();
  applyFilter($('#filterSel').val(), brightness, saving=true);

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
  if(!$('#saveImg').prop('disabled')) {
    saveLoading();
  }
})

window.api.receive('saved-image', (path) => {
  $('#saveImg').prop('disabled', false);
  $('#save-ready').removeClass('d-none');
  $('#save-loading').addClass('d-none');
})

$('#filterSel').on('change', function() {
  var brightness = $('#brightness').val();
  applyFilter(this.value, brightness);
})

$(document).on('input', '#brightness', function() {
  let imageBrightened = {};
  imageBrightened = new ImageData(imageFiltered.data.slice(), imageFiltered.width, imageFiltered.height);
  brightness(imageBrightened.data, this.value);
  context = filtered.getContext('2d');
  context.putImageData(imageBrightened, 0, 0);
})

$(document).on('input', '#mosaics', function() {
  applyFilter("10", $("#brightness").val());
})

$(document).on('input', '#red', function() {
  applyFilter("13", $("#brightness").val());
})

$(document).on('input', '#green', function() {
  applyFilter("13", $("#brightness").val());
})

$(document).on('input', '#blue', function() {
  applyFilter("13", $("#brightness").val());
})