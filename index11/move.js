
jQuery.fn.allow_move = function ( param = {} ) {

    param.liner = objProp( param, 'liner', true );
    param.ctrl_obj = objProp( param, 'ctrl_obj', false);

    $( param.ctrl_obj !== false ? param.ctrl_obj : $(this) ).css({ position: 'absolute' });

    $(this).bind('mousedown', function ( de ) {

        if( de.which !== 1 ) return false; // only left button

        let mdwn_obj = $(this);

        let obj_move = param.ctrl_obj !== false ? $( param.ctrl_obj ) : mdwn_obj;

        let ooo = [];

        obj_move.each(function () {

            ooo[ $(this).attr('id') ] = $(this).getObjectInfo();
        });

        let parent_scale = 1;

        obj_move.first().parents().each(function () {

            parent_scale *= $(this).getScale();
        });

        let cntnr_oi = obj_move.first().parent().getObjectInfo();

        obj_move.each(function () {

            $('canvas[of="' + $(this).attr('id') + '"], canvas[ot="' + $(this).attr('id') + '"]').fadeOut( 250 );
        });

        $(document).bind('mousemove', function ( e ) {

            let diffX = ( e.pageX - de.pageX ) / parent_scale;
            let diffY = ( e.pageY - de.pageY ) / parent_scale;

            obj_move.each( function () {

                let obj_oi = ooo[ $(this).attr('id') ];

                let newLeft = obj_oi.left + diffX;
                let newTop = obj_oi.top + diffY;

                $('div.linerX, div.linerY').remove();

                if( param.liner && !$('body').hasClass('ctrl_pressed') ) {

                    let needLinerX = false;
                    let needLinerY = false;

                    obj_move.first().siblings().not( obj_move ).each(function () {

                        let li = $(this).getObjectInfo();

                        if (!needLinerY) {

                            let zahvatX = 10;
                            let linerX_X;

                            if ( li.left - zahvatX < newLeft && li.left + zahvatX > newLeft ) { // Лево лево

                                needLinerY = true;
                                newLeft = li.left;

                                linerX_X = li.left;

                            } else if( li.left + ( li.width_scaled / 2 ) - zahvatX < newLeft + ( obj_oi.width_scaled / 2 ) && li.left + ( li.width_scaled / 2 ) + zahvatX > newLeft + ( obj_oi.width_scaled / 2 ) ) { // центр цент

                                needLinerY = true;
                                newLeft = li.left + ( li.width_scaled / 2 ) - (obj_oi.width_scaled / 2);

                                linerX_X = li.left + ( li.width_scaled / 2 );

                            } else if( li.left + li.width_scaled - zahvatX < newLeft && li.left + li.width_scaled + zahvatX > newLeft) { // лево право

                                needLinerY = true;
                                newLeft = li.left + li.width_scaled;

                                linerX_X = li.left + li.width_scaled;

                            } else if( li.left - zahvatX < newLeft + obj_oi.width_scaled && li.left + zahvatX > newLeft + obj_oi.width_scaled ) { // право лево

                                needLinerY = true;
                                newLeft = li.left - obj_oi.width_scaled;

                                linerX_X = li.left;

                            } else if( li.left + li.width_scaled - zahvatX < newLeft + obj_oi.width_scaled && li.left + li.width_scaled + zahvatX > newLeft + obj_oi.width_scaled ) { // право право

                                needLinerY = true;
                                newLeft = li.left + li.width_scaled - obj_oi.width_scaled;

                                linerX_X = li.left + li.width_scaled;
                            }

                            if (needLinerY) { // Вертикальная линия

                                let mi = Math.min( newTop, li.top );
                                let ma = Math.max( li.top + li.height_scaled, newTop + obj_oi.height_scaled ) - mi + 60;

                                $('<div class="linerY"></div>').appendTo($(this).parent()).css('top', mi - 30).css('left', linerX_X).css('height', ma);
                            }
                        }

                        if (!needLinerX) {

                            let zahvatY = 10;
                            let linerX_Y;

                            if( li.top - zahvatY < newTop && li.top + zahvatY > newTop ) { // верх верх ###

                                needLinerX = true;
                                newTop = li.top;

                                linerX_Y = li.top;

                            } else if( li.top + ( li.height_scaled / 2 ) - zahvatY < newTop + ( obj_oi.height_scaled / 2 ) &&
                                li.top + ( li.height_scaled / 2 ) + zahvatY > newTop + ( obj_oi.height_scaled / 2 ) ) { // центр цент

                                needLinerX = true;
                                newTop = li.top + ( li.height_scaled / 2 ) - ( obj_oi.height_scaled / 2 );

                                linerX_Y = li.top + ( li.height_scaled / 2 );

                            } else if( li.top + li.height_scaled - zahvatY < newTop && li.top + li.height_scaled + zahvatY > newTop ) { // верх низ

                                needLinerX = true;
                                newTop = li.top + li.height_scaled;

                                linerX_Y = li.top + li.height_scaled;

                            } else if( li.top - zahvatY < newTop + obj_oi.height_scaled && li.top + zahvatY > newTop + obj_oi.height_scaled ) { // низ верх

                                needLinerX = true;
                                newTop = li.top - obj_oi.height_scaled;

                                linerX_Y = li.top;

                            } else if( li.top + li.height_scaled - zahvatY < newTop + obj_oi.height_scaled && li.top + li.height_scaled + zahvatY > newTop + obj_oi.height_scaled ) { // низ низ

                                needLinerX = true;
                                newTop = li.top + li.height_scaled - obj_oi.height_scaled;

                                linerX_Y = li.top + li.height_scaled;
                            }

                            if( needLinerX ) { // Горизонтальная линия

                                let mi = Math.min( newLeft, li.left );
                                let ma = Math.max(li.left + li.width_scaled, obj_move.getObjectInfo().left + obj_oi.width_scaled ) - mi + 60;

                                $('<div class="linerX"></div>').appendTo( $(this).parent() ).css('left', mi - 30).css('top', linerX_Y).css('width', ma);
                            }
                        }

                        if( needLinerX && needLinerY )
                            return false;
                    });
                }

                if ( $(this).hasClass('move_in_container') ) {

                    newLeft = Math.max(0, Math.min( cntnr_oi.width - ( obj_oi.width *  obj_oi.scale), newLeft));
                    newTop = Math.max(0, Math.min(cntnr_oi.height - ( obj_oi.height *  obj_oi.scale), newTop));
                }

                if( cntnr_oi.width - ( obj_oi.width *  obj_oi.scale) === newLeft || newLeft === 0 )
                    $('div.linerY').remove();

                if( cntnr_oi.height - ( obj_oi.height *  obj_oi.scale) === newTop || newTop === 0 )
                    $('div.linerX').remove();

                $(this).css({ left: newLeft, top: newTop });
            });
        });

        $(window).bind('mouseup', function () {

            $(document).unbind('mousemove');
            $(window).unbind('mouseup');

            $('div.linerX, div.linerY').remove();

            obj_move.each(function () {

                if( typeof param.moved === 'function' ) {

                    param.moved( $(this) );
                }

                $('canvas[of="' + $(this).attr('id') + '"], canvas[ot="' + $(this).attr('id') + '"]').repairLink();
            });
        });

        return false;
    });

    return $(this);
};
