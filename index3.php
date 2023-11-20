<?

require_once("error_handler.php");
require_once("autloader_class.php");

$prj = $_REQUEST['a'] ?? 6;

?>
<link href="fontawesome/css/all.css" rel="stylesheet">
<script type="text/javascript" src="../jquery-3.4.1.js"></script>
<script type="text/javascript" src="new/select.js"></script>
<script type="text/javascript" src="new/move.js"></script>
<script type="text/javascript" src="new/divEditor.js"></script>
<script type="text/javascript" src="new/zoomcontainerbywhell.js"></script>
<script type="text/javascript" src="new/resize.js"></script>
<script type="text/javascript" src="new/key_control.js"></script>
<script type="text/javascript" src="new/linker.js"></script>
<script type="text/javascript" src="new/shift_select.js"></script>
<script type="text/javascript" src="new/object.js"></script>
<script type="text/javascript" src="new/foto.js"></script>
<link href="style3.css" rel="stylesheet">
<link href="new/diveditor.css" rel="stylesheet">
<link href="new/select.css" rel="stylesheet">
<link href="new/linker.css" rel="stylesheet">
<link href="new/move.css" rel="stylesheet">
<link href="new/shift_select.css" rel="stylesheet">
<link href="new/foto.css" rel="stylesheet">

<div style="position: relative; left: 0; top: 0;">
    <div id="supermain">
        <div id="addNewObject" title="addNewObject" class="addNewObject" style="cursor: pointer;"></div>
        <div id="addNewContainer" title="addNewContainer" class="addNewContainer" style="cursor: pointer;"></div>
        <div id="main" class="allow_move allow_multiselect allow_insert" style="transform-origin: top left">main move multisel
        </div>
    </div>
</div>

