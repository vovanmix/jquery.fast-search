/* ===========================================================
 * jquery.fast-search.js
 * v 0.1 05 March 2014
 * ===========================================================
 * Copyright 2014 Vladimir Mikhailovsky.
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

    $.fn.fastSearch = function(options) {

        var settings = $.extend({
            url: '/',
			type: 'get',
			dataType: 'html',
            onStart: function() {},
            onReady: function() {}
        }, options);

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

                    if (data !== '') {
                        fast_search_result.html(data);
                    } else {
                        fast_search_result.fadeOut('fast');
                    }

                    settings.onReady(data);
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
            $(this).after("<div class='fast_search_result' style='display:none;'></div>");
            $(this).bind('keyup.fastSearch', search);
			$(this).bind('blur.fastSearch', close);
			$(this).bind('focus.fastSearch', focus);

        });

    };
})(jQuery);