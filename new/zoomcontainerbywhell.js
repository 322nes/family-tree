
$(function () {

    jQuery.fn.zoomContainerByWhell = function ( param ) {

        $(this).bind('mousewheel', function (e) {

            // noinspection JSUnresolvedVariable
            var delta = (e.originalEvent.deltaY || e.originalEvent.detail || e.originalEvent.wheelDelta) > 0 ? -0.1 : 0.1;

//            console.log(e);

            const obj = $(this);

//            console.log( obj.offset().left );


//            if( obj[0].tagName + '#' + obj[0].id !== e.target.tagName + '#' + e.target.id )
//                return false;

            var ooi = obj.getObjectInfo();
            var oi = obj.getObjectInfo();
            var pi = $(this).parent().getObjectInfo();

//            console.log( e.clientX + '!!!' + obj.offset().left + '!!! ' + oi.scale );

            var offsetX = ( e.pageX - obj.offset().left ) / oi.scale;
            var offsetY = ( e.pageY - obj.offset().top ) / oi.scale;

//            console.log( e.offsetX + '!!!' + offsetX );

            var clickX = ( offsetX / ooi.css_width ) * 100;
            var clickY = ( offsetY / ooi.css_height ) * 100;
/*
            if( oi.scale < 0.1 )
                delta /= 10;
            else if( oi.scale < 0.5 )
                delta /= 3;
*/

            if( $('body').hasClass('ctrl_pressed') )
                delta /= 10;

            oi.scale += delta;

            let new_val;

            if( ( param !== undefined && param.inside === true ) || ( oi.css_width * oi.scale >= pi.css_width && oi.css_height * oi.scale >= pi.css_height ) ) {

                new_val = oi.scale;

            } else {

                new_val = Math.max(pi.css_width / oi.css_width, pi.css_height / oi.css_height );
            }

            new_val = Math.min(5, Math.max(.01, new_val));

            console.log( 'SCALE ' + obj[0].tagName + '#' + obj[0].id + ' to ' + new_val )

            obj.css('transform', 'scale(' + new_val + ')')

            oi = obj.getObjectInfo();

//////////////////

            var sx = ( ooi.css_width_scaled / 100 * clickX ) - ( oi.css_width_scaled / 100 * clickX );
            var sy = ( ooi.css_height_scaled / 100 * clickY ) - ( oi.css_height_scaled / 100 * clickY );

            obj.css('left', oi.css_left + ( ooi.offsetX - oi.offsetX ) + sx ).css('top', oi.css_top + ( ooi.offsetY - oi.offsetY ) + sy );

            oi = obj.getObjectInfo();

//////////////////

            if (oi.offsetX >= pi.offsetX) {

                obj.css('left', oi.css_left + (pi.offsetX - oi.offsetX));

            } else {

                if (oi.offsetX + oi.css_width_scaled <= pi.offsetX + pi.css_width) {

                    obj.css('left', oi.css_left + ((pi.offsetX + pi.css_width) - (oi.offsetX + oi.css_width_scaled)));
                }
            }

            if (oi.offsetY >= pi.offsetY) {

                obj.css('top', oi.css_top + (pi.offsetY - oi.offsetY));

            } else {

                if (oi.offsetY + oi.css_height_scaled <= pi.offsetY + pi.css_height) {

                    obj.css('top', oi.css_top + ((pi.offsetY + pi.css_height) - (oi.offsetY + oi.css_height_scaled)));
                }
            }

            return false;
        });

        return $(this);
    }
});
