import { EventEmitter } from 'events'

// Client ID and API key from the Developer Console
const CLIENT_ID = '941050951476-akmt430s16rgv8vn69uegvpl2top89kt.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDit9VW9b_8-T_7QRAasT7j4IPTQV740RI';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/drive'];

export class GDrivestorage {
    constructor() {
        this.ev = new EventEmitter()
        this.apiLoaded = false;
        this.auth2ApiLoaded = false;
        this.pickerApiLoaded = false;
        this.picker = null
    }

    init (callback) {
        let ev = this.ev
        if(!this.apiLoaded){
            let script = document.createElement('script')
            script.async = true
            script.defer = true
            script.src = 'https://apis.google.com/js/api.js'
            script.onload = () => {
                script.onload = function () { }
                this.apiLoaded = true
                ev.emit('init')
                if(callback)callback()
            }
            script.onreadystatechange = () => {
                if (this.readyState === 'complete') this.onload()
            }
            document.body.appendChild(script)
        } else {
            if(callback)callback()
        }
    }

    onInit(callback) {
        this.ev.on('init', callback)
    }

    /**
     *  Sign in the user upon button click.
     */
    onUpdateSigninStatus(callback) {
        this.ev.on('updateSigninStatus', callback)
    }

    /**
     *  Sign in the user upon button click.
     */
    signIn() {
        this.loadAuth2(() =>{
            gapi.auth2.getAuthInstance().signIn()
        })
    }

    /**
     *  Sign out the user upon button click.
     */
    signOut() {
        this.loadAuth2(() =>{
            gapi.auth2.getAuthInstance().signOut()
        })
    }

    /**
     *  On load, called to load the auth2 library and API client library.
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    loadAuth2(callback) {
        if(!this.auth2ApiLoaded){
            let ev = this.ev
            this.init ( () =>{
                gapi.load('client:auth2', () =>{
                    gapi.client.init({
                        apiKey: API_KEY,
                        clientId: CLIENT_ID,
                        discoveryDocs: DISCOVERY_DOCS,
                        scope: SCOPES
                    }).then(() => {
                        // Listen for sign-in state changes.
                        gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
                            ev.emit('updateSigninStatus', isSignedIn)
                        })
            
                        // Handle the initial sign-in state.
                        ev.emit('updateSigninStatus', gapi.auth2.getAuthInstance().isSignedIn.get())
                        this.auth2ApiLoaded = true
                        if(callback)callback()
                    }, (error) => {
                        console.log(JSON.stringify(error, null, 2))
                    })
                })
            } )
        } else {
            if(callback)callback()
        }
    }

    loadPicker(pickerCallback) {
        if(!this.pickerApiLoaded){
            let ev = this.ev
            this.loadAuth2 ( () =>{
                gapi.load('picker', () =>{
                    let user = gapi.auth2.getAuthInstance().currentUser.get();
                    let oauthToken = user.getAuthResponse().access_token;

                    let view = new google.picker.View(google.picker.ViewId.DOCS);
                    view.setMimeTypes("application/vnd.bpmn");
                    this.picker = new google.picker.PickerBuilder()
                        .enableFeature(google.picker.Feature.NAV_HIDDEN)
                        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                        .setLocale('ja')
                        .addView(view)
                        .setOAuthToken(oauthToken)
                        .addView(new google.picker.DocsUploadView())
                        .setCallback(pickerCallback)
                        .build();
                        this.picker.setVisible(true);
                     this.pickerApiLoaded = true
                })
            } )
        } else {
            this.picker.setCallback(pickerCallback)
            this.picker.setVisible(true)
        }
    }


    //プロジェクト一覧取得
    async loadList(callback) {
        this.loadAuth2(() =>{
            gapi.client.drive.files.list({
                'pageSize': 100,
                orderBy: "modifiedTime desc",
                //'q': "mimeType='image/jpeg'",
                q: "trashed=false and mimeType='application/vnd.bpmn'",
                'fields': "nextPageToken, files(id, name, mimeType, fileExtension)"
            }).then((response) => {
                let files = response.result.files
                if (files && files.length > 0) {
                    //{"description" : "simple demo01", "id" : "sample01.json", "public" : true },
                    //OUT {rows:[{description, id, public},,]}
                    const list = {
                        rows: files.map((file, index, array) => {
                            return {
                                description: file.name,
                                id: file.id,
                                public: true
                            }
                        })
                    }
                    return (callback) ? callback(list, "gdrive") : list
                } else {
                    console.log('No files found.')
                    const list = {
                        rows: []
                    }
                    return (callback) ? callback(list, "gdrive") : list
                }
            })
        })

    }

    deleteDraft(fileContainer, url) {
    }

    async saveDraft(currentFile,callback) {
        // ローカルストレージに最新の状態を保存
        var result = await currentFile.bpmnModeler.saveXML({ format: true });
        currentFile.filename = currentFile.filename || 'bpmn_'+Date.now() + Math.floor(1e4 + 9e4 * Math.random()) + '.bpmn'

        const boundary = '-------314159265358979323846'
        const delimiter = "\r\n--" + boundary + "\r\n"
        const close_delim = "\r\n--" + boundary + "--"
        let fileType = 'application/vnd.bpmn'
        let contentType = fileType || 'text/plain'
        let metadata = {
            'name': currentFile.filename,
            'mimeType': contentType
        };

        let base64Data = this.utf8_to_b64(result.xml)
        let multipartRequestBody =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;
        let param = {
            'path': (currentFile.fileid)? '/upload/drive/v3/files/'+currentFile.fileid : '/upload/drive/v3/files',
            'method': (currentFile.fileid)? 'PATCH' : 'POST',
            'params': (currentFile.fileid)? {
                'fileId': currentFile.fileid,
                'uploadType': 'multipart'
            } : {
                'uploadType': 'multipart'
            },
            'headers': {
                'Content-Type': 'multipart/related; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        }
        let request = gapi.client.request(param)
        try {
            request.execute( (file) => {
                console.log(file)
                if(callback)callback()
            });
        } catch (e) {
            console.error(e);
        }
    }

    // from http://ecmanaut.blogspot.jp/2006/07/encoding-decoding-utf8-in-javascript.html
    utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    b64_to_utf8(str) {
        return decodeURIComponent( escape(window.atob( str )) );
    }

    loadDraft(currentFile, url, callback) {
        gapi.client.drive.files.get({
            fileId: url,
            //alt: "media",
            fields: 'name, fileExtension, trashed'
        }).then(res => {

            console.log('loadDraft',res)
            currentFile.filename = res.result.name
            currentFile.fileid = url
            gapi.client.drive.files.get({
                fileId: url,
                alt: "media"
            }).then(res => {
                let data = res.body
                currentFile.bpmnModeler.importXML(data);
                return (callback) ? callback(currentFile) : data
            })
        })
    }

    updateInfoFile(fileContainer) {
        const siteeditor = new FileData()
        siteeditor.setFilename('.siteeditor.md');
        siteeditor.setContent(`{"description": "
# ${fileContainer.getProjectName()}
        
This is a project created by [SiteEditor](https://nojaja.github.io/SiteEditor/editor.html)
        
To run it, please go [here](https://nojaja.github.io/SiteEditor/editor.html?q=${fileContainer.getGistId()}&t=gist)
        
---
",
"setting": {
        "main": "index.html",
        "dependencies": []
    }
}`);
        siteeditor.getFileData()
        fileContainer.putFile(siteeditor)
    }
}
export default GDrivestorage