var CanvasPainter = (function() {
  var canvas = document.getElementById('paintCanvas');
  var ctx = canvas.getContext('2d');

  var toolColorPicker = document.getElementById('toolColorPicker');
  var selectedColor = '#000';

  var toolLineWidthRange = document.getElementById('toolWidthRange');
  var selectedLineWidth = 50;

  var toolModePaint = document.getElementById('toolModePaint');
  var toolModeEraser = document.getElementById('toolModeEraser');
  var paintMode = true;

  var brushWidthPreview = document.getElementById('brushWidthPreview');
  var colorPickerLabel = document.getElementById('colorPickerLabel');

  var globalModeFunky = document.getElementById('globalModeFunky');

  var globalModeReset = document.getElementById('globalModeReset');
  var globalModeSave = document.getElementById('globalModeSave');

  var toolControlWidth = document.getElementById('controlWidth');
  var controlWidthWrapper = document.getElementById('controlWidthWrapper');
  var controlWidth = false;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.strokeStyle = '#000';
  ctx.lineJoint = 'round';
  ctx.lineCap = 'round';

  ctx.lineWidth = 10;

  var isDrawing = false;
  var lastX = 0;
  var lastY = 0;
  var hue = 0;
  var direction = true;

  function setGlobalMode() {
    canvas.removeEventListener('mousemove', drawNormal);
    canvas.addEventListener('mousemove', drawFunky);
    controlWidthWrapper.classList.remove('disabled');
    ctx.lineWidth = 10;
  }

  function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function updateLineWidth() {
    selectedLineWidth = this.value;
    brushWidthPreview.style.width = selectedLineWidth+"px";
    brushWidthPreview.style.height = selectedLineWidth+"px";
  }

  function updateColorVar() {
    selectedColor = this.value;
    brushWidthPreview.style.backgroundColor = selectedColor;
    colorPickerLabel.style.backgroundColor = selectedColor;
  }

  function updateControlWidth() {
    controlWidth = this.checked;
    if (!controlWidth) ctx.lineWidth = 10;
  }

  function disableFunkyMode() {
    controlWidthWrapper.classList.add('disabled');
    canvas.removeEventListener('mousemove', drawFunky);
    canvas.addEventListener('mousemove', drawNormal);
  }

  function setPaintMode() {
    paintMode = true;
    disableFunkyMode();
  }

  function setEraserMode() {
    disableFunkyMode();
    paintMode = false;
  }

  function saveImage() {
    var dataURL = canvas.toDataURL('image/png');
    globalModeSave.href = dataURL;
  }

  function dynamicLineWidth() {
    if (ctx.lineWidth > 90 || ctx.lineWidth < 10) {
      direction = !direction;
    }
    direction ? ctx.lineWidth++ : ctx.lineWidth--;
  }

  function drawOnCanvas(event) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();

    [lastX, lastY] = [event.offsetX, event.offsetY];
  }

  function drawFunky(e) {
    if (!isDrawing) return;

    ctx.strokeStyle = `hsl(${hue},100%,50%)`;
    ctx.globalCompositeOperation = 'source-over';

    hue++;

    if (hue >= 360) hue = 0;

    controlWidth ? (ctx.lineWidth = selectedLineWidth) : dynamicLineWidth();

    brushWidthPreview.style.width = ctx.lineWidth+"px";
    brushWidthPreview.style.height = ctx.lineWidth+"px";
    brushWidthPreview.style.backgroundColor = ctx.strokeStyle;

    drawOnCanvas(e);
  }

  function drawNormal(e) {
    if (!isDrawing) return;
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = selectedLineWidth;

    brushWidthPreview.style.width = ctx.lineWidth+"px";
    brushWidthPreview.style.height = ctx.lineWidth+"px";
    brushWidthPreview.style.backgroundColor = ctx.strokeStyle;

    paintMode ? (ctx.globalCompositeOperation = 'source-over') : (ctx.globalCompositeOperation = 'destination-out');

    drawOnCanvas(e);
  }

  function handleMouseDown(e) {
    console.log(e);
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  function init() {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', drawNormal);
    canvas.addEventListener('mouseup', () => (isDrawing = false));
    canvas.addEventListener('mouseout', () => (isDrawing = false));

    toolColorPicker.addEventListener('change', updateColorVar);
    toolWidthRange.addEventListener('change', updateLineWidth);

    toolModePaint.addEventListener('click', setPaintMode);
    toolModeEraser.addEventListener('click', setEraserMode);

    globalModeFunky.addEventListener('click', setGlobalMode);
    globalModeReset.addEventListener('click', resetCanvas);
    globalModeSave.addEventListener('click', saveImage);

    toolControlWidth.addEventListener('click', updateControlWidth);
  }

  init();

  return 'Hello Mr. Developer. All my functions and vars are private :)';
})();