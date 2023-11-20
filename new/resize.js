$(function () {

    jQuery.fn.resizer = function () {

        this.bind('mousedown', function (de) {

            var elm = $(this).parent();

            let elm_id = elm.attr('id');

            var oi = elm.getObjectInfo();
            var pi = elm.parent().getObjectInfo();

            var diffX = null;
            var diffY = null;

            $(document).bind('mousemove', function (e) {

                $('.divEditBlock').fadeOut( 150 );

                var deltaX = ( e.pageX - de.pageX ) / pi.scale;
                var deltaY = ( e.pageY - de.pageY ) / pi.scale;

                diffX = Math.min( $(elm).hasClass('grp') ? 2000 : 1500, Math.max(50, ( oi.css_width_scaled + deltaX ) / oi.scale ) );
                diffY = Math.min( $(elm).hasClass('grp') ? 2000 : 1500, Math.max(50, ( oi.css_height_scaled + deltaY ) / oi.scale ) );

////////////////////////////////////////

                $('div.linerX, div.linerY').remove();

                if( !$('body').hasClass('ctrl_pressed') ) {

                    var needLinerX = false;
                    var needLinerY = false;

                    elm.siblings().filter('.obj, .grp').not('#' + elm_id + ', [grp="' + elm_id + '"]' + (elm.hasClass('selected') ? ', .selected' : '')).each(function () {

                        var li = $(this).getObjectInfo();

                        if (!needLinerX) {

                            var zahvatY = 10;
                            var linerX_Y;

                            if( $(this).attr('id') === 'obj_14215957' )
                                console.log( 'za ' + li.css_top + ' ' + diffY + ' ' + oi.css_top + ' ' + ( diffY + oi.css_top ) );

                            if (li.css_top - zahvatY < ( diffY * oi.scale ) + oi.css_top && li.css_top + zahvatY > ( diffY * oi.scale ) + oi.css_top ) {

//                                console.log('низ верх');

                                needLinerX = true;
                                diffY = ( li.css_top - oi.css_top ) / oi.scale;

                                linerX_Y = li.css_top;

                            } else if (li.css_bottom_scaled - zahvatY < ( diffY * oi.scale ) + oi.css_top && li.css_bottom_scaled + zahvatY > ( diffY * oi.scale ) + oi.css_top) {

//                                console.log('низ низ');

                                needLinerX = true;
                                diffY = ( li.css_bottom_scaled - oi.css_top ) / oi.scale;

                                linerX_Y = li.css_bottom_scaled;

                            } else if (li.css_top_scaled_center - zahvatY < ( diffY * oi.scale ) + oi.css_top && li.css_top_scaled_center + zahvatY > ( diffY * oi.scale ) + oi.css_top) {

//                                console.log('низ цент');

                                needLinerX = true;
                                diffY = ( li.css_top_scaled_center - oi.css_top ) / oi.scale;

                                linerX_Y = li.css_top_scaled_center;
                            }

                            if (needLinerX) {

                                var mi = Math.min(oi.css_left, li.css_left) - 30;
                                var ma = Math.max(li.css_right_scaled, oi.css_left + diffX) - mi + 30;

                                $('<div class="linerX"></div>').appendTo($(this).parent()).css('left', mi).css('top', linerX_Y).css('width', ma);
                            }
                        }

                        if (!needLinerY) {

                            var zahvatX = 10;
                            var linerX_X;

                            if (li.css_left - zahvatX < ( diffX * oi.scale ) + oi.css_left && li.css_left + zahvatX > ( diffX * oi.scale ) + oi.css_left) {

//                                console.log('право лево');

                                needLinerY = true;
                                diffX = ( li.css_left - oi.css_left ) / oi.scale;

                                linerX_X = li.css_left;

                            } else if (li.css_right_scaled - zahvatX < ( diffX * oi.scale ) + oi.css_left && li.css_right_scaled + zahvatX > ( diffX * oi.scale ) + oi.css_left) {

//                                console.log('право право');

                                needLinerY = true;
                                diffX = ( li.css_right_scaled - oi.css_left ) / oi.scale;

                                linerX_X = li.css_right_scaled;

                            } else if (li.css_left_scaled_centr - zahvatX < ( diffX * oi.scale ) + oi.css_left && li.css_left_scaled_centr + zahvatX > ( diffX * oi.scale ) + oi.css_left) {

//                                console.log('право цент');

                                needLinerY = true;
                                diffX = ( li.css_left_scaled_centr - oi.css_left ) / oi.scale;

                                linerX_X = li.css_left_scaled_centr;
                            }

                            if (needLinerY) {

                                mi = Math.min(oi.css_top, li.css_top) - 30;
                                ma = Math.max( li.css_bottom_scaled, oi.css_top + diffY ) - mi + 30;

                                $('<div class="linerY"></div>').appendTo($(this).parent()).css('top', mi ).css('left', linerX_X).css('height', ma);
                            }
                        }

                        if (needLinerX && needLinerY)
                            return false;
                    });
                }

////////////////////////////////////////

                diffX = parseInt( diffX );
                diffY = parseInt( diffY );

                elm.css('width', diffX + 'px').css('height', diffY + 'px');

                $('canvas[of="' + elm.attr('id') + '"], canvas[ot="' + elm.attr('id') + '"]').repairLink();
            });

            $(document).bind('mouseup', function (e) {

                $(document).unbind('mousemove');
                $(document).unbind('mouseup');

                $('div.linerX, div.linerY').remove();

                elm.correctDivEditPosition().fadeIn( 120 );

                if( diffX !== null && diffY !== null ) {

                    $.ajax('upd_obj.php?id=' + elm.attr('id') + '&sx=' + diffX + '&sy=' + diffY);
                }
            });

            return false;
        });
    }
});