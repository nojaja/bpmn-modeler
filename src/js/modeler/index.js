
import '../../css/style.css'
import '../../../node_modules/toastr/build/toastr.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
//import BpmnJS from 'bpmn-js/dist/bpmn-modeler.development'
import BpmnModeler from 'bpmn-js/lib/Modeler';
//import BpmnJS from 'bpmn-js'
import GDrivestorage from '../fs/gDrivestorage.js'
import Nfsstorage from '../fs/Nfsstorage'
import Menus from '../menus.js'
import toastr from 'toastr'
window.toastr = toastr
toastr.options = {
  timeOut: 1000,
  positionClass: 'toast-top-center'
}

const gDrivestorage = new GDrivestorage();
const nfs = new Nfsstorage()

const t = document.getElementById("menuFile");
const myMenu = new Menus(t);
const isMac = navigator.userAgent.includes('Mac OS X')

let currentFile = {
  filename: 'new bpmn',
  fileid: '',
  handle: null,
  isModified: false,
  bpmnModeler: null
}

// Verify the APIs we need are supported, show a polite warning if not.
if (nfs.hasNativeFS) {
  //document.getElementById('not-supported').classList.add('hidden');
} else {
  //document.getElementById('lblLegacyFS').classList.toggle('hidden', false);
  document.getElementById('butSave').classList.toggle('hidden', true);
}


let setting = {}
fetch("./assets/setting.json", {
  method: "get"
}).then(async (response) => {
  if (response.status === 200) {
    console.log(response); // => "OK"
    setting = await response.json()
    if('google_oauth' in setting){
      const noAuthorize = document.querySelectorAll('.no_authorize');
      const reqAuthorize = document.querySelectorAll('.req_authorize');
      gDrivestorage.onUpdateSigninStatus((isSignedIn) => {
        if (isSignedIn) {
          noAuthorize.forEach(el => el.style.display = 'none');
          reqAuthorize.forEach(el => el.style.display = 'block');
        } else {
          noAuthorize.forEach(el => el.style.display = 'block');
          reqAuthorize.forEach(el => el.style.display = 'none');
        }
      })
      gDrivestorage.loadAuth2()
    }
  } else {
    console.log(response.statusText); // => Error Message
  }
}).catch((response) => {
  console.log(response); // => "TypeError: ~"
});


/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gDrivestorage.signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gDrivestorage.signOut();
}

/**
 *  Sign out the user upon button click.
 */
function handlePickerClick(event) {
  gDrivestorage.loadPicker((data) => {
    if (data.action == google.picker.Action.PICKED) {
      var fileId = data.docs[0].id;
      loadProject(fileId, "gdrive", () => {
        toastr.success('Open BPMN')
      })
    }
  });
}

function handleOpenClick(event) {
  myMenu.hideAll()
  loadProject(null, "nfs", () => {
    toastr.success('Open BPMN')
  })
}

function handleSaveClick(event) {
  myMenu.hideAll()
  try {
    nfs.saveDraft(currentFile, () => {
      toastr.success('Save BPMN')
    })
  } catch (err) {
    console.error('could not save BPMN 2.0 diagram', err);
    toastr.error('could not save BPMN 2.0 diagram')
  }
}

function handleSaveAsClick(event) {
  myMenu.hideAll()
  try {
    nfs.saveDraftAs(currentFile, () => {
      toastr.success('Save BPMN')
    })
  } catch (err) {
    console.error('could not save BPMN 2.0 diagram', err);
    toastr.error('could not save BPMN 2.0 diagram')
  }
}

function handleTitleChange(event) {
  let val = $(event.currentTarget).val();
  currentFile.filename = val
}

var diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
const xmlStr =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
  'id="empty-definitions" ' +
  'targetNamespace="http://bpmn.io/schema/bpmn">' +
  '</bpmn2:definitions>';
