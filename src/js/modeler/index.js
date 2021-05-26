
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
import * as cheerio from 'cheerio';
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

async function handleSaveSVGClick(event) {
  myMenu.hideAll()
  try {
    //svgのタグにcontent属性を追加して編集用データをbase64で埋め込む
    const {svg} = await currentFile.bpmnModeler.saveSVG();
    const {xml} = await currentFile.bpmnModeler.saveXML({ format: true });

    const $ = cheerio.load(svg, {xmlMode: true});
    const contentData = Buffer.from(xml);
    const base64 = contentData.toString('base64');
    $('svg').attr('content', base64);
    const svgData = $.xml();

    nfs.saveAsLegacy('diagram.svg', svgData)
    toastr.success('Save BPMN')
  } catch (err) {
    console.error('could not save svg BPMN 2.0 diagram', err);
    toastr.error('could not save svg BPMN 2.0 diagram')
  }

}


function handleTitleChange(event) {
  let val = $(event.currentTarget).val();
  currentFile.filename = val
}

var diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
/*
const initialDiagram =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
  'id="empty-definitions" ' +
  'targetNamespace="http://bpmn.io/schema/bpmn">' +
  '</bpmn2:definitions>';
*/

const initialDiagram =
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
  const $ = cheerio.load(bpmnXML, {xmlMode: true});
  // import diagram
  try {
    toastr.success('Open BPMN')

    //await bpmnModeler.importXML(bpmnXML);
    if($('svg[content]').length > 0){
      const contentData = $('svg').attr('content')
      const base64 = Buffer.from(contentData, 'base64');
      const xml = base64.toString();
      currentFile.bpmnModeler.importXML(xml);
      await currentFile.bpmnModeler.importXML(xml || initialDiagram);
    } else { //$('semantic\\:definitions'))
      await currentFile.bpmnModeler.importXML(bpmnXML || initialDiagram);
    }
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
  //$.get(diagramUrl, openDiagram, 'text');
  openDiagram(initialDiagram)
  $('#title-input').val(currentFile.filename);
}


// file drag / drop ///////////////////////
function registerFileDrop(container, callback) {

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var xml = e.target.result;
      console.log(xml)
      callback(xml);
    };
    reader.readAsText(file);
  }
  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  container.addEventListener('dragover', handleDragOver, false);
  container.addEventListener('drop', handleFileSelect, false);
}

const container = document.querySelectorAll('.panel-parent')[0];

// check file api availability
if (!window.FileList || !window.FileReader) {
  window.alert(
    'Looks like you use an older browser that does not support drag and drop. ' +
    'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
  registerFileDrop(container, openDiagram);
}


//View///////////////////////////////////////////////////
$(document).ready(() => {
  newfile()
  
  // wire save button
  $('#save').click(exportDiagram);
  $('#butSave').click(handleSaveClick);
  $('#butSaveAs').click(handleSaveAsClick);
  $('#butSaveSVG').click(handleSaveSVGClick);
  
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