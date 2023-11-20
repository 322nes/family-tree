<?

spl_autoload_register( function ($class_name) {

    if( file_exists($class_name . '.php') ) {

        /** @noinspection PhpIncludeInspection */
        include $class_name . '.php';
    }
});

