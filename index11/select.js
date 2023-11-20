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

jQuery.fn.allow_select = function ( param = {} ) {

    $(this).bind('selectObj', function ( event, data ) {

        data = data === undefined ? {} : data;

        console.log( $(this).attr('id') + ' selectObj', data );

        $(this).addClass('selected');

        console.log( ' sel 0 ', data );

        if( data.multi === undefined || !data.multi ) {

            console.log(' sel 12');

            if (typeof param.selectObj === 'function') param.selectObj( $(this) );
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

        console.log( $(this).attr('id') + ' Click select', $(this), de.target );
        console.log( 'not', $( de.target, $(this)[0] ).length );

        if( $(de.target, $(this)[0]).closest('.divEditBlockContainer').length === 0 && /*$(this)[0] === de.target ||*/ $( de.target, $(this)[0] ).length ) {//.filter('.divEditBlockContainer')

            $(window).bind('mouseup', function (e) {

                if (de.clientX === e.clientX && de.clientY === e.clientY) { // движения не было

                    const shift = $('body').hasClass('shift_pressed');

                    if ( !shift ) {

                        $('.selected').trigger('unselectObj' );
                    }

                    if( obj.isSelected() ) {

                        obj.trigger('unselectObj' );

                    } else {

                        obj.trigger('selectObj' );
                    }
                }

                $(window).unbind('mouseup');

                return false;
            });
        }

        return false;

    }).parents().bind('mousedown', function (de) {

        if( de.which !== 1 ) return false; // left button

        console.log( $(this).attr('id') + ' Click select' );

        if( $(this)[0] === de.target || $( de.target, $(this)[0] ) ) {

            $(window).bind('mouseup', function (e) {

                if (de.clientX === e.clientX && de.clientY === e.clientY) { // движения не было

                    $('.selected').trigger('unselectObj' );
                }

                $(window).unbind('mouseup');

                return false;
            });
        }

//        return false;
    });

    return $(this);
}