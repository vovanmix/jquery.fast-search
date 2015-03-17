/* ===========================================================
 * jquery.fast-search.js
 * v 0.1 05 March 2014
 * ===========================================================
 * Copyright 2014 Vladimir Mikhaylovskiy.
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

(function($) {

	var fastSearch = {
		templateSimple: '<div class="search_row"><a href="%link%" class="item-name">%text%</a></div>',
		templateText: '<div class="search_row"><a href="%link%" class="item-name">%text%</a><span class="search-comment">%comment%</span></div>',
		templateWithImageSimple: '<div class="search_row"><div class="item-left"><a href="%link%" class="item-image"><img width="%width%" height="%height%" src="%image%"/></a></div><div class="item-info"><a href="%link%" class="item-name">%text%</a></div></div>',
		templateWithImage: '<div class="search_row"><div class="item-left"><a href="%link%" class="item-image"><img width="%width%" height="%height%" src="%image%"/></a></div><div class="item-info"><a href="%link%" class="item-name">%text%</a><span class="search-comment">%comment%</span></div></div>'
	};

    $.fn.fastSearch = function(options) {

        var settings = $.extend({
            url: '/',
			type: 'get',
			dataType: 'html',
			rowTemplate: fastSearch.templateSimple,
            onStart: function() {},
            onReady: function() {},
			processResult: function(data){return data;},
			processResultRow: function(dataRow){return dataRow;}
        }, options);

		var render = function(data){
			return template(settings.rowTemplate, data);
		};

		var template = function (template, data){
			return template.replace(/%(\w*)%/g,function(m,key){return data.hasOwnProperty(key)?data[key]:"";});
		};

        var search = function(e) {

            var text = $(this).val();

			var fast_search_result = $(this).parent().find('.fast_search_result');

            if (text === '') {
                fast_search_result.fadeOut('fast');
                return;
            }

            settings.onStart(text);
			
            fast_search_result.prepend('<div class="fast_search_loading"></p>');
            fast_search_result.fadeIn('fast');

            $.ajax({
                url: settings.url,
                type: settings.type,
                data: {
                    'q': text
                },
                dataType: settings.dataType,
                context: this,
                success: function(data) {

					var html = '';
					if(settings.dataType == 'json'){
						//settings.onRender(data);

						var convertedData = settings.processResult(data);

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


                    if (html !== '') {
                        fast_search_result.html(html);
                    } else {
                        fast_search_result.fadeOut('fast');
                    }

					settings.onReady(html);

                }
            });

        };

		var close = function(){
			var fast_search_result = $(this).parent().find('.fast_search_result');
			fast_search_result.fadeOut('fast');
		};

		var focus = function(){
			var text = $(this).val();
			if(text != ''){
				$(this).trigger('keyup.fastSearch');
			}
		};

        return this.each(function() {
			if($(this).attr('fastSearch') == 'true'){
				return;
			}
            $(this).attr('autocomplete', 'off');
            $(this).attr('fastSearch', 'true');
            $(this).after('<div class="fast_search_result" style="display:none;"></div>');
            $(this).bind('keyup.fastSearch', search);
			$(this).bind('blur.fastSearch', close);
			$(this).bind('focus.fastSearch', focus);

        });

    };
})(jQuery);