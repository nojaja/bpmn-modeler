import { EventEmitter } from 'events'

// Client ID and API key from the Developer Console
const CLIENT_ID = '941050951476-akmt430s16rgv8vn69uegvpl2top89kt.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDit9VW9b_8-T_7QRAasT7j4IPTQV740RI';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

export class GDrivestorage {
    constructor() {
        this.ev = new EventEmitter()

        let script = document.createElement('script')
        script.async = true
        script.defer = true
        script.src = 'https://apis.google.com/js/api.js'
        script.onload = () => {
            script.onload = function () { }
            this.handleClientLoad()
        }
        script.onreadystatechange = () => {
            if (this.readyState === 'complete') this.onload()
        }
        document.body.appendChild(script)
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
        gapi.auth2.getAuthInstance().signIn()
    }

    /**
     *  Sign out the user upon button click.
     */
    signOut() {
        gapi.auth2.getAuthInstance().signOut()
    }

    /**
     *  On load, called to load the auth2 library and API client library.
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    handleClientLoad() {
        gapi.load('client:auth2', () =>{
            let ev = this.ev
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
                ev.emit('init')
            }, (error) => {
                console.log(JSON.stringify(error, null, 2))
            })
        })
    }

    //プロジェクト一覧取得
    async loadList(callback) {
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

    }

    deleteDraft(fileContainer, url) {
    }

    async saveDraft(bpmnModeler) {
        // ローカルストレージに最新の状態を保存
        var result = await bpmnModeler.saveXML({ format: true });
        const prjName = 'bpmn_'+Date.now() + Math.floor(1e4 + 9e4 * Math.random()) + '.bpmn'

        const boundary = '-------314159265358979323846'
        const delimiter = "\r\n--" + boundary + "\r\n"
        const close_delim = "\r\n--" + boundary + "--"
        let fileType = 'application/vnd.bpmn'
        let contentType = fileType || 'text/plain'
        let metadata = {
            'name': prjName,
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

        let request = gapi.client.request({
            'path': '/upload/drive/v3/files',
            'method': 'POST',
            'params': {
                'uploadType': 'multipart'
            },
            'headers': {
                'Content-Type': 'multipart/related; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        })
        try {
            request.execute( (file) => {
                console.log(file)
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

    loadDraft(bpmnModeler, url, callback) {
        gapi.client.drive.files.get({
            fileId: url,
            alt: "media"
        }).then(res => {
            console.log(res.body)
            let data = res.body
            bpmnModeler.importXML(data);
            return (callback) ? callback(bpmnModeler) : data
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