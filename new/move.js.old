$(function (){

    jQuery.fn.allow_move = function ( param ) {

        $(this).bind('mousedown', function (de) {

            if( $('body').hasClass('shift_pressed') ) return false;

            if( de.which !== 1 ) return false; // left button

            let mdwobj = $(this);
            let mdwobj_id = $(this).attr('id');

            var pi = $(this).parent().getObjectInfo();

            var oobjs = "";
            var obbj = [];

            function sel_all_to_move( val ) {

                if( val === undefined )
                    return false;

                obbj[ val ] = $('#' + val).getObjectInfo();

                if( oobjs.length )
                    oobjs += ', ';

                oobjs += '#' + val;

                if( val === 'main')
                    return true;

                $('[grp="' + val + '"]').each(function () {

                    obbj[ $(this)[0].id ] = $(this).getObjectInfo();

                    sel_all_to_move( $(this)[0].id );
                });
            }

            if( $(this).hasClass('selected') ) {

                $('.allow_select.selected.allow_move', $(this).parent()).each(function () {

                    sel_all_to_move( $(this)[0].id );
                });

            } else {

                sel_all_to_move( $(this)[0].id );
            }

            var oobj = $(oobjs);

            var move_started = false, moved = false;

            $(document).bind('mousemove', function (e) {

                $('.divEditBlock').fadeOut( 150 );

                var diffX = ( e.pageX - de.pageX ) / pi.scale;
                var diffY = ( e.pageY - de.pageY ) / pi.scale;

                var oi = obbj[ mdwobj_id ];

                if( !('allow_out' in param) || param.allow_out == false ) {

                    if (oi.css_width_scaled >= pi.css_width) {

                        if (oi.offsetX + diffX > pi.offsetX)
                            diffX = pi.offsetX - oi.offsetX;

                        if ((oi.offsetX + oi.css_width_scaled) + diffX < pi.offsetX + pi.css_width)
                            diffX = (pi.offsetX + pi.css_width) - (oi.offsetX + oi.css_width_scaled);

                    } else {

                        if (oi.css_left + diffX < 0)
                            diffX = -oi.css_left;

                        if (oi.css_left + oi.css_width_scaled + diffX > pi.css_width)
                            diffX = pi.css_width - (oi.css_left + oi.css_width_scaled);
                    }

                    if (oi.css_height_scaled >= pi.css_height) {

                        if (oi.offsetY + diffY > pi.offsetY)
                            diffY = pi.offsetY - oi.offsetY;

                        if (oi.offsetY + oi.css_height_scaled + diffY < pi.offsetY + pi.css_height)
                            diffY = (pi.offsetY + pi.css_height) - (oi.offsetY + oi.css_height_scaled);

                    } else {

                        if (oi.css_top + diffY < 0)
                            diffY = -oi.css_top;

                        if (oi.css_top + oi.css_height_scaled + diffY > pi.css_height)
                            diffY = pi.css_height - (oi.css_top + oi.css_height_scaled);
                    }
                }

                diffX = parseInt( diffX );
                diffY = parseInt( diffY );

                $('div.linerX, div.linerY').remove();

                if( !$('body').hasClass('ctrl_pressed') ) {

                    var needLinerX = false;
                    var needLinerY = false;

                    oi = obbj[mdwobj_id];

                    mdwobj.siblings().filter('.obj, .grp').not('#' + mdwobj_id + ', [grp="' + mdwobj_id + '"]' + (mdwobj.hasClass('selected') ? ', .selected1' : '')).each(function () {

                        var li = $(this).getObjectInfo();

                        if (!needLinerX) {

                            var zahvatY = 10;
                            var linerX_Y;

                            if (li.css_top - zahvatY < diffY + oi.css_top && li.css_top + zahvatY > diffY + oi.css_top) { // верх верх ###

                                needLinerX = true;
                                diffY = li.css_top - oi.css_top;

                                linerX_Y = li.css_top;

                            } else if (li.css_top_scaled_center - zahvatY < diffY + oi.css_top_scaled_center &&
                                        li.css_top_scaled_center + zahvatY > diffY + oi.css_top_scaled_center) { // центр цент

                                needLinerX = true;
                                diffY = li.css_top_scaled_center - oi.css_top_scaled_center;

                                linerX_Y = li.css_top_scaled_center;

                            } else if (li.css_bottom_scaled - zahvatY < diffY + oi.css_top && li.css_bottom_scaled + zahvatY > diffY + oi.css_top) { // верх низ

                                needLinerX = true;
                                diffY = li.css_bottom_scaled - oi.css_top;

                                linerX_Y = li.css_bottom_scaled;

                            } else if (li.css_top - zahvatY < diffY + oi.css_bottom_scaled && li.css_top + zahvatY > diffY + oi.css_bottom_scaled) { // низ верх

                                needLinerX = true;
                                diffY = li.css_top - oi.css_bottom_scaled;

                                linerX_Y = li.css_top;

                            } else if (li.css_bottom_scaled - zahvatY < diffY + oi.css_bottom_scaled && li.css_bottom_scaled + zahvatY > diffY + oi.css_bottom_scaled) { // низ низ

                                needLinerX = true;
                                diffY = li.css_bottom_scaled - oi.css_bottom_scaled;

                                linerX_Y = li.css_bottom_scaled;
                            }

                            if (needLinerX) {

                                var mi = Math.min(oi.css_left + diffX, li.css_left);
                                var ma = Math.max(li.css_right_scaled, oi.css_right_scaled + diffX) - mi + 60;

                                $('<div class="linerX"></div>').appendTo($(this).parent()).css('left', mi - 30).css('top', linerX_Y).css('width', ma);
                            }
                        }

                        if (!needLinerY) {

                            var zahvatX = 10;
                            var linerX_X;

                            if (li.css_left - zahvatX < diffX + oi.css_left && li.css_left + zahvatX > diffX + oi.css_left) { // Лево лево

                                needLinerY = true;
                                diffX = li.css_left - oi.css_left;

                                linerX_X = li.css_left;

                            } else if (li.css_left_scaled_centr - zahvatX < diffX + oi.css_left_scaled_centr && li.css_left_scaled_centr + zahvatX > diffX + oi.css_left_scaled_centr) { // центр цент

                                needLinerY = true;
                                diffX = li.css_left_scaled_centr - oi.css_left_scaled_centr;

                                linerX_X = li.css_left_scaled_centr;

                            } else if (li.css_right_scaled - zahvatX < diffX + oi.css_left && li.css_right_scaled + zahvatX > diffX + oi.css_left) { // лево право

                                needLinerY = true;
                                diffX = li.css_right_scaled - oi.css_left;

                                linerX_X = li.css_right_scaled;

                            } else if (li.css_left - zahvatX < diffX + oi.css_right_scaled && li.css_left + zahvatX > diffX + oi.css_right_scaled) { // право лево

                                needLinerY = true;
                                diffX = li.css_left - oi.css_right_scaled;

                                linerX_X = li.css_left;

                            } else if (li.css_right_scaled - zahvatX < diffX + oi.css_right_scaled && li.css_right_scaled + zahvatX > diffX + oi.css_right_scaled) { // право право

                                needLinerY = true;
                                diffX = li.css_right_scaled - oi.css_right_scaled;

                                linerX_X = li.css_right_scaled;
                            }

                            if (needLinerY) {

                                mi = Math.min(oi.css_top + diffY, li.css_top);
                                ma = Math.max(li.css_bottom_scaled, oi.css_bottom_scaled + diffY) - mi + 60;

                                $('<div class="linerY"></div>').appendTo($(this).parent()).css('top', mi - 30).css('left', linerX_X).css('height', ma);
                            }
                        }

                        if (needLinerX && needLinerY)
                            return false;
                    });
                }

                $( oobj ).each(function (){

                    var oi = obbj[ $(this)[0].id ];

                    $('.inserting_object').removeClass('inserting_object');
                    $('.inserting_object_sel').removeClass('inserting_object_sel');

                    $('.allow_insert').not('#' + mdwobj_id + ', #main').each(function () {

                        toi = $(this).getObjectInfo();

                        if( toi.css_left < oi.css_left + oi.css_width_scaled / 2 + diffX && toi.css_right_scaled > oi.css_left + oi.css_width_scaled / 2 + diffX &&
                            toi.css_top < oi.css_top + oi.css_height_scaled / 2 + diffY && toi.css_bottom_scaled > oi.css_top + oi.css_height_scaled / 2 + diffY ) {

                            $(this).addClass('inserting_object');

                            if( $(this).attr('id') !== mdwobj.attr('grp') ) {

                                $(this).addClass('inserting_object_sel');
                            }

                            return false;
                        }
                    });

                    moved = true;

                    $(this).trigger('startmove', { moved: true });
//                    if( !move_started && param !== undefined && typeof param.start === 'function' ) param.start( $(this) );

                    $(this).css('left', oi.css_left + diffX ).css('top', oi.css_top + diffY );

                    $('canvas[of="' + $(this).attr('id') + '"], canvas[ot="' + $(this).attr('id') + '"]').repairLink();
                });

                move_started = moved;
            });

            $(window).bind('mouseup', function (e) {

                $('div.linerX, div.linerY').remove();

                if( move_started ) {

                    oobj.not('#multiSel').each(function () {

                        console.log( '== ' + oobj.length + ' ' + $(this).attr('id') + ' ' + param.end, param );

                        $(this).trigger('endmove', { moved: true });
//                        if ( param !== undefined && typeof param.end === 'function') param.end( $(this), true, $('.inserting_object').first().attr('id') );
                    });

                    mdwobj.attr('grp', $('.inserting_object').length ? $('.inserting_object').first().attr('id') : 'main' );
                }

                $('.inserting_object').removeClass('inserting_object');
                $('.inserting_object_sel').removeClass('inserting_object_sel');

                $('div.divEditBlock').correctDivEditPosition().fadeIn( 120 );

                $(document).unbind('mousemove');
                $(window).unbind('mouseup');
            });

            return false;
        });
    }
});