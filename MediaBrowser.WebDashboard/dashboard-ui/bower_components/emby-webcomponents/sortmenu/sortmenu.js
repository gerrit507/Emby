define(["require","dom","focusManager","dialogHelper","loading","layoutManager","connectionManager","globalize","userSettings","emby-select","paper-icon-button-light","material-icons","css!./../formdialog","emby-button","emby-linkbutton","flexStyles"],function(require,dom,focusManager,dialogHelper,loading,layoutManager,connectionManager,globalize,userSettings){"use strict";function onSubmit(e){return e.preventDefault(),!1}function initEditor(context,settings){context.querySelector("form").addEventListener("submit",onSubmit),context.querySelector(".selectSortOrder").value=settings.sortOrder,context.querySelector(".selectSortBy").value=settings.sortBy}function centerFocus(elem,horiz,on){require(["scrollHelper"],function(scrollHelper){var fn=on?"on":"off";scrollHelper.centerFocus[fn](elem,horiz)})}function fillSortBy(context,options){context.querySelector(".selectSortBy").innerHTML=options.map(function(o){return'<option value="'+o.value+'">'+o.name+"</option>"}).join("")}function saveValues(context,settings,settingsKey){userSettings.setFilter(settingsKey+"-sortorder",context.querySelector(".selectSortOrder").value),userSettings.setFilter(settingsKey+"-sortby",context.querySelector(".selectSortBy").value)}function SortMenu(){}return SortMenu.prototype.show=function(options){return new Promise(function(resolve,reject){require(["text!./sortmenu.template.html"],function(template){var dialogOptions={removeOnClose:!0,scrollY:!1};dialogOptions.size="fullscreen-border";var dlg=dialogHelper.createDialog(dialogOptions);dlg.classList.add("formDialog");var html="";html+='<div class="formDialogHeader">',html+='<button is="paper-icon-button-light" class="btnCancel hide-mouse-idle-tv" tabindex="-1"><i class="md-icon">&#xE5C4;</i></button>',html+='<h3 class="formDialogHeaderTitle">${Sort}</h3>',html+="</div>",html+=template,dlg.innerHTML=globalize.translateDocument(html,"sharedcomponents"),fillSortBy(dlg,options.sortOptions),initEditor(dlg,options.settings),dlg.querySelector(".btnCancel").addEventListener("click",function(){dialogHelper.close(dlg)}),layoutManager.tv&&centerFocus(dlg.querySelector(".formDialogContent"),!1,!0);var submitted;dlg.querySelector("form").addEventListener("change",function(){submitted=!0},!0),dialogHelper.open(dlg).then(function(){if(layoutManager.tv&&centerFocus(dlg.querySelector(".formDialogContent"),!1,!1),submitted)return saveValues(dlg,options.settings,options.settingsKey),void resolve();reject()})})})},SortMenu});