jQuery.fn.zoomByWhell = function ( param = {} ) {

    param.zoom_object = objProp( param, 'zoom_object', '' );
    param.move = objProp( param, 'move', true );

    $(this).bind('mousewheel', function (e) {

        let delta = (e.originalEvent.deltaY || e.originalEvent.detail || e.originalEvent.wheelDelta) > 0 ? -1 : 1;

        let obj = param.zoom_object.length ? $( param.zoom_object ) : $(this);

        let oi = obj.getObjectInfo();

        if( $('body').hasClass('ctrl_pressed' ) )
            delta /= 10;

        if( oi.scale < 0.5 )
            delta *= 0.05;
        else if( oi.scale < 1 )
            delta *= 0.04;
        else
            delta *= 0.1;

        let scale_new_val = Math.min(5, Math.max(.01, oi.scale + delta ));

        console.log( 'SCALE ' + obj[0].tagName + '#' + obj[0].id + ' to ' + scale_new_val + ' by DELTA ' + delta );

        obj.css('transform', 'scale(' + scale_new_val + ')');

//////////////////////

        if( param.move ) {

            let sX = (((e.pageX - obj.offset().left) / oi.scale) - ((e.pageX - obj.offset().left) / scale_new_val)) * scale_new_val;
            let sY = (((e.pageY - obj.offset().top) / oi.scale) - ((e.pageY - obj.offset().top) / scale_new_val)) * scale_new_val;

            obj.css({ left: oi.left - sX, top: oi.top - sY });
        }

        return false;
    });

    return $(this);
}
