$(function () {

    jQuery.fn.allow_shift_select = function () {

        $(this).bind('mousedown', function (de) {

            if( de.which !== 1 ) return false; // left button

            if( !$('body').hasClass('shift_pressed') ) return false;

            let sc = $(this).getScale();

            console.log('ON shift select');

            let poX = [de.offsetX, de.offsetX];
            let poY = [de.offsetY, de.offsetY];

            $('<div class="shift_select"></div>').appendTo( $(this) ).css('left', poX[0]).css('top', poY[0]);

            $(document).bind('mousemove', function (e) {

                poX[1] = poX[0] - ( de.pageX - e.pageX ) / sc;
                poY[1] = poY[0] - ( de.pageY - e.pageY ) / sc;

                $('.shift_select').css('left', Math.min( poX[0], poX[1] ) ).css('top', Math.min( poY[0], poY[1] ) )
                    .css('width', Math.abs( poX[0] - poX[1] )).css('height', Math.abs( poY[0] - poY[1] ));
            });

            $(document).bind('mouseup', function () {

                $(document).unbind('mouseup');
                $(document).unbind('mousemove');

                poX = [ Math.min( poX[0], poX[1] ), Math.max( poX[0], poX[1] ) ];
                poY = [ Math.min( poY[0], poY[1] ), Math.max( poY[0], poY[1] ) ];

                let sel = $('.allow_select.selected');

                $('.obj').each(function () {

                    let oo = $(this).getObjectInfo();

                    if( poX[0] < oo.css_left && oo.css_left < poX[1] &&
                        poX[0] < oo.css_left + oo.css_width && oo.css_left + oo.css_width < poX[1] &&
                        poY[0] < oo.css_top && oo.css_top < poY[1] &&
                        poY[0] < oo.css_top + oo.css_height && oo.css_top + oo.css_height < poY[1] ) {

                        sel = sel === null ? $(this) : sel.add( $(this) );
                    }
                });

                $('.shift_select').remove();

                if( sel !== null ) {

                    sel.selectObj();

                    if( sel.length > 1 ) {

                        $(".obj").delDivEditor();
                        sel.multiSelectBlockAdd();

                    } else {

                        $('#supermain').multiSelectBlockRemove();
                    }
                }

                console.log('OFF shift select');
            });
        });

        return $(this);
    }
});
