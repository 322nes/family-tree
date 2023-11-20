$(function () {

    jQuery.fn.isSelected = function () {

        return $(this).hasClass('selected');
    }

    jQuery.fn.selectObj = function ( param ) {

        data = { multi: $(this).length > 1 };

        console.log( ' sel - ', $(this) );

        $(this).each(function () {

            $(this).trigger('selectObj', data );
        });
    }

    jQuery.fn.multiSelectBlockRemove = function () {

        $('.selectBlock').delDivEditor().remove();
    }

    jQuery.fn.multiSelectBlockAdd = function () {

        mai = $('#main').getObjectInfo();

        oX = mai['css_left'] * -1 ;
        oY = mai['css_top'] * -1;

        console.log( oX + ' & ' + oY );
        $(this).multiSelectBlockRemove();

        miX = [ 999999, -999999 ];
        miY = [ 999999, -999999 ];

        console.log( $(this) );

        $(this).not('#multiSel').each(function () {

            console.log( 'add+ ' + $(this).attr('id') );
            oo = $(this).getObjectInfo();

            miX[0] = Math.min(miX[0], oo.css_left);
            miX[1] = Math.max(miX[1], oo.css_right);

            miY[0] = Math.min(miY[0], oo.css_top);
            miY[1] = Math.max(miY[1], oo.css_bottom);
        });

        console.log( miX, miY );

        obj = $('<div id="multiSel" class="selectBlock allow_select selected allow_move" style="display: none;"></div>').appendTo( '#supermain' )
                    .css('left', ( miX[0] * mai.scale ) - 10 - oX )
                    .css('top', ( miY[0] * mai.scale ) - 10 - oY )
                    .css('width', Math.abs(miX[0] - miX[1] ) * mai.scale + 20 )
                    .css('height', Math.abs(miY[0] - miY[1]) * mai.scale + 20 ).fadeIn(150);

        obj.addDivEditor( { button: [ 'del' ] } );

        $('#multiSel.allow_move').allow_move( {});
    }

    jQuery.fn.allow_select = function ( param ) {

        $(this).bind('selectObj', function ( event, data ) {

            data = data === undefined ? {} : data;

            console.log( $(this).attr('id') + ' selectObj', data );

            $(this).addClass('selected');

            console.log( ' sel 0 ', data );

            if( data.multi === undefined || !data.multi ) {

                console.log(' sel 1');

                if (typeof param.selectObj === 'function') param.selectObj($(this));
            }

        }).bind('unselectObj', function ( event, data ) {

            data = data === undefined ? {} : data;

            console.log( $(this).attr('id') + ' unselectObj', data );

            $(this).removeClass('selected');

            if( data.multi === undefined || !data.multi ) {

                if (typeof param.unselectObj === 'function') param.unselectObj( $(this) );
            }

        }).bind('mousedown', function (de) {

            if( de.which !== 1 ) return false; // left button

            var obj = $(this);

            console.log( $(this).attr('id') + ' Click select' );

//            $().unselectAllLink();

            if( $(this)[0] === de.target || $( de.target, $(this)[0] ) ) {

                $(window).bind('mouseup', function (e) {

                    if (de.clientX === e.clientX && de.clientY === e.clientY) { // движения не было

                        const shift = $('body').hasClass('shift_pressed');

                        if ( !shift ) {

                            $('.allow_select.selected').trigger('unselectObj', { multi: true } );
                            $('#supermain').multiSelectBlockRemove();

//                            obj.trigger('unselect_other');
                        }

                        if( obj.isSelected() ) {

                            if( shift ) {

                                obj.trigger('unselectObj' );
                            }

                        } else {

                            if( $('.allow_select.selected').length === 0 ) {

                                obj.trigger('selectObj' );

                            } else {

                                $('.allow_select.selected').delDivEditor();

                                obj.trigger('selectObj', { multi: true } );

                                $('.allow_select.selected').multiSelectBlockAdd();
                            }
                        }
                    }

                    $(window).unbind('mouseup');

                    return false;
                });
            }

            return false;
        });
    };
});