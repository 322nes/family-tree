$(function () {

    jQuery.fn.correctDivEditPosition = function () {

        $(this).each(function () {

            div = $('#' + $(this).attr('toid'));

            oo = div.offset();

            o = div.getObjectInfo();
            pi = div.parent().getObjectInfo();

            to = $(this).getObjectInfo();

            $(this).css('left', oo.left + (o.css_width_scaled * pi.scale / 2 - to.css_width / 2)).css('top', oo.top - to.css_height );
        });

        return $(this);
    }

    jQuery.fn.addDivEditor = function ( param ) {

        str = '';

        if( typeof param.button !== undefined ) {

            param.button.forEach(function ( val, key ) {

                switch( val ) {

                    case 'link': str += '<div class="linker" title="Добавить связь"></div>'; break;
                    case 'front': str += '<div class="tofront" title="Переместить на передний план"></div>'; break;
                    case 'back': str += '<div class="toback" title="Переместить на задний план"></div>'; break;
                    case 'del': str += '<div class="deleter" title="Удалить объект"></div>'; break;

                    default: {

                        str += val;

                    } break;
                }
            });
        }

        obj = $(  '<div toid="' + $(this).attr('id') + '" class="divEditBlock">' + str + '</div>').appendTo( $('#supermain') );
        obj.correctDivEditPosition().fadeIn( 120 );

        $('.deleter').click( function (e) {

            console.log( ' +++++ ' + $(this).parent().attr('toid') );

            if( $(this).parent().attr('toid') === "multiSel" ) {

                console.log( ' --- ', $('.allow_select.selected').length );

                $('.allow_select.selected').each(function () {

                    console.log('del ' + $(this).attr('id') + ' ***' );
                    $(this).trigger('delete');
                });

                $(this).parent().multiSelectBlockRemove();

            } else {

                $('#' + $(this).parent().attr('toid')).trigger('delete');
            }

            return false;
        });

//        $('<div class="linker" title="AddLink"></div>').appendTo($(this));
        $('.linker').linker();

//        $('<div class="resizer" title="reSize"></div>').appendTo($(this));
        $('.resizer').resizer();

        $('.tofront').click( function (e) {

            $( '#' + $(this).parent().attr('toid') ).trigger('zindex', '1' );
            return false;
        });

        $('.toback').click( function (e) {

            $( '#' + $(this).parent().attr('toid') ).trigger('zindex', '-1' );
            return false;
        });

        return obj;
    }

    jQuery.fn.delDivEditor = function () {

        $(this).each(function () {

            $( 'div[toid="' + $(this).attr('id') + '"]' ).fadeOut( 120, function () {

                $(this).remove();
            });
        });

        return $(this);
    };
});