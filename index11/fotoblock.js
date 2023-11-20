jQuery.fn.fotoKadr = function ( param ) {

    if( $('.fotoborder', $(this)).css('overflow') === 'hidden' ) {

        $(this).fotoKadrStart();

    } else {

        $(this).fotoKadrEnd();
    }

}

jQuery.fn.fotoKadrStart = function ( param ) {

    console.log( 'aaa', $(this) );

    $( '.fotoborder', $(this) ).css({ overflow: 'visible' });

    $('<div id="fotoedit"><div></div></div>').appendTo( $(this) );

    $('.fotoimg img', $(this) ).allow_move({ liner: false, ctrl_obj: $('.fotoimg img', $(this) ) }).zoomByWhell({ move: false });

}

jQuery.fn.fotoKadrEnd = function ( param ) {

    $( '.fotoborder', $(this) ).css({overflow: 'hidden'});
    $('div#fotoedit').remove();

    $('.fotoimg img', $(this) ).unbind('mousedown').unbind('mousewheel');
}
