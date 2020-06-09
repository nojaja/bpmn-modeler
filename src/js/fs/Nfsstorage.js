import { EventEmitter } from 'events'

export class Nfsstorage {
    constructor() {
        this.ev = new EventEmitter()
        this.hasNativeFS = 'chooseFileSystemEntries' in window

        if(!this.hasNativeFS){
            let atag = document.createElement('a')
            atag.id = "aDownloadFile"
            atag.download = true
            document.body.appendChild(atag)
            let inputtag = document.createElement('input')
            inputtag.id = "filePicker"
            inputtag.type = "file"
            document.body.appendChild(inputtag)
            
            this.filePicker = inputtag
            this.aDownloadFile = atag
        }
            
    }

    /**
     * Open a handle to an existing file on the local file system.
     *
     * @return {!Promise<FileSystemFileHandle>} Handle to the existing file.
     */
    getFileHandle () {
        const handle = window.chooseFileSystemEntries();
        return handle;
    }

    /**
     * Create a handle to a new (text) file on the local file system.
     *
     * @return {!Promise<FileSystemFileHandle>} Handle to the new file.
     */
    getNewFileHandle() {
        const opts = {
            type: 'save-file',
            accepts: [{
                description: 'Text file',
                extensions: ['txt'],
                mimeTypes: ['text/plain'],
            }],
        };
        const handle = window.chooseFileSystemEntries(opts);
        return handle;
    }

    /**
     * Reads the raw text from a file.
     *
     * @param {File} file
     * @return {!Promise<string>} A promise that resolves to the parsed string.
     */
    readFile(file) {
        // If the new .text() reader is available, use it.
        if (file.text) {
            return file.text();
        }
        // Otherwise use the traditional file reading technique.
        return _readFileLegacy(file);
    }

    /**
     * Reads the raw text from a file.
     *
     * @private
     * @param {File} file
     * @return {Promise<string>} A promise that resolves to the parsed string.
     */
    _readFileLegacy(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('loadend', (e) => {
                const text = e.srcElement.result;
                resolve(text);
            });
            reader.readAsText(file);
        });
    }

    /**
     * Writes the contents to disk.
     *
     * @param {FileSystemFileHandle} fileHandle File handle to write to.
     * @param {string} contents Contents to write.
     */
    async writeFile(fileHandle, contents) {
        // Support for Chrome 82 and earlier.
        if (fileHandle.createWriter) {
            // Create a writer (request permission if necessary).
            const writer = await fileHandle.createWriter();
            // Write the full length of the contents
            await writer.write(0, contents);
            // Close the file and write the contents to disk
            await writer.close();
            return;
        }
        // For Chrome 83 and later.
        // Create a FileSystemWritableFileStream to write to.
        const writable = await fileHandle.createWritable();
        // Write the contents of the file to the stream.
        await writable.write(contents);
        // Close the file and write the contents to disk.
        await writable.close();
    }

    /**
     * Verify the user has granted permission to read or write to the file, if
     * permission hasn't been granted, request permission.
     *
     * @param {FileSystemFileHandle} fileHandle File handle to check.
     * @param {boolean} withWrite True if write permission should be checked.
     * @return {boolean} True if the user has granted read/write permission.
     */
    async verifyPermission(fileHandle, withWrite) {
        const opts = {};
        if (withWrite) {
            opts.writable = true;
        }
        // Check if we already have permission, if so, return true.
        if (await fileHandle.queryPermission(opts) === 'granted') {
            return true;
        }
        // Request permission to the file, if the user grants permission, return true.
        if (await fileHandle.requestPermission(opts) === 'granted') {
            return true;
        }
        // The user did nt grant permission, return false.
        return false;
    }


  
    /**
     * Uses the <input type="file"> to open a new file
     *
     * @return {!Promise<File>} File selected by the user.
     */
    getFileLegacy () {
      return new Promise((resolve, reject) => {
        this.filePicker.onchange = (e) => {
          const file = this.filePicker.files[0];
          if (file) {
            resolve(file);
            return;
          }
          reject(new Error('AbortError'));
        };
        this.filePicker.click();
      });
    };
  
    /**
     * Saves a file by creating a downloadable instance, and clicking on the
     * download link.
     *
     * @param {string} filename Filename to save the file as.
     * @param {string} contents Contents of the file to save.
     */
    // function saveAsLegacy(filename, contents) {
    saveAsLegacy (filename, contents) {
      filename = filename || 'Untitled.txt';
      const opts = {type: 'text/plain'};
      const file = new File([contents], '', opts);
      this.aDownloadFile.href = window.URL.createObjectURL(file);
      this.aDownloadFile.setAttribute('download', filename);
      this.aDownloadFile.click();
    };

    //プロジェクト一覧取得
    loadList(callback) {
    }

    deleteDraft(fileContainer, url) {
    }

    async saveDraftAs(currentFile,callback) {
        // ローカルストレージに最新の状態を保存
        var result = await currentFile.bpmnModeler.saveXML({ format: true });
        currentFile.filename = currentFile.filename || 'bpmn_'+Date.now() + Math.floor(1e4 + 9e4 * Math.random()) + '.bpmn'

        if (!this.hasNativeFS) {
            this.saveAsLegacy(currentFile.filename, result.xml);
            if(callback)callback()
            return;
        }
    }

    async saveDraft(currentFile,callback) {

        // ローカルストレージに最新の状態を保存
        var result = await currentFile.bpmnModeler.saveXML({ format: true });
        currentFile.filename = currentFile.filename || 'bpmn_'+Date.now() + Math.floor(1e4 + 9e4 * Math.random()) + '.bpmn'

        let fileHandle = await getNewFileHandle();
        //Create a writer (request permission if necessary).
        const writer = await fileHandle.createWriter();
        // Make sure we start with an empty file
        await writer.truncate(0);
        // Write the full length of the contents
        await writer.write(0, elmOutCanvas.value);
        // Close the file and write the contents to disk
        await writer.close();
        

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

    async loadDraft(currentFile, url, callback) {


        // If the Native File System API is not supported, use the legacy file apis.
        if (!this.hasNativeFS) {
            const file = await this.getFileLegacy();
            if (file) {
                const contents = await this.readFile(file);
                console.log('loadDraft',file,contents)
                currentFile.filename = file.name
                currentFile.bpmnModeler.importXML(contents);
                return (callback) ? callback(currentFile) : contents
            }
            return;
        }

        // If a fileHandle is provided, verify we have permission to read/write it,
        // otherwise, show the file open prompt and allow the user to select the file.
        if (currentFile.fileHandle) {
            if (await this.verifyPermission(currentFile.fileHandle, true) === false) {
                console.error(`User did not grant permission to '${fileHandle.name}'`);
                return;
            }
        } else {
            try {
                currentFile.fileHandle = await this.getFileHandle();
            } catch (ex) {
                if (ex.name === 'AbortError') {
                    return;
                }
                const msg = 'An error occured trying to open the file.';
                console.error(msg, ex);
                alert(msg);
            }
        }

        if (!currentFile.fileHandle) {
            return;
        }
        const file = await currentFile.fileHandle.getFile();
        const contents = await this.readFile(file, currentFile.fileHandle);

        console.log('loadDraft',file,contents)
        currentFile.filename = file.name
        currentFile.bpmnModeler.importXML(contents);
        return (callback) ? callback(currentFile) : contents
    }
}
export default Nfsstorage