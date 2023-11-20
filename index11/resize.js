jQuery.fn.allow_resize = function ( param = {} ) {

    $('<div class="resize_r"></div>' +
        '<div class="resize_b"></div>' +
        '<div class="resize_r resize_b"></div>').appendTo($(this)).bind('mousedown', function (de) {

        if( de.which !== 1 ) return false; // only left button

        let obj = $(this).parent();
        const oi = obj.getObjectInfo();

        let resize_type = 0;

        if( $(this).hasClass('resize_b') )
            resize_type |= 1;
        if( $(this).hasClass('resize_r') )
            resize_type |= 2;

        let parent_scale = 1;

        $(this).parents().each(function () {

            parent_scale *= $(this).getScale();
        });

        let newWidth = oi.width;
        let newHeight = oi.height;

        $(document).bind('mousemove', function (e) {

            let deltaX = (e.pageX - de.pageX) / parent_scale;
            let deltaY = (e.pageY - de.pageY) / parent_scale;

            if( !(resize_type & 1) )
                deltaY = 0;
            if( !(resize_type & 2) )
                deltaX = 0;

            newWidth = Math.max( 100, oi.width + deltaX );
            newHeight = Math.max( 100, oi.height + deltaY );

            $('div.linerX, div.linerY').remove();

            if( !$('body').hasClass('ctrl_pressed') ) {

                var needLinerX = false;
                var needLinerY = false;

                obj.siblings().not('#' + obj.attr('id') ).each(function () {

                    var li = $(this).getObjectInfo();

                    if( (resize_type & 1) && !needLinerX) {

                        let zahvatY = 10;
                        let linerX_Y;

                        if( li.top - zahvatY < oi.top + newHeight * oi.scale && li.top + zahvatY > oi.top + newHeight * oi.scale ) { // низ верх

                            needLinerX = true;
                            newHeight = ( li.top - oi.top ) / oi.scale;
                            linerX_Y = li.top;

                        } else if( li.top + li.height_scaled - zahvatY < oi.top + newHeight * oi.scale && li.top + li.height_scaled + zahvatY > oi.top + newHeight * oi.scale ) { // низ низ

                            needLinerX = true;
                            newHeight = ( li.top + li.height_scaled - oi.top ) / oi.scale;
                            linerX_Y = li.top + li.height_scaled;

                        } else if( li.top + ( li.height_scaled / 2 ) - zahvatY < oi.top + newHeight * oi.scale && li.top + ( li.height_scaled / 2 ) + zahvatY > oi.top + newHeight * oi.scale ) { // низ цент

                            needLinerX = true;
                            newHeight = ( li.top + ( li.height_scaled / 2 ) - oi.top ) / oi.scale;
                            linerX_Y = li.top + ( li.height_scaled / 2 );
                        }

                        if (needLinerX) { // Горизонтальная линия

                            let mi = Math.min( oi.left, li.left );
                            let ma = Math.max(li.left + li.width_scaled, oi.left + newWidth * oi.scale ) - mi + 60;

                            $('<div class="linerX"></div>').appendTo( $(this).parent() ).css('left', mi - 30).css('top', linerX_Y).css('width', ma);
                        }
                    }

                    if( (resize_type & 2) && !needLinerY) {

                        var zahvatX = 10;
                        var linerX_X;

                        if( li.left - zahvatX < oi.left + newWidth * oi.scale && li.left + zahvatX > oi.left + newWidth * oi.scale ) { // право лево

                            needLinerY = true;
                            newWidth = ( li.left - oi.left ) / oi.scale;
                            linerX_X = li.left;

                        } else if( li.left + li.width_scaled - zahvatX < oi.left + newWidth * oi.scale && li.left + li.width_scaled + zahvatX > oi.left + newWidth * oi.scale ) { // право право

                            needLinerY = true;
                            newWidth = ( li.left + li.width_scaled - oi.left ) / oi.scale;
                            linerX_X = li.left + li.width_scaled;

                        } else if( li.left + ( li.width_scaled / 2 ) - zahvatX < oi.left + newWidth * oi.scale && li.left + ( li.width_scaled / 2 ) + zahvatX > oi.left + newWidth * oi.scale ) { // право цент

                            needLinerY = true;
                            newWidth = ( li.left + ( li.width_scaled / 2 ) - oi.left ) / oi.scale;
                            linerX_X = li.left + ( li.width_scaled / 2 );
                        }

                        if (needLinerY) { // Вертикальная линия

                            let mi = Math.min( oi.top, li.top );
                            let ma = Math.max( li.top + li.height_scaled, oi.top + newHeight ) - mi + 60;

                            $('<div class="linerY"></div>').appendTo($(this).parent()).css('top', mi - 30).css('left', linerX_X).css('height', ma);
                        }
                    }

                    if( needLinerX && needLinerY )
                        return false;
                });
            }

            obj.css('width', newWidth + 'px').css('height', newHeight + 'px');
        });

        $(window).bind('mouseup', function () {

            $(document).unbind('mousemove');
            $(window).unbind('mouseup');

            $('div.linerX, div.linerY').remove();

            if (typeof param.resized === 'function') {

                obj.each(function () {

                    param.resized($(this));
                });
            }
        });

        return false;
    });

    return $(this);
}