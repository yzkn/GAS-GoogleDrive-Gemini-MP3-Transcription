// Copyright (c) 2025 YA-androidapp(https://github.com/yzkn) All rights reserved.

// const
const ENTRY_TYPE = {
  BOTH: "both",
  FOLDER: "folder",
  FILE: "file"
};
const ROOT_FOLDER_ID = PropertiesService.getScriptProperties().getProperty("ROOT_FOLDER_ID");
console.log(ROOT_FOLDER_ID)


// ----------


function listFilesRecursively(rootFolderClass, type, func) {
  const files = rootFolderClass.getFiles()
  const folders = rootFolderClass.getFolders()

  if (type == ENTRY_TYPE.BOTH || type == ENTRY_TYPE.FILE) {
    while (files.hasNext()) {
      func(files.next(), ENTRY_TYPE.FILE)
    }
  }

  while (folders.hasNext()) {
    const folder = folders.next()
    if (type == ENTRY_TYPE.BOTH || type == ENTRY_TYPE.FOLDER) { func(folder, ENTRY_TYPE.FOLDER) }
    listFilesRecursively(folder, type, func)
  }
}

function listFiles(folder, type) {
  let fileList = [];

  listFilesRecursively(folder, type, function (entry, type) {
    const obj = {};
    obj['date'] = Utilities.formatDate(entry.getLastUpdated(), 'JST', 'yyyyMMdd HHmmss');
    obj['name'] = entry.getName();
    obj['url'] = entry.getUrl();
    obj['type'] = type;
    fileList.push(obj);
  });

  // nameの降順でソート
  fileList.sort(function (a, b) {
    if (a.name > b.name) {
      return -1;
    } else {
      return 1;
    }
  })

  return fileList;
}


// ----------


function myFunction() {
  console.log("Hello, world!!");

  const folder = DriveApp.getFolderById(ROOT_FOLDER_ID);
  console.log(folder.getName());

  const result = listFiles(folder, ENTRY_TYPE.FILE);
  console.log(result.length);
  console.log(result);

  console.log("Done!!");
}

// Webアプリとして実行
function doGet() {
  myFunction();
}
