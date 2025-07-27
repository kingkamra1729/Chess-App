function makeDraggable(evt) {
  const svg = evt.target;
  let selectedElement = null;
  let offset;

  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);

  function getMousePosition(evt) {
    const CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }

  function startDrag(evt) {
    if (evt.target.closest('.draggable')) {
      selectedElement = evt.target.closest('.draggable');
      offset = getMousePosition(evt);
      const transform = selectedElement.transform.baseVal.consolidate();
      if (transform) {
        selectedElement._initialTransform = transform.matrix;
      } else {
        selectedElement._initialTransform = svg.createSVGMatrix();
      }
    }
  }

  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();
      const coord = getMousePosition(evt);
      const dx = coord.x - offset.x;
      const dy = coord.y - offset.y;
      const newTransform = svg.createSVGTransform();
      newTransform.setTranslate(dx, dy);
      selectedElement.transform.baseVal.initialize(newTransform);
    }
  }

  function endDrag(evt) {
    selectedElement = null;
  }
}

document.querySelector('.chessboard').addEventListener('load', makeDraggable);
makeDraggable({ target: document.querySelector('.chessboard') });