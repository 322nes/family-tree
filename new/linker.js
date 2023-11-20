$(function () {

    jQuery.fn.toggleSelectLink = function () {

        if( $(this).hasClass('selected') )
            $(this).unselectLink();
        else
            $(this).selectLink();
    };

    jQuery.fn.selectLink = function () {

        $('canvas.link.selected').each(function () {

            $(this).unselectLink();
        });

        console.log( "SELECT Link: #" + $(this)[0].id );

        $(this).addClass('selected');

        $(this).addLinkEditor();

        if( typeof jQuery.fn.onSelectLink === 'function' )
            $(this).onSelectLink();
    };

    jQuery.fn.unselectAllLink = function () {

        $('canvas.link.selected').each(function () {

            $(this).unselectLink();
        });
    };

    jQuery.fn.unselectLink = function () {

        console.log( "UNSELECT Link: #" + $(this)[0].id );

        $(this).removeClass('selected');

        $(this).removeLinkEditor();

        if( typeof jQuery.fn.onUnSelectLink === 'function' )
            $(this).onUnSelectLink();
    };

    jQuery.fn.removeLinkEditor = function () {

        $('div.link_editor').remove();
    };

    jQuery.fn.addLinkEditor = function () {

        var ob = $(this).getObjectInfo();

        var lnk = $('<div class="link_editor"></div>').appendTo( $(this).parent() );

        lnk.css('left', ob.css_left_scaled + 3 ).css('top', ob.css_top_scaled + 3 ).width(ob.css_width_scaled - 6);

        $('<i class="far fa-trash-alt" title="Удалить"></i>').appendTo(lnk).click( function ( e ) {

//            console.log('!!!!');

            $.ajax('del_lnk.php?id=' + $('canvas.link.selected').attr('of') + '&ot=' + $('canvas.link.selected').attr('ot'));

            $('canvas.link.selected').remove();
            $(lnk).removeLinkEditor();

//            return false;
        });

        $('<i>&nbsp;</i>').appendTo(lnk);

        $('<i class="fas fa-long-arrow-alt-right" title="Соединение напрямую"></i>').appendTo(lnk).click( function ( e ) {

            $(this).changeLinkType(2);
        });

        $('<i class="fab fa-ravelry" title="Соединение кривой"></i>').appendTo(lnk).click( function ( e ) {

            $(this).changeLinkType(0);
        });

        $('<i class="fas fa-wave-square" title="Соединение лесенкой"></i>').appendTo(lnk).click( function ( e ) {

            $(this).changeLinkType(1);
        });
    };

    jQuery.fn.linker = function (func) {

        this.bind('mousedown', function (de) {

            var obj = $(this);

            var lineWidth = 2;
            var arcRadius = 4;

            console.log( lineWidth );

            var otsX = Math.max(6, arcRadius + lineWidth + 2 );
            var otsY = Math.max(6, arcRadius + lineWidth + 2 );

            var ccX = de.pageX - $(this).offset().left;
            var ccY = de.pageY - $(this).offset().top;

            $(document).bind('mousemove', function (e) {

                var diffX = e.pageX - de.pageX;
                var diffY = e.pageY - de.pageY;

                var sizeX = Math.abs(diffX) + (otsX * 2);
                var sizeY = Math.abs(diffY) + (otsY * 2);

                var posX = ccX - otsX;
                var posY = ccY - otsY;

                var spX = otsX, spY = otsY;
                var epX = sizeX - otsX, epY = sizeY - otsY;

                if (diffX <= 0) {

                    posX += diffX;
                    spX = sizeX - otsX;
                    epX = otsX;
                }

                if (diffY < 0) {

                    posY += diffY;
                    spY = sizeY - otsY;
                    epY = otsY;
                }

                $('canvas.linker').remove();

                var lnk = $('<canvas class="linker" of="' + obj.parent().attr('id') + '" width="' + sizeX + '" height="' + sizeY + '" style="width: ' + sizeX + 'px; height: ' + sizeY + 'px;"></canvas>').appendTo(obj.parent().parent().parent());

                lnk.offset({top: obj.offset().top + posY, left: obj.offset().left + posX});

                var ct = lnk[0].getContext('2d');

                ct.strokeStyle = "#8b6b1a";
                ct.fillStyle = 'white';
                ct.lineWidth = lineWidth;

                ct.beginPath();
                ct.moveTo(spX, spY);
                ct.lineTo(epX, epY);
                ct.stroke();

                ct.beginPath();
                ct.arc(spX, spY, arcRadius + 2, 0, 2 * Math.PI, false);
                ct.fill();
                ct.stroke();

                ct.beginPath();
                ct.arc(epX, epY, arcRadius, 0, 2 * Math.PI, false);
                ct.fill();
                ct.stroke();

                $('div.linked').removeClass('linked');

                obj.parent().parent().find('div.a_link').each(function () {

                    var oo = $(this).offset();
                    var ow = $(this)[0].getBoundingClientRect().width;
                    var oh = $(this)[0].getBoundingClientRect().height;

                    if( oo.left < e.pageX && oo.left + ow > e.pageX &&
                        oo.top < e.pageY && oo.top + oh > e.pageY &&
                        obj.parent().attr('id') !== $(this).attr('id') &&
                        $('canvas#' + obj.parent().attr('id') + '_' + $(this).attr('id')).length === 0) {

                        $(this).addClass('linked');

                        console.log($(this).attr('id'));

                        if( $(this).hasClass('obj') ) {

                            $('div.a_link.linked.grp').removeClass('linked');
                            return false;
                        }

//                        return !$(this).hasClass('obj');
                    }
                });
            });

            $(document).bind('mouseup', function (e) {

                $(document).unbind('mousemove');
                $(document).unbind('mouseup');

                $('div.a_link.linked').each(function () {

                    obj.parent().addLink($(this), 0, true);

                }).removeClass('linked');

                $('canvas.linker').remove();
            });

            return false;
        });
    }

    jQuery.fn.addLink = function ( obj, line_type, tobase ) {

        if( obj.length === 0 || $(this).length === 0 )
            return false;

        if( line_type === undefined ) {

            line_type = 0;

        } else {

            line_type = parseInt( line_type );
        }

        if( tobase === true ) {

            $.ajax( 'add_lnk.php?id=' + $(this).attr('id') + '&ot=' + obj.attr('id') + '&lt=' + line_type );
        }

        var cnt_name = $(this).attr('id') + '_' + obj.attr('id');

        const of = $(this).getObjectInfo();
        const ot = obj.getObjectInfo();

        var paddingX = 20;
        var paddingY = 20;

        var ctX = [ -1, -1 ];
        var ctY = [ -1, -1 ];

        var minWidth = 50;
        var minHeight = 50;

        var ofc = -1;
        var otc = -1;

        if( ot.css_top > of.css_bottom_scaled + minHeight ) {

            ofc = 3; // bottom

            ctX[ 0 ] = of.css_left_scaled_centr;
            ctY[ 0 ] = of.css_bottom_scaled;

        } else if( ot.css_right_scaled + minWidth < of.css_left ) {

            ofc = 4; // left

            ctX[ 0 ] = of.css_left;
            ctY[ 0 ] = of.css_top_scaled_center;

        } else if( ot.css_top_scaled_center < of.css_top ) {

            ofc = 1; // top

            ctX[ 0 ] = of.css_left_scaled_centr;
            ctY[ 0 ] = of.css_top;


        } else /* if( ot.css_left - minWidth > of.css_right_scaled ) */ {

            ofc = 2; // right

            ctX[ 0 ] = of.css_right_scaled;
            ctY[ 0 ] = of.css_top_scaled_center;

        }

        if( ot.css_top > of.css_bottom_scaled ) {

            otc = 1; // top

            ctX[ 1 ] = ot.css_left_scaled_centr;
            ctY[ 1 ] = ot.css_top;

        } else if( ot.css_right_scaled < of.css_left ) {

            otc = 2; // right

            ctX[ 1 ] = ot.css_right_scaled;
            ctY[ 1 ] = ot.css_top_scaled_center;

        } else if( ot.css_left > of.css_right_scaled ) {

            otc = 4; // left

            ctX[ 1 ] = ot.css_left;
            ctY[ 1 ] = ot.css_top_scaled_center;

        } else  /*if( ot.css_bottom_scaled < of.css_top )*/   {

            otc = 3; // bottom

            ctX[ 1 ] = ot.css_left_scaled_centr;
            ctY[ 1 ] = ot.css_bottom_scaled;
        }

        if( ctX[0] !== -1 && ctX[1] !== -1 ) {

            var tr = ( ot.css_left_scaled_centr < of.css_left_scaled_centr ? ' scaleX(-1)' : '' ) + ( ot.css_top_scaled_center < of.css_top_scaled_center ? ' scaleY(-1)' : '' );

            canvasSizeX = Math.abs(ctX[0] - ctX[1]) + (paddingX * 2);
            canvasSizeY = Math.abs(ctY[0] - ctY[1]) + (paddingY * 2);

            canvasPosX = Math.min(ctX[0], ctX[1]) - paddingX;
            canvasPosY = Math.min(ctY[0], ctY[1]) - paddingY;

            $('<canvas id="' + cnt_name + '" lt="' + line_type + '" class="link" of="' + $(this).attr('id') + '" ot="' + obj.attr('id') + '" width="' + parseInt(canvasSizeX) + '" height="' + parseInt(canvasSizeY) + '" style="left: ' + parseInt(canvasPosX) + 'px; top: ' + parseInt(canvasPosY) + 'px;' + ( tr.length ? ' transform:' + tr + ';' : '') + '" class="selecting"></canvas>').appendTo($(this).parent())
                .bind('click', function (me) {

                    $(this).toggleSelectLink();
                    $().unselectAll();

                    return false;
                });

            var ct = document.getElementById( cnt_name ).getContext('2d');

            ct.strokeStyle = "#105e96";
            ct.lineWidth = 2;
            ct.fillStyle = 'white';

            var pX = [ -1, -1 ];
            var pY = [ -1, -1 ];

            switch (ofc) {

                case 1:
                case 3: {

                    pX[0] = paddingX;
                    pY[0] = Math.min( Math.max( canvasSizeY - paddingY, 100), canvasSizeY * .7 );

                } break;

                case 2:
                case 4: {

                    pX[0] = Math.min(paddingX + paddingX + (canvasSizeY * 0.6), Math.max(paddingX + 100, canvasSizeX * .7));
                    pY[0] = paddingY;

                } break;
            }

            switch (otc) {

                case 1:
                case 3: {

                    pX[1] = canvasSizeX - paddingX;
                    pY[1] = Math.min( Math.max( canvasSizeY - paddingY, 100), canvasSizeY * .3 );

                } break;


                case 2:
                case 4: {

                    pX[1] = Math.max(canvasSizeX - (paddingX + paddingX) - (canvasSizeY * 0.6), Math.min(canvasSizeX - paddingX - 100, canvasSizeX * .3));
                    pY[1] = canvasSizeY - paddingY;

                } break;
            }

            var ex = canvasSizeX - paddingX - ( ( otc === 2 || otc === 4 ) ? 20 : 0 );
            var ey = canvasSizeY - paddingY - ( ( otc === 1 || otc === 3 ) ? 20 : 0 );

            if( ofc === 1 || ofc === 3 ) {

                ct.moveTo(paddingX - 5, paddingY);
                ct.lineTo(paddingX + 5,paddingY );

            } else {

                ct.moveTo(paddingX, paddingY - 5 );
                ct.lineTo(paddingX,paddingY + 5 );
            }

            ct.moveTo(paddingX, paddingY);
            ct.bezierCurveTo( pX[0], pY[0], pX[1], pY[1], ex, ey );

            if( otc === 1 || otc === 3 ) {

                ct.lineTo(canvasSizeX - paddingX,canvasSizeY - paddingY);

                ct.moveTo(canvasSizeX - paddingX, canvasSizeY - paddingY - 2 );
                ct.lineTo(canvasSizeX - paddingX - 4, canvasSizeY - paddingY - 15);
                ct.moveTo(canvasSizeX - paddingX, canvasSizeY - paddingY -2 );
                ct.lineTo(canvasSizeX - paddingX + 4, canvasSizeY - paddingY - 15);

            } else {

                ct.lineTo(canvasSizeX - paddingX,canvasSizeY - paddingY);

                ct.moveTo(canvasSizeX - paddingX - 2, canvasSizeY - paddingY);
                ct.lineTo(canvasSizeX - paddingX - 15, canvasSizeY - paddingY - 4);
                ct.moveTo(canvasSizeX - paddingX - 2, canvasSizeY - paddingY);
                ct.lineTo(canvasSizeX - paddingX - 15, canvasSizeY - paddingY + 4);

            }

            ct.stroke();
        }
    }

    jQuery.fn.changeLinkType = function ( type ) {

        $.ajax('upd_lnk.php?id=' + $('canvas.selected').attr('of') + '&ot=' + $('canvas.selected').attr('ot') + '&lt=' + type);

        $(this).removeLinkEditor();

        var id = $('canvas.link.selected').attr('id');

        console.log(id);

        $('canvas.link.selected').attr('lt', type).repairLink();

        $('#' + id).selectLink();

        return false;
    };

    jQuery.fn.repairLink = function () {

        $(this).each( function () {

            var iof = $(this).attr('of');
            var iot = $(this).attr('ot');
            var lt = $(this).attr('lt');

//            console.log('#' + $(this).attr('id')+ 'a');

            $(this).remove();

            $( '#' + iof ).addLink( $( '#' + iot ), lt );
        });
    }
});
