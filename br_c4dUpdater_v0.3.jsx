﻿// start undo group{    app.beginUndoGroup("update c4d files");// Global variablesvar regVersionPat = /[_v]+[0-9]{1,}/ig;  // RegEx for versionvar regPatToReplace = /((_v)+([0-9]){1,})/ig;// pattern for any Versionvar versionsArray=new Array;var currentVersionIndex = 0;// check if selectedItem is Folder or FootageItem. function ScanFolers(){}var curFolder = app.project.activeItem;var selectedItems = app.project.selection;var listItems = curFolder.items; // list of eleements in foldervar firstFile = File (listItems[1].mainSource.file); // firstFile in Foldervar rootFolder = firstFile.parent.parent; // Renders parent foldervar listOfVersion = rootFolder.getFiles(); // get list of render folderslistOfVersion = listOfVersion.splice (1,listOfVersion.length); // remove .dstore file// find currentVersion of filevar fileName = firstFile.displayName;var regText = fileName.search(regVersionPat);var currentVersion = fileName.slice(regText+2,regText+4);var currentVersionNumber = parseInt (currentVersion);}ScanFolers();//UI definitionUI(this)function UI(object){var win = (object instanceof Panel) ? object : new Window("palette","c4dUpdater",[0,0,140,120],{resizeable:true,});panel_1=win.add("panel",[0,0,140,120],"c4d updater");//panel_1.graphics.backgroundColor = panel_1.graphics.newBrush (panel_1.graphics.BrushType.SOLID_COLOR,[0.25,0.25,0.25]);folderCheck=panel_1.add("checkbox",[10,15,120,35],"all files in folder");folderCheck.value=1firstButton=panel_1.add("button",[10,40,35,65],"--");oneDownButton=panel_1.add("button",[40,40,65,65],"-");latestButton=panel_1.add("button",[100,40,125,65],"++");oneUpButton=panel_1.add("button",[70,40,95,65],"+");scanButton=panel_1.add("button",[10,70,125,90],"scan for new version");}// end undo groupapp.endUndoGroup();// loop through folder to find all available versionsfor (var i=0 ; i<listOfVersion.length; i++){    var thisFileName = listOfVersion[i].displayName;    var regTextV = thisFileName.search(regVersionPat);    var thisVersion = thisFileName.slice(regTextV+2);    var thisVersionNumber = parseInt (thisVersion);    versionsArray [versionsArray.length] = thisVersion;    if(thisVersion == currentVersion){        currentVersionIndex = versionsArray.length-1;        }    }//FUNCTIONS// UI functionsoneUpButton.onClick = function(){    if(currentVersionIndex >= [versionsArray.length-1]){        var version = versionsArray[versionsArray.length-1];        replaceFileName (version);        currentVersionIndex = versionsArray.length-1;        }    else{        var version = versionsArray[currentVersionIndex+1];        replaceFileName (version);        currentVersionIndex = currentVersionIndex+1;        }    alert("files updated to version : "+version);}oneDownButton.onClick = function(){	if(currentVersionIndex <=0){        var version = versionsArray[0];        replaceFileName (version);        currentVersionIndex = 0;        }    else{        var version = versionsArray[currentVersionIndex-1];        replaceFileName (version);        currentVersionIndex = currentVersionIndex-1;        }    alert("files updated to version : "+version);}latestButton.onClick = function(){    var version = versionsArray[versionsArray.length-1];	replaceFileName (version);    currentVersionIndex= versionsArray.length-1;    alert("files updated to version : "+version);	}firstButton.onClick = function(){    var version = versionsArray[0];	replaceFileName (version);    currentVersionIndex = 0;    alert("files updated to version : "+version);}scanButton.onClick = function(){    ScanFolers();}// OP FUNCTIONSfunction checkCurrentIndex(currentIndex){    if(currentIndex <= 0 || currentIndex == versionsArray.length-1){        return true;        }     else{         return false;         }    }function replaceFileName (chosenVersion){    var w = new Window ("palette");var progress = progress_bar (w, listItems.length);for (var i=1; i<listItems.length+1;i++){        var newFileString= listItems[i].mainSource.file.toString();        newFileString = newFileString.replace(regPatToReplace, "_v"+chosenVersion);        var newFilePass = File (newFileString);        listItems[i].replaceWithSequence(newFilePass,false);        progress.value=i+1;        }    w.close();    }// function Progress barfunction progress_bar (w, stop) {var pbar = w.add ("progressbar", undefined, 0, stop); pbar.preferredSize = [300,10];w.show ();return pbar;}