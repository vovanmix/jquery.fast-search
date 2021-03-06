/* ===========================================================
 * jquery.fast-search.js
 * v 1.0.4 April 05 2015
 * ===========================================================
 * Copyright 2015 Vladimir Mikhaylovskiy.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


var fastSearch = {
    templateSimple: '<div class="search_row"><a href="%link%" class="item-name">%text%</a></div>',
    templateText: '<div class="search_row"><a href="%link%" class="item-name">%text%</a><span class="search-comment">%comment%</span></div>',
    templateWithImageSimple: '<div class="search_row"><div class="item-left"><a href="%link%" class="item-image"><img width="%width%" height="%height%" src="%image%"/></a></div><div class="item-info"><a href="%link%" class="item-name">%text%</a></div><div class="clear clearfix"></div></div>',
    templateWithImage: '<div class="search_row"><div class="item-left"><a href="%link%" class="item-image"><img width="%width%" height="%height%" src="%image%"/></a></div><div class="item-info"><a href="%link%" class="item-name">%text%</a><span class="search-comment">%comment%</span></div><div class="clear clearfix"></div></div>'
};
(function($) {

    $.fn.fastSearch = function(options) {

        var settings = $.extend({
            url: '/',
            type: 'get',
            dataType: 'html', //json, jsonp
            parameterName: 'q',
            limit: 10,
            rowTemplate: fastSearch.templateSimple,
            onStart: function() {},
            onReady: function() {},
            processResult: function(data){return data;},
            processResultRow: function(dataRow){return dataRow;},
            cacheLifeTime: 600000 //default to 10 minutes
        }, options);

        var currentXhr = null;
        var fast_search_result;
        var fast_search_icon;
        var fast_search_container;
        var fast_search_box;
        var fast_search_form;

        var cache = {};

        var render = function(data){
            return template(settings.rowTemplate, data);
        };

        var template = function (template, data){
            if(data)
                return template.replace(/%(\w*)%/g,function(m,key){return data.hasOwnProperty(key)?data[key]:"";});
            else
                return '';
        };

        var search = function(e) {

            if(currentXhr)
                currentXhr.abort();

            var text = fast_search_box.val();

            if (text === '' || text.length < 1) {
                close();
                return;
            }

            settings.onStart(text);

            //fast_search_result.html('<div class="fast_search_loading"></div>');
            fast_search_icon.addClass("loading");
            //fast_search_result.fadeIn('fast');

            if(cache[text] && ($.now() - cache[text].time) < settings.cacheLifeTime ){
                resultRender(cache[text].data);
            }
            else {
                var requestData = {};
                requestData[settings.parameterName] = text;
                currentXhr = $.ajax({
                    url: settings.url,
                    type: settings.type,
                    data: requestData,
                    dataType: settings.dataType,
                    context: this,
                    success: function(data){
                        resultCallback(data, text);
                    }
                });
            }

        };

        var keyNavigation = function(e){
            var selected;
            var newSelected;
            switch(e.which){
                case 38://Up
                    selected = fast_search_result.find('>.selected');
                    if(selected.length){
                        newSelected = selected.prev();
                    }
                    else{
                        newSelected = fast_search_result.find('>*:first-child');
                    }
                    if(newSelected.length) {
                        selected.removeClass('selected');
                        newSelected.addClass('selected');

                        newSelected.find('a').each(function(){
                            var text = $(this).text().trim();
                            if(text != '')
                                fast_search_box.val(text);
                        });
                    }
                    break;
                case 40://Down
                    selected = fast_search_result.find('>.selected');
                    if(selected.length){
                        newSelected = selected.next();
                    }
                    else{
                        newSelected = fast_search_result.find('>*:first-child');
                    }
                    if(newSelected.length) {
                        selected.removeClass('selected');
                        newSelected.addClass('selected');

                        newSelected.find('a').each(function(){
                            var text = $(this).text().trim();
                            if(text != '')
                                fast_search_box.val(text);
                        });
                    }
                    break;
                case 13://Enter
                    submitForm();
                    break;
                default:
                    search(e);
                    break;
            }
        };

        var submitForm = function(){
            var selected = fast_search_result.find('>.selected');
            if(selected.length) {
                var links = selected.find('a');
                if(links.length) {
                    links.each(function () {
                        var href = $(this).attr('href');
                        if (href != '') {
                            window.location.href = href;
                        }
                    });
                    return false;
                }
            }
        };

        var resultCallback = function(data, text){
            var html = resultProcess(data);

            cache[text] = {
                data: html,
                time: $.now()
            };

            resultRender(html);
        };

        var resultProcess = function(data){
            var html = '';
            if(settings.dataType != 'html'){
                //settings.onRender(data);

                var convertedData = settings.processResult(data);
                convertedData = convertedData.slice(0, settings.limit);

                for(var row in convertedData){
                    if(convertedData.hasOwnProperty(row)) {
                        var convertedDataRow = settings.processResultRow(convertedData[row]);
                        html += render(convertedDataRow);
                    }
                }

            }
            else{
                html = data;
            }

            return html;
        };

        var resultRender = function(html){
            fast_search_icon.removeClass("loading");
            if (html !== '') {
                fast_search_result.html(html);
                fast_search_result.fadeIn('fast');
                fast_search_result.find('a').click(function(){
                    var text = $(this).text().trim();
                    if(text != '')
                        fast_search_box.val(text);
                });
            } else {
                fast_search_result.html("");
                fast_search_result.fadeOut('fast');
            }

            settings.onReady(html);
        };

        var close = function(){
            fast_search_icon.removeClass("loading");
            fast_search_result.fadeOut('fast');
        };

        //var focus = function(){
        //    var text = $(this).val();
        //    if(text != ''){
        //        $(this).trigger('keyup.fastSearch');
        //    }
        //};

        return this.each(function() {
            if($(this).attr('fastSearch') == 'true'){
                return;
            }
            $(this).attr('autocomplete', 'off');
            $(this).attr('fastSearch', 'true');
            $(this).wrap('<div class="fast_search_container"></div>');
            $(this).before('<i class="fast_search_icon"></i>');
            $(this).after('<div class="fast_search_result" style="display:none;"></div>');
            fast_search_box = $(this);
            fast_search_container = $(this).parent();
            fast_search_result = fast_search_container.find('.fast_search_result');
            fast_search_icon = fast_search_container.find('.fast_search_icon');
            fast_search_form = $(this).closest('form');
            //$(this).bind('keyup.fastSearch', search);
            //$(this).bind('blur.fastSearch', close);
            //$(this).bind('focus.fastSearch', focus);
            $(this).bind('keyup.fastSearch', keyNavigation);
            fast_search_form.bind('submit.fastSearch', submitForm);
        });

    };
})(jQuery);