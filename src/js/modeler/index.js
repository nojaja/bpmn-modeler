
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
import ResizeAllModule from '../custom-modeler/resize-all-rules'
import ColorPickerModule from '../custom-modeler/color-picker'
//import BpmnJS from 'bpmn-js'
import GDrivestorage from '../fs/gDrivestorage.js'
import Nfsstorage from '../fs/Nfsstorage'
import Menus from '../menus.js'
import * as cheerio from 'cheerio'
import Canvg from 'canvg';
import jszip from 'jszip';
import ZipAsPng from '../fs/ZipAsPng';
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
  fileext: 'bpmn',
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
    console.log(setting)
    if('google_oauth' in setting && setting.google_oauth.clientId){
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
      gDrivestorage.loadAuth2(setting.google_oauth)
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

async function saveSVG() {
  //svgのタグにcontent属性を追加して編集用データをbase64で埋め込む
  const {svg} = await currentFile.bpmnModeler.saveSVG();
  const {xml} = await currentFile.bpmnModeler.saveXML({ format: true });

  const $ = cheerio.load(svg, {xmlMode: true});
  const contentData = Buffer.from(xml);
  const base64 = contentData.toString('base64');
  $('svg').attr('content', base64);
  return $.xml();
}
async function saveXML() {
  const {xml} = await currentFile.bpmnModeler.saveXML({ format: true });
  return xml;
}

async function handleSaveClick(event) {
  myMenu.hideAll()
  try {
    const result = (currentFile.fileext === 'bpmn.svg')? await saveSVG():await saveXML();
    const filename = (currentFile.filename || 'bpmn_'+Date.now() + Math.floor(1e4 + 9e4 * Math.random()))+ '.'+currentFile.fileext;
    nfs.saveDraft(currentFile.handle,filename,result, () => {
      toastr.success('Save BPMN')
    })
  } catch (err) {
    console.error('could not save BPMN 2.0 diagram', err);
    toastr.error('could not save BPMN 2.0 diagram')
  }
}

async function handleSaveAsClick(event) {
  myMenu.hideAll()
  try {
    const result = await saveXML();
    currentFile.fileext = 'bpmn';
    const filename = (currentFile.filename || 'bpmn_'+Date.now() + Math.floor(1e4 + 9e4 * Math.random())) + '.'+currentFile.fileext;
    nfs.saveDraftAs(currentFile.handle,filename,result, () => {
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
    const result = await saveSVG();
    currentFile.fileext = 'bpmn.svg';
    const filename = (currentFile.filename || 'bpmn_'+Date.now() + Math.floor(1e4 + 9e4 * Math.random()))+ '.'+currentFile.fileext;
    nfs.saveDraftAs(currentFile.handle,filename,result, () => {
      toastr.success('Save BPMN SVG')
    })
  } catch (err) {
    console.error('could not save svg BPMN 2.0 diagram', err);
    toastr.error('could not save svg BPMN 2.0 diagram')
  }

}

async function handleSavePNGClick(event) {
  myMenu.hideAll()
  try {
    const result = await saveSVG();
    currentFile.fileext = 'zip.png';
    const filename = (currentFile.filename || 'bpmn_'+Date.now() + Math.floor(1e4 + 9e4 * Math.random()))+ '.'+currentFile.fileext;

    //zipファイルの作成、sourceのbpmnを格納
    const source = await saveXML();
    const sourcefilename = (currentFile.filename || 'bpmn_'+Date.now() + Math.floor(1e4 + 9e4 * Math.random())) + '.bpmn';
    const zip = new jszip();
    zip.file(sourcefilename,source);
    const compressed = await zip.generateAsync({type:'arraybuffer', compression: "DEFLATE",compressionOptions: {level: 1} }) //blobタイプのzipを作成。

    //svgをpngに変換
    const offscreenCanvas = document.createElement('canvas');
    const ctx = offscreenCanvas.getContext('2d');
    const v = Canvg.fromString(ctx, result);
    v.render();
    const png = offscreenCanvas.toDataURL();

    //pngファイルのblob形式を取得する
    const pngblob = await (() =>
      new Promise(resolve => {
        offscreenCanvas.toBlob(async (blob) => {
          resolve(await blob.arrayBuffer())
        })
      }))()
    
    //pngにzip埋め込み処理
    // [png] + [zip] = [zip.png] 
    const zipAsPng = new ZipAsPng();
    const out = zipAsPng.zipToPng(Buffer.from(compressed, 'binary'),Buffer.from(pngblob, 'binary'))

    //ダウンロード処理
    let atag = document.createElement('a')
    atag.id = "aDownloadFile"
    atag.download = true
    document.body.appendChild(atag)
    const opts = {type: 'image/png'};
    const file = new File([out], '', opts);
    atag.href = window.URL.createObjectURL(file);
    atag.setAttribute('download', filename);
    atag.click();
    
  } catch (err) {
    console.error('could not save svg BPMN 2.0 diagram', err);
    toastr.error('could not save svg BPMN 2.0 diagram')
  }

}

function handleTitleChange(event) {
  let val = $(event.currentTarget).val();
  currentFile.filename = val
}

const diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
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
  },
  additionalModules: [
    ResizeAllModule,
    ColorPickerModule
  ]
});

