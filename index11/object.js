jQuery.fn.getObjectInfo = function () {

    let obj = {};

    obj.scale = $(this).getScale();

    obj.left = isNaN(obj.left = parseFloat($(this).css('left')) ) ? 0 : obj.left;
    obj.top = isNaN( obj.top = parseFloat($(this).css('top')) ) ? 0 : obj.top;

    obj.width = parseFloat($(this).css('width'));
    obj.height = parseFloat($(this).css('height'));

    obj.width_scaled = obj.width * obj.scale;
    obj.height_scaled = obj.height * obj.scale;

    obj.right = obj.left + obj.width;
    obj.bottom = obj.top + obj.height;

    obj.right_scaled = obj.left + obj.width_scaled;
    obj.bottom_scaled = obj.top + obj.height_scaled;

    obj.top_scaled_center = obj.top + ( obj.height_scaled / 2 );
    obj.left_scaled_centr = obj.left + ( obj.width_scaled / 2 );

    return obj;
}

jQuery.fn.getScale = function () {

    let scale = 1;

    let tfm = $(this).css('transform');

//    console.log('@@@@@@@@@@@@@@@', tfm);

    if (tfm !== undefined && tfm !== "none") {

        let values = tfm.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');

        scale = Math.sqrt(values[0] * values[0] + values[1] * values[1]);
    }

    return scale;
}

function isset ( strVariableName ) {

    try {

        eval( strVariableName );

    } catch( err ) {

        if ( err instanceof ReferenceError )
            return false;
    }

    return true;
}

function objProp( obj, key, def ) {

    if( obj === undefined )
        return def;

    if( key in obj )
        return obj[key];

    return def;
}
