jQuery.fn.addDivEditor = function ( param ) {

    str = '';

    if( typeof param.button !== undefined ) {

        param.button.forEach(function ( val, key ) {

            switch( val ) {

                case 'upload': str += '<div class="upload" title="Загрузить фото"></div>'; break;
                case 'kadr': str += '<div class="kadr" title="Кадрирование фото"></div>'; break;
                case 'link': str += '<div class="linker" title="Добавить связь"></div>'; break;
                case 'placein': str += '<div class="placein" title="Переместить объект"></div>'; break;
                case 'front': str += '<div class="tofront" title="Переместить на передний план"></div>'; break;
                case 'back': str += '<div class="toback" title="Переместить на задний план"></div>'; break;
                case 'del': str += '<div class="deleter" title="Удалить объект"></div>'; break;

                default: {

                    str += val;

                } break;
            }
        });
    }

    obj = $('<div class="divEditBlockContainer"><div class="divEditBlock">' + str + '</div></div>').appendTo( $(this) ).fadeIn( 120 );

    $('.deleter').click( function (e) {

        $('.selected').each(function () {

            console.log('del ' + $(this).attr('id') + ' ***' );

            $(this).fadeOut( 120, function () {

                $(this).remove();
            });
        });

        return false;
    });

    $('.kadr').click( function (e) {

//        $(this).closest('.divEditBlockContainer').siblings('.fotoborder').fotoKadr();
        $(this).closest('.divEditBlockContainer').parent().fotoKadr();

        return false;
    });

    $('.linker').linker();

//        $('<div class="resizer" title="reSize"></div>').appendTo($(this));
//    $('.resizer').resizer();

    $('.tofront').click( function (e) {

//        e.preventDefault();

        alert('1');
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

        $( 'div.divEditBlockContainer', $(this) ).fadeOut( 120, function () {

            $(this).remove();
        });
    });

    return $(this);
}