/**
 * Save diagram contents and print them to the console.
 */
async function exportDiagram() {
  try {
    const result = await saveXML({ format: true });
    currentFile.fileext = 'bpmn';
    console.log('DIAGRAM', result);
    gDrivestorage.saveDraft(currentFile, () => {
      toastr.success('Save BPMN')
    })
  } catch (err) {
    console.error('could not save BPMN 2.0 diagram', err);
    toastr.error('could not save BPMN 2.0 diagram')
  }
}


async function importXML(contents) {
  //svgの場合はsvgタグのcontentからデータを取り出す 
  const $ = cheerio.load(contents, {xmlMode: true});
  if($('svg[content]').length > 0){
      const contentData = $('svg').attr('content')
      const base64 = Buffer.from(contentData, 'base64');
      const xml = base64.toString();
      await currentFile.bpmnModeler.importXML(xml || initialDiagram);
  }else{
      await currentFile.bpmnModeler.importXML(contents || initialDiagram);
  }
}


/**
 * Open diagram in our modeler instance.
 *
 * @param {String} filename 
 * @param {String} fileext 
 * @param {String} contents diagram to display
 * @param callback
 */
async function openDiagram(filename,fileext,contents) {
  console.log('openDiagram',filename,fileext,contents);
  // import diagram
  try {
    toastr.success('Open BPMN')
    currentFile.filename = filename;
    currentFile.fileext = fileext;

    await importXML(contents);
    $('#title-input').val(currentFile.filename);

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
    window.history.replaceState({}, document.title, "/")
    nfs.loadDraft(currentFile, url, openDiagram)
  }
}

function newfile() {
  myMenu.hideAll()
  // load external diagram file via AJAX and open it
  currentFile.filename = 'new bpmn'
  currentFile.fileext = 'bpmn'
  currentFile.fileid = ''
  //$.get(diagramUrl, openDiagram, 'text');
  openDiagram(currentFile.filename,currentFile.fileext,initialDiagram)
}


// file drag / drop ///////////////////////
function registerFileDrop(container, callback) {

  function handleFileSelect(e) {
    console.log('handleFileSelect',e.x,e.y)
    let dropObject = {
      event:e,
      pos:{x:e.x, y:e.y},
      file:{
        filetype:null,
        filename:null,
        filedata:null
      }
    }

    e.stopPropagation();
    e.preventDefault();
    const files = e.dataTransfer.files;
    const file = files[0];
    const filefullname = file.name;
    const filename = filefullname.substring(0,filefullname.indexOf('.'))
    const fileext = filefullname.substring(filefullname.indexOf('.')+1);

    dropObject.file.filename = filename;
    dropObject.file.filetype = fileext;
    dropObject.file.filename = filename;
    const reader = new FileReader();
    reader.onload = function(e) {
      dropObject.file.filedata = e.target.result;
      console.log('onload',dropObject);
      window.history.replaceState({}, document.title, "/")
      callback(dropObject);
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
  registerFileDrop(container, openFile);
}

function openFile(dropObject) {
  openDiagram(dropObject.file.filename,dropObject.file.filetype,dropObject.file.filedata)
}

//GETパラメータの取得
const arg = new Object();
const pair = location.search.substring(1).split("&");
for (let i = 0; pair[i]; i++) {
  let kv = pair[i].split("=");
  arg[kv[0]] = kv[1];
}
  
//View///////////////////////////////////////////////////
$(document).ready(() => {
  newfile()
  const file_url = arg["q"]
  if(file_url){
    const filefullname = file_url.substring(file_url.lastIndexOf('/')+1)
    const filename = filefullname.substring(0,filefullname.indexOf('.'))
    const fileext = filefullname.substring(filefullname.indexOf('.')+1)
    console.log('fetch',filefullname,filename,fileext)
    fetch(file_url, {
      mode: 'cors'
    })
      .then(async response => {
        if(response.ok) {
          openDiagram(filename, fileext, await response.text())
        }
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }
  
  // wire save button
  $('#save').on("click", exportDiagram);
  $('#butSave').on("click", handleSaveClick);
  $('#butSaveAs').on("click", handleSaveAsClick);
  $('#butSaveSVG').on("click", handleSaveSVGClick);
  $('#butSavePNG').on("click", handleSavePNGClick);
  
  $('#authorize_button').on("click", handleAuthClick);
  $('#signout_button').on("click", handleSignoutClick);
  $('#picker_button').on("click", handlePickerClick);
  $('#butNew').on("click", newfile);
  $('#butOpen').on("click", handleOpenClick);

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