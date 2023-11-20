<script type="text/javascript" src="../jquery-3.4.1.js"></script>

<script type="text/javascript" src="index11/object.js"></script>
<script type="text/javascript" src="index11/move.js"></script>
<script type="text/javascript" src="index11/resize.js"></script>
<script type="text/javascript" src="index11/select.js"></script>
<script type="text/javascript" src="index11/zoombywhell.js"></script>

<script type="text/javascript" src="index11/diveditor.js"></script>
<script type="text/javascript" src="index11/fotoblock.js"></script>
<script type="text/javascript" src="index11/linker.js"></script>

<script type="text/javascript" src="index11/key_control.js"></script>

<link href="fontawesome/css/all.css" rel="stylesheet">

<link href="index11/liner.css" rel="stylesheet">
<link href="index11/resize.css" rel="stylesheet">
<link href="index11/diveditor.css" rel="stylesheet">
<link href="index11/fotoblock.css" rel="stylesheet">
<link href="index11/linker.css" rel="stylesheet">
<link href="index11/select.css" rel="stylesheet">

<body style="overflow: hidden;">

<div style="position: relative; top: 0; left: 0;">
<div id="superMain" style="width: 100%; height: 100%; transform-origin: top left;">

    <br><br>
    <div id="fam" class="family obj move dropcnt a_link" style="width: 350px; height: 240px; position: absolute; background-color: rgb(247 234 77 / 20%); background: url(img/family.png); background-size: cover;">
    </div>

    <div id="id9" class="obj move resize fotoblock a_link" style="left: 21px; top: 140px;">
        <div class="fotoborder">

            <div class="fotoimg" style="left: -243px; top: -50px; transform: scale(1.2);">
                <img src="img/ofo.jpeg">
            </div>
            
        </div>
        <div class="fio">
            Фсе
        </div>
    </div>

    <div id="main" class="obj main ddr" style="position: relative; border: 2px solid red; width: 600px; height: 300px; transform-origin: top left;">
    
        <div id="id2" class="obj move resize fotoblock a_link" style="left: 141px; top: -80px;">
            <div class="fotoborder">
    
                <div class="fotoimg" style="left: -32px; top: 0; transform: scale(0.6);">
                    <img src="img/den.jpeg">
                </div>
                
            </div>
            <div class="fio">
                Денис Несен
            </div>
        </div>
        <div id="id3" class="obj move resize fotoblock a_link" style="left: 241px; top: 140px;">
            <div class="fotoborder">
    
                <div class="fotoimg" style="left: -36px; top: -16px; transform: scale(0.1);">
                    <img src="img/mar3.jpeg">
                </div>
                
            </div>
            <div class="fio">
                Маруся Несен
            </div>
        </div>
        <div id="id6" class="obj move resize fotoblock a_link" style="left: 441px; top: 50px;">
            <div class="fotoborder">
    
                <div class="fotoimg" style="left: -200px; top: -44px; transform: scale(0.65);">
                    <img src="img/pah.jpeg">
                </div>
                
            </div>
            <div class="fio">
                Паха Несен
            </div>
        </div>
        <div id="id8" class="obj move resize fotoblock a_link" style="left: 21px; top: 140px;">
            <div class="fotoborder">
    
                <div class="fotoimg" style="left: -243px; top: -50px; transform: scale(1.2);">
                    <img src="img/var.jpeg">
                </div>
                
            </div>
            <div class="fio">
                Варюня Несен
            </div>
        </div>
    </div>

</div>
</div>

<script>

    $('.resize, .f2').allow_resize();
    
	$('.move:not(.cnt):not(.incnt)').allow_move();
	$('.move.cnt2').allow_move();
	$('.move.incnt').allow_move();

    $('#obj_in_conte').allow_move({ ctrl_obj: $('#obj_in_conte, .ddr #id2') });

    $('body').zoomByWhell({ zoom_object: '#superMain' });

    $('body').allow_move({ liner: false, ctrl_obj: $('#superMain') });

    $('.main').allow_move().allow_resize();
    
    $('.fotoblock').allow_select({

        selectObj: function ( obj ) {

            obj.addDivEditor({

                button: [ 'upload', 'kadr', 'link', 'placein', 'front', 'back', 'del' ]
            })
        },
        unselectObj: function ( obj ) {

            obj.delDivEditor();
        }
    });

    $('.family').allow_select({

        selectObj: function ( obj ) {

            obj.addDivEditor({

                button: [ 'link', 'front', 'back', 'del' ]
            })
        },
        unselectObj: function ( obj ) {

            obj.delDivEditor();
        }
    });

//    $('.main').allow_select();

</script>
</body>