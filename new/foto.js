jQuery.fn.allowFotoUploadKadr = function () {

    $('.kadr').bind('click', function () {

        if( $(this).hasClass('btnDisable') ) {

            return false;
        }

        let oooo = $(this).closest('.divEditBlock');

        let objdiv = $( '#' + oooo.attr('toid') + ' .objdiv' );

        if( $('#fotoedit', objdiv ).length === 0 ) {

            objdiv.css('overflow', 'unset');

            $('<div id="fotoedit"><div></div></div>').appendTo(objdiv);

            $('.foto', objdiv).allow_move({allow_out: true});
            $('.foto', objdiv).zoomContainerByWhell({inside: true});

        } else {

            objdiv.css('overflow', 'hidden');

            $('#fotoedit', objdiv).remove();

            let oi = $( '.foto', objdiv ).getObjectInfo();

            $.ajax( 'upd_foto_obj.php?id=' + oooo.attr('toid') + '&left=' + oi.css_left + '&top=' + oi.css_top + '&scale=' + oi.scale );

            $( '.foto', objdiv ).unbind('mousedown');
            $( '.foto', objdiv ).unbind('mousewheel');

        }

        return false;
    });

    $('.upload').bind('click', function () {

        if( $('.upload_foto_form', $(this).parent() ).length === 0 ) {

            $('<br><div class="upload_foto_form"><form method="post" enctype="multipart/form-data">' +
                '<input type="file" id="upload_foto_file" name="filename"><input id="upload_foto_btn" type="button" value="Upload"></form></div>').appendTo($(this).parent());

            $( '#upload_foto_btn', $(this).parent() ).click(function() {

                oooo = $(this).closest('.divEditBlock');

                var fd = new FormData();
                var files = $('#upload_foto_file')[0].files;

                if(files.length > 0 ){

                    fd.append( 'object', oooo.attr('toid') );
                    fd.append( 'filename', files[0] );

                    $.ajax({
                        url: 'upload_foto.php',
                        type: 'post',
                        data: fd,
                        contentType: false,
                        processData: false,
                        success: function(response){

//                                            console.log(response);

                            if( response != 0 ){

                                $(response).appendTo( $( '#' + oooo.attr('toid') + ' .objdiv .foto' ).empty() );

                                $('.upload_foto_form', oooo).toggle();

                                $('.kadr', oooo).removeClass('btnDisable');

                            } else {

                                alert('file not uploaded');
                            }
                        },
                    });

                } else {

                    alert("Please select a file.");
                }
            });

        } else {

            $('.upload_foto_form', $(this).parent() ).toggle();
        }
    });

}