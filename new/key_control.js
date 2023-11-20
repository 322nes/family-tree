$(function () {

    $(document).keydown(function (e) {

//        console.log( 'Press key: ', e );

        if (e.ctrlKey) {

            $('body').addClass('ctrl_pressed');

            console.log('CTRL = on');
        }

        if (e.shiftKey) {

            $('body').addClass('shift_pressed');

            console.log('SHIFT = on');
        }

    }).keyup(function (e) {

        // noinspection JSJQueryEfficiency
        if (!e.ctrlKey && $('body').hasClass('ctrl_pressed')) {

            $('body').removeClass('ctrl_pressed');

            console.log('CTRL = off');
        }

        if (!e.shiftKey && $('body').hasClass('shift_pressed')) {

            $('body').removeClass('shift_pressed');

            console.log('SHIFT = off');
        }
    });
});