define(["layoutManager","globalize","require","events","connectionManager","cardBuilder","appRouter","emby-scroller","emby-itemscontainer","emby-linkbutton"],function(layoutManager,globalize,require,events,connectionManager,cardBuilder,appRouter){"use strict";function loadSuggestions(instance,context,apiClient){var options={SortBy:"IsFavoriteOrLiked,Random",IncludeItemTypes:"Movie,Series,MusicArtist",Limit:20,Recursive:!0,ImageTypeLimit:0,EnableImages:!1,ParentId:instance.options.parentId};apiClient.getItems(apiClient.getCurrentUserId(),options).then(function(result){"suggestions"!==instance.mode&&(result.Items=[]);var html=result.Items.map(function(i){var href=appRouter.getRouteUrl(i),itemHtml='<div><a is="emby-linkbutton" class="button-link" style="display:inline-block;padding:.5em 1em;" href="'+href+'">';return itemHtml+=i.Name,itemHtml+="</a></div>"}).join(""),searchSuggestions=context.querySelector(".searchSuggestions");searchSuggestions.querySelector(".searchSuggestionsList").innerHTML=html,result.Items.length&&searchSuggestions.classList.remove("hide")})}function getSearchHints(instance,apiClient,query){if(!query.searchTerm)return Promise.resolve({SearchHints:[]});var allowSearch=!0,queryIncludeItemTypes=query.IncludeItemTypes;return"tvshows"===instance.options.collectionType?query.IncludeArtists?allowSearch=!1:"Movie"!==queryIncludeItemTypes&&"LiveTvProgram"!==queryIncludeItemTypes&&"MusicAlbum"!==queryIncludeItemTypes&&"Audio"!==queryIncludeItemTypes&&"Book"!==queryIncludeItemTypes&&"AudioBook"!==queryIncludeItemTypes&&"PhotoAlbum"!==queryIncludeItemTypes&&"Video"!==query.MediaTypes&&"Photo"!==query.MediaTypes||(allowSearch=!1):"movies"===instance.options.collectionType?query.IncludeArtists?allowSearch=!1:"Series"!==queryIncludeItemTypes&&"Episode"!==queryIncludeItemTypes&&"LiveTvProgram"!==queryIncludeItemTypes&&"MusicAlbum"!==queryIncludeItemTypes&&"Audio"!==queryIncludeItemTypes&&"Book"!==queryIncludeItemTypes&&"AudioBook"!==queryIncludeItemTypes&&"PhotoAlbum"!==queryIncludeItemTypes&&"Video"!==query.MediaTypes&&"Photo"!==query.MediaTypes||(allowSearch=!1):"music"===instance.options.collectionType?query.People?allowSearch=!1:"Series"!==queryIncludeItemTypes&&"Episode"!==queryIncludeItemTypes&&"LiveTvProgram"!==queryIncludeItemTypes&&"Movie"!==queryIncludeItemTypes||(allowSearch=!1):"livetv"===instance.options.collectionType&&(query.IncludeArtists||query.IncludePeople?allowSearch=!1:"Series"!==queryIncludeItemTypes&&"Episode"!==queryIncludeItemTypes&&"MusicAlbum"!==queryIncludeItemTypes&&"Audio"!==queryIncludeItemTypes&&"Book"!==queryIncludeItemTypes&&"AudioBook"!==queryIncludeItemTypes&&"PhotoAlbum"!==queryIncludeItemTypes&&"Movie"!==queryIncludeItemTypes&&"Video"!==query.MediaTypes&&"Photo"!==query.MediaTypes||(allowSearch=!1)),"NullType"===queryIncludeItemTypes&&(allowSearch=!1),allowSearch?apiClient.getSearchHints(query):Promise.resolve({SearchHints:[]})}function search(instance,apiClient,context,value){value||layoutManager.tv?(instance.mode="search",context.querySelector(".searchSuggestions").classList.add("hide")):(instance.mode="suggestions",loadSuggestions(instance,context,apiClient)),"livetv"===instance.options.collectionType?searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"LiveTvProgram",IsMovie:!0,IsKids:!1,IsNews:!1},context,".movieResults",{preferThumb:!0,inheritThumb:!1,shape:enableScrollX()?"overflowPortrait":"portrait",showParentTitleOrTitle:!0,showTitle:!1,centerText:!0,coverImage:!0,overlayText:!1,overlayMoreButton:!0,showAirTime:!0,showAirDateTime:!0,showChannelName:!0}):searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"Movie"},context,".movieResults",{showTitle:!0,overlayText:!1,centerText:!0,showYear:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"Series"},context,".seriesResults",{showTitle:!0,overlayText:!1,centerText:!0,showYear:!0}),"livetv"===instance.options.collectionType?searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"LiveTvProgram",IsSeries:!0,IsSports:!1,IsKids:!1,IsNews:!1},context,".episodeResults",{preferThumb:!0,inheritThumb:!1,shape:enableScrollX()?"overflowBackdrop":"backdrop",showParentTitleOrTitle:!0,showTitle:!1,centerText:!0,coverImage:!0,overlayText:!1,overlayMoreButton:!0,showAirTime:!0,showAirDateTime:!0,showChannelName:!0}):searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"Episode"},context,".episodeResults",{coverImage:!0,showTitle:!0,showParentTitle:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"livetv"===instance.options.collectionType?"LiveTvProgram":"NullType",IsSports:!0},context,".sportsResults",{preferThumb:!0,inheritThumb:!1,shape:enableScrollX()?"overflowBackdrop":"backdrop",showParentTitleOrTitle:!0,showTitle:!1,centerText:!0,coverImage:!0,overlayText:!1,overlayMoreButton:!0,showAirTime:!0,showAirDateTime:!0,showChannelName:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"livetv"===instance.options.collectionType?"LiveTvProgram":"NullType",IsKids:!0},context,".kidsResults",{preferThumb:!0,inheritThumb:!1,shape:enableScrollX()?"overflowBackdrop":"backdrop",showParentTitleOrTitle:!0,showTitle:!1,centerText:!0,coverImage:!0,overlayText:!1,overlayMoreButton:!0,showAirTime:!0,showAirDateTime:!0,showChannelName:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"livetv"===instance.options.collectionType?"LiveTvProgram":"NullType",IsNews:!0},context,".newsResults",{preferThumb:!0,inheritThumb:!1,shape:enableScrollX()?"overflowBackdrop":"backdrop",showParentTitleOrTitle:!0,showTitle:!1,centerText:!0,coverImage:!0,overlayText:!1,overlayMoreButton:!0,showAirTime:!0,showAirDateTime:!0,showChannelName:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"LiveTvProgram",IsMovie:"livetv"!==instance.options.collectionType&&null,IsSeries:"livetv"!==instance.options.collectionType&&null,IsSports:"livetv"!==instance.options.collectionType&&null,IsKids:"livetv"!==instance.options.collectionType&&null,IsNews:"livetv"!==instance.options.collectionType&&null},context,".programResults",{preferThumb:!0,inheritThumb:!1,shape:enableScrollX()?"overflowBackdrop":"backdrop",showParentTitleOrTitle:!0,showTitle:!1,centerText:!0,coverImage:!0,overlayText:!1,overlayMoreButton:!0,showAirTime:!0,showAirDateTime:!0,showChannelName:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,MediaTypes:"Video",ExcludeItemTypes:"Movie,Episode"},context,".videoResults",{showParentTitle:!0,showTitle:!0,overlayText:!1,centerText:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!0,IncludeMedia:!1,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1},context,".peopleResults",{coverImage:!0,showTitle:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!1,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!0},context,".artistResults",{coverImage:!0,showTitle:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"MusicAlbum"},context,".albumResults",{showParentTitle:!0,showTitle:!0,overlayText:!1,centerText:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"Audio"},context,".songResults",{showParentTitle:!0,showTitle:!0,overlayText:!1,centerText:!0,action:"play"}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,MediaTypes:"Photo"},context,".photoResults",{showParentTitle:!1,showTitle:!0,overlayText:!1,centerText:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"PhotoAlbum"},context,".photoAlbumResults",{showTitle:!0,overlayText:!1,centerText:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"Book"},context,".bookResults",{showTitle:!0,overlayText:!1,centerText:!0}),searchType(instance,apiClient,{searchTerm:value,IncludePeople:!1,IncludeMedia:!0,IncludeGenres:!1,IncludeStudios:!1,IncludeArtists:!1,IncludeItemTypes:"AudioBook"},context,".audioBookResults",{showTitle:!0,overlayText:!1,centerText:!0})}function searchType(instance,apiClient,query,context,section,cardOptions){query.UserId=apiClient.getCurrentUserId(),query.Limit=enableScrollX()?24:16,query.ParentId=instance.options.parentId,getSearchHints(instance,apiClient,query).then(function(result){populateResults(result,context,section,cardOptions)})}function populateResults(result,context,section,cardOptions){section=context.querySelector(section);var items=result.SearchHints,itemsContainer=section.querySelector(".itemsContainer");cardBuilder.buildCards(items,Object.assign({itemsContainer:itemsContainer,parentContainer:section,shape:enableScrollX()?"autooverflow":"auto",scalable:!0,overlayText:!1,centerText:!0,allowBottomPadding:!enableScrollX()},cardOptions||{})),section.querySelector(".emby-scroller").scrollToBeginning(!0)}function enableScrollX(){return!0}function replaceAll(originalString,strReplace,strWith){var reg=new RegExp(strReplace,"ig");return originalString.replace(reg,strWith)}function embed(elem,instance,options){require(["text!./searchresults.template.html"],function(template){enableScrollX()||(template=replaceAll(template,'data-horizontal="true"','data-horizontal="false"'),template=replaceAll(template,"itemsContainer scrollSlider","itemsContainer scrollSlider vertical-wrap"));var html=globalize.translateDocument(template,"sharedcomponents");elem.innerHTML=html,elem.classList.add("searchResults"),instance.search("")})}function SearchResults(options){this.options=options,embed(options.element,this,options)}return SearchResults.prototype.search=function(value){search(this,connectionManager.getApiClient(this.options.serverId),this.options.element,value)},SearchResults.prototype.destroy=function(){var options=this.options;options&&options.element.classList.remove("searchFields"),this.options=null},SearchResults});