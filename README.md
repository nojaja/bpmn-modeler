# bpmn-modeler

[![Licence](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE) 

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/nojaja/bpmn-modeler) 

A bpmn modeler that embeds the bpmn.io project and supports Google Drive

## Feature
* Edit the BPMN 2.0 diagram in the browser.
* Google Drive supported.
* BPMN 2.0 diagrams supported.
* Drag and drop to import images.
* NFS supported.

## Live Demo
https://nojaja.github.io/bpmn-modeler/

[bpmn sample Request-to-Change](https://nojaja.github.io/bpmn-modeler/?q=https://gist.githubusercontent.com/nojaja/4d673f3630af3f7393d3ecf829b9ad90/raw/91bf28c1e432c3fe73beee5e8920c843f19d161c/Request-to-Change.bpmn.svg)

## Screenshot
![screenshot](/assets/screenshots/bpmn-modeler.png)

## Development
1. init
```sh
$ npm install
```

2. start
```sh
$ npm start
```

3. open browser
```
http://localhost:8080
```
## Chrome 86以下の場合
URL欄に`chrome://flags/#native-file-system-api`と入力して、該当するフラグを有効にします

## License

Licensed under the [MIT](LICENSE) License.