var initialDiagram =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
  'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
  'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
  'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
  'targetNamespace="http://bpmn.io/schema/bpmn" ' +
  'id="Definitions_1">' +
  '<bpmn:process id="Process_1" isExecutable="false">' +
  '<bpmn:startEvent id="StartEvent_1"/>' +
  '</bpmn:process>' +
  '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
  '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
  '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
  '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
  '</bpmndi:BPMNShape>' +
  '</bpmndi:BPMNPlane>' +
  '</bpmndi:BPMNDiagram>' +
  '</bpmn:definitions>';

// modeler instance
currentFile.bpmnModeler = new BpmnModeler({
  container: '#canvas',
  keyboard: {
    bindTo: window
  }
});

/**
 * Save diagram contents and print them to the console.
 */
async function exportDiagram() {
  try {
    var result = await currentFile.bpmnModeler.saveXML({ format: true });
    console.log('DIAGRAM', result.xml);
    gDrivestorage.saveDraft(currentFile, () => {
      toastr.success('Save BPMN')
    })
  } catch (err) {
    console.error('could not save BPMN 2.0 diagram', err);
    toastr.error('could not save BPMN 2.0 diagram')
  }
}

/**
 * Open diagram in our modeler instance.
 *
 * @param {String} bpmnXML diagram to display
 */
async function openDiagram(bpmnXML) {

  // import diagram
  try {
    toastr.success('Open BPMN')

    //await bpmnModeler.importXML(bpmnXML);
    await currentFile.bpmnModeler.importXML(initialDiagram);
    //await bpmnModeler.fromXML(xmlStr);

    // access modeler components
    var canvas = currentFile.bpmnModeler.get('canvas');
    var overlays = currentFile.bpmnModeler.get('overlays');


    // zoom to fit full viewport
    canvas.zoom('fit-viewport');
    /*
        // attach an overlay to a node
        overlays.add('SCAN_OK', 'note', {
          position: {
            bottom: 0,
            right: 0
          },
          html: '<div class="diagram-note">Mixed up the labels?</div>'
        });
    
        // add marker
        canvas.addMarker('SCAN_OK', 'needs-discussion');
        */
  } catch (err) {
    console.error('could not import BPMN 2.0 diagram', err);
    toastr.error('could not import BPMN 2.0 diagram')
  }
}


//プロジェクトファイルの読み込み
function loadProject(url, type, cb) {
  // URL指定がない場合はlocalから取得
  if (type == "gdrive") {
    gDrivestorage.loadDraft(currentFile, url, (currentFile) => {
      $('#title-input').val(currentFile.filename);
      console.log(currentFile.bpmnModeler)
      return (cb) ? cb() : true;
    })
  } else if (type == "nfs") {
    nfs.loadDraft(currentFile, url, (currentFile) => {
      $('#title-input').val(currentFile.filename);
      console.log(currentFile.bpmnModeler)
      return (cb) ? cb() : true;
    })
  }
}

function newfile() {
  myMenu.hideAll()
  // load external diagram file via AJAX and open it
  currentFile.filename = 'new bpmn'
  currentFile.fileid = ''
  $.get(diagramUrl, openDiagram, 'text');
  $('#title-input').val(currentFile.filename);
}

//View///////////////////////////////////////////////////
$(document).ready(() => {
  newfile()
  
  // wire save button
  $('#save').click(exportDiagram);
  $('#butSave').click(handleSaveClick);
  $('#butSaveAs').click(handleSaveAsClick);

  $('#authorize_button').click(handleAuthClick);
  $('#signout_button').click(handleSignoutClick);
  $('#picker_button').click(handlePickerClick);
  $('#butNew').click(newfile);
  $('#butOpen').click(handleOpenClick);

  $('#title-input').change(handleTitleChange);
});

$(window).keydown((e) => {
  if (e.ctrlKey) {
    if (e.keyCode === 83) { // ^s
      handleSaveClick()
      return false;
    } else if (e.keyCode === 78) { // ^n
      newfile()
      return false;
    } else if (e.keyCode === 79) { // ^o
      handleOpenClick()
      return false;
    } else if (e.shiftKey && e.keyCode === 83) {// ^↑s
      handleSaveAsClick()
      return false;
    }
  }
});