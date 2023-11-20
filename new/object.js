function objProp( obj, key, def ) {

    if( obj === undefined )
        return def;

    if( key in obj )
        return obj[key];

    return def;
}

$(function () {

    jQuery.fn.getObjectInfo = function () {

        var obj = {};

        obj.scale = $(this).getScale();

        obj.css_left = parseInt( $(this).css("left") );
        obj.css_top = parseInt( $(this).css("top") );

        obj.css_width = parseInt( $(this).css("width") );
        obj.css_width_scaled = obj.css_width * obj.scale;
        obj.css_height = parseInt( $(this).css('height') );
        obj.css_height_scaled = obj.css_height * obj.scale;

        obj.offsetX = $(this).offset().left;
        obj.offsetY = $(this).offset().top;

        obj.scaledOtstupX = ( obj.css_width_scaled - obj.css_width ) / 2;
        obj.scaledOtstupY = ( obj.css_height_scaled - obj.css_height ) / 2;

        obj.css_left_scaled = obj.css_left - obj.scaledOtstupX;
        obj.css_left_scaled_centr = obj.css_left + ( obj.css_width_scaled / 2 );

        obj.css_top_scaled = obj.css_top - obj.scaledOtstupY;

        obj.css_top_center = obj.css_top + ( obj.css_height / 2 );
        obj.css_top_scaled_center = obj.css_top + ( obj.css_height_scaled / 2 );

        obj.css_right = obj.css_left + obj.css_width;
        obj.css_right_scaled = obj.css_left + obj.css_width_scaled;

        obj.css_bottom = obj.css_top + obj.css_height;
        obj.css_bottom_scaled = obj.css_top + obj.css_height_scaled;

        obj.height_scaled = obj.height * obj.scale;

        return obj;
    }

    jQuery.fn.getZIndex = function () {

        var zindex = $(this).css('z-index');

        if (zindex === undefined || zindex === 'auto') {

            zindex = 0;

        } else {

            zindex = parseInt(zindex);
        }

        return parseFloat( zindex );
    }

    jQuery.fn.getScale = function () {

        scale = 1;

        var tfm = $(this).css('transform');

        if (tfm !== undefined && tfm !== "none") {

            var values = tfm.split('(')[1];
            values = values.split(')')[0];
            values = values.split(',');

            scale = Math.sqrt(values[0] * values[0] + values[1] * values[1]);
        }

        return parseFloat( scale );
    }

    jQuery.fn.addObject = function (param) {

        cnt_obj = $(this);

        param.id = objProp(param, 'id', 'obj_' + Math.floor(Math.random() * Math.floor(50000000)));

        param.width = objProp(param, 'width', 100);
        param.height = objProp(param, 'height', 120);
        param.left = objProp(param, 'left', 0);
        param.top = objProp(param, 'top', 0);

        param.grp = objProp(param, 'grp', $(this).attr('id'));

        let obj_class = param.mainclass;

        if (typeof param.allow !== undefined) {

            param.allow.forEach(function (val, key) {

                obj_class += ' allow_' + val;
            });
        }

        let new_obj = $('<div id="' + param.id + '" class="' + obj_class + '"' +
            'grp="' + param.grp + '" style="' +
            'width: ' + param.width + 'px; ' +
            'height: ' + param.height + 'px;' +
            'left: ' + param.left + 'px;' +
            'top: ' + param.top + 'px;' +
            'display: none;">' + objProp(param, 'content', '') + '</div>').appendTo($(this));

        if (typeof param.eventFunc === 'function') param.eventFunc(new_obj, 'added');

        new_obj.bind('zindex', function (event, prm) {

            if (typeof param.eventFunc === 'function') param.eventFunc(new_obj, 'zindex', prm);
        });

        new_obj.bind('endmove', function (event, prm) {

            if (typeof param.eventFunc === 'function') param.eventFunc(new_obj, 'endMove', prm);
        });

        new_obj.bind('startmove', function (event, prm) {

            if (typeof param.eventFunc === 'function') param.eventFunc(new_obj, 'startMove', prm);
        });

        new_obj.bind('delete', function () {

            console.log( ' * ' + $(new_obj).attr('id') + ' * ');

            if (typeof param.eventFunc === 'function') param.eventFunc(new_obj, 'delete');
        });

        new_obj.bind('zindex', function (event, prm) {

            if (typeof param.eventFunc === 'function') param.eventFunc(new_obj, 'zindex', prm);
        });

        if (param.allow.includes('move')) {

            new_obj.allow_move( {} );/*{

                start: function (new_obj) {

                    if (typeof param.eventFunc === 'function') param.eventFunc(new_obj, 'startMove');

                }, end: function (new_obj, moved, to_grp) {

                    if (typeof param.eventFunc === 'function') param.eventFunc(new_obj, 'endMove', {moved: moved});
                }
            });*/
        }

        if (param.allow.includes('select')) {

            new_obj.allow_select({

                selectObj: function ( new_obj ) {

                    if (typeof param.eventFunc === 'function') param.eventFunc( new_obj, 'selectObj' );

                },

                selectMultiObj: function ( new_obj ) {

                    if (typeof param.eventFunc === 'function') param.eventFunc( new_obj, 'selectMultiObj' );

                },

                unselectObj: function ( new_obj ) {

                    if (typeof param.eventFunc === 'function') param.eventFunc( new_obj, 'unselectObj' );
                }
            });
        }

        if( !cnt_obj.hasClass('bind_unselect') ) {

            cnt_obj.addClass('bind_unselect' );

            cnt_obj.bind('mousedown', function (de) {

                console.log( '#' + $(this).attr('id') + ' Click parent unselect' );

                $(window).bind('mouseup', function (e) {

                    $(window).unbind('mouseup');

                    unsel = 0;

                    if (de.clientX === e.clientX && de.clientY === e.clientY && de.which === 1) { // движения не было and left button

                        $('.divEditBlock').each(function () {

                            $('#' + $(this).attr('toid') ).delDivEditor();
                        });

                        $('.selectBlock').fadeOut(150, function () { $(this).remove(); });

                        $('.allow_select.selected', cnt_obj).each(function () {

                            $(this).trigger("unselectObj", { multi: true } );

                            unsel++;
                        });
                    }

                    if( unsel > 0 ) {

                        cnt_obj.trigger('unselectAllObj' );
                    }
                });
            });
        }

        return new_obj;
    };

});