<script>

    $(function () {

        $('#main').allow_shift_select().zoomContainerByWhell().allow_move( {

            start: function( obj ) {

                console.log( 'MOVEstart ' + obj[0].tagName + '#' + obj[0].id );

            }, end: function ( obj, moved ) {

                console.log( 'MOVEend ' + obj[0].tagName + '#' + obj[0].id + ( moved ? ' !moved! ' : ' !not_moved! ' ) );
            }
        });

/*
        jQuery.fn.old_addNewDIVObject = jQuery.fn.addNewDIVObject;
        jQuery.fn.addNewDIVObject = function ( param, content, add_to_base = false ) {

            if( $(this).attr('id') !== "main" ) {

                if (add_to_base) {

                    col = $('div.obj[grp="' + $(this).attr("id") + '"]').length;

                    oi = $(this).getObjectInfo();

                    if (col === 0) {

                        param.left = oi.css_left + 23;

                    } else {

                        param.left = oi.css_left + 194;
                    }

                    param.top = oi.css_top + 78;
                }
            }
*/

    <?

        $res = my::query("select * from obj where prj = $prj order by cont = '#main' desc");

        $a = 1;

        $uge = [];

        while( $rw = my::fetchArray($res) ) {

            $px = $rw['px'];
            $py = $rw['py'];

/*            if( $rw['tip'] == 1 && $rw['cont'] != "#main" ) {

                $py = 50;

                if( isset( $uge[ $rw['cont'] ] ) ) {

                    $px = 185;

                } else {

                    $px = 30;
                    $uge[ $rw['cont'] ] = true;
                }
            }
*/
            ?> $('<?= $rw['cont'] ?>').addObjectFoto({ id: '<?= $rw['id'] ?>', tip: <?= $rw['tip'] ?>, left: <?= $px ?>, top: <?= $py ?>, width: <?= $rw['sx'] ?>, height: <?= $rw['sy'] ?>, foto: <?= $rw['data'] ?? '{}' ?> }); <?

            $a++;
        }

        $res = my::query("select * from lnk where prj = $prj order by id");

        while( $rw = my::fetchArray($res) ) {

            ?>$('#<?= $rw['id'] ?>').addLink($('#<?= $rw['ot'] ?>'), <?= $rw['lt'] ?>);<?
        }

        ?>

        jQuery.fn.onSelectLink = function () {

        };

        jQuery.fn.onUnSelectLink = function () {

        };

        $('#main').bind('mousedown', function (de) {

            if( de.which !== 1 ) return false; // left button

            if( de.target.id === "main" ) {

                $('canvas.link.selected').each(function () {

                    $(this).unselectLink();
                });

                return false;
            }
        });
    });

    $('#addNewObject').click( function (e) {

        $('#main').addObjectFoto({

                left: $('#main').getObjectInfo()['css_left'] / -$('#main').getScale(),
                top: $('#main').getObjectInfo()['css_top'] / -$('#main').getScale(),
                addToBase: true,
                tip: 1
        });
    });

    $('#addNewContainer').click( function (e) {

        $('#main').addObjectFoto({

                left: $('#main').getObjectInfo()['css_left'] / -$('#main').getScale(),
                top: $('#main').getObjectInfo()['css_top'] / -$('#main').getScale(),
                addToBase: true,
                tip: 2
        });
    });

    jQuery.fn.addObjectFoto = function ( param ) {

        param = $.extend({

            id: objProp(param, 'id', 'obj_' + Math.floor(Math.random() * Math.floor(50000000))),

            mainclass: param.tip === 1 ? 'obj' : 'grp',

            width: param.tip === 1 ? '150' : '370',
            height: param.tip === 1 ? '210' : '310',

            allow: [ 'move', 'select', 'del', 'resize', 'link' ],
            eventFunc: function ( obj, event, dop ) {

                console.log( '#' + obj.attr('id') + ' ' + event, dop !== undefined ? dop : '' );

                oi = obj.getObjectInfo();

                if( event === 'added' && param.addToBase === true ) {

                    $.ajax('add_obj.php?id=' + obj.attr('id') + '&sx=' + oi.css_width + '&sy=' + oi.css_height + '&px=' + oi.css_left + '&py=' + oi.css_top + '&tip=' + param.tip + '&cont=%23' + $(this).attr('grp'));

                } else if( event === 'endMove' ) {

                    $.ajax('upd_obj.php?id=' + obj.attr('id') + '&px=' + oi.css_left + '&py=' + oi.css_top + '&to_grp=%23' + $(this).attr('grp') );

                } else if( event === 'selectMultiObj' ) {

                } else if( event === 'selectObj' ) {

                    console.log( $('.selected').length );

                    if( $('.selected').length == 1 ) {

                        $('.obj, .grp').delDivEditor();

                        button = ['link', 'front', 'back', 'del'];

                        if (param.tip === 1) {

                            cccl = $('.foto img', obj).length === 0 ? 'btnDisable' : '';

                            button.unshift('<div class="upload" title="Загрузить фото"></div>', '<div class="kadr ' + cccl + '" title="Кадрирование фото"></div>');

                        } else {

                            button.unshift('<div class="addobj" title="Add Object"></div>');
                        }

                        obj.addDivEditor({button: button});

                        obj.allowFotoUploadKadr();

                    } else {

                        $('.obj, .grp').delDivEditor();

                        button = [ 'del' ];

                        obj.addDivEditor({button: button});
                    }

                } else if( event === 'unselectObj' ) {

                    obj.delDivEditor();

                } else if( event === 'zindex' ) {


                } else if( event === 'delete' ) {

                    console.log( 'delete index3 ' + obj.attr('id') );

                    $.ajax( 'del_obj.php?obj=' + obj.attr('id') );

                    obj.delDivEditor();

                    $( 'canvas[ot=' + obj.attr('id') + '], canvas[of=' + obj.attr('id') + ']' ).add(obj).fadeOut( 150, function () {

                        $(this).remove();
                    });
                }
            }

        }, param);

        if( param.tip === 1 ) {

            param.content = '<div class="objdiv"><div id="fk_' + param.id + '" class="obj foto allow_move" style="';

            param.content += objProp(param.foto, 'left', 0 ) !== 0 ? 'left: ' + param.foto.left + 'px; ' : '';
            param.content += objProp(param.foto, 'top', 0 ) !== 0 ? 'top: ' + param.foto.top + 'px; ' : '';
            param.content += objProp(param.foto, 'scale', 0 ) !== 0 ? 'transform: scale(' + param.foto.scale + '); ' : '';

            param.content += '">';

            if( typeof param.foto !== 'undefined' && typeof param.foto.img !== 'undefined' && param.foto.img !== null && param.foto.img.length > 0 ) {

                param.content += '<img src="' + param.foto.img + '">';
            }

            param.content += '</div></div>';

            param.content += '<div class="fio">' + objProp( param.foto, 'fio', '') + '</div>';

//            console.log(param.content);

        } else {

            param.content = '<div class="grpdiv"></div>';
        }

        obj = $(this).addObject( param ).fadeIn( 150 );

        return obj;
    }

/*    $('div#main').bind('unselectAllObj', function () {

        alert('unselected all');
    });*/

</script>