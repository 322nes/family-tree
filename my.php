<?

class my {

    static private $db = null;

    static function init() {

        if( !self::$db ) {

            self::$db = new PDO('sqlite:./ooooo');

            if (!self::$db) {

                throw new Exception("Error open BD connection\n");
            }

            self::$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
    }

    static function query( $str ) {

        try {

            self::init();

#            echo( "=> ".$str."\n" );

            $result = self::$db->query($str);

        } catch (PDOException $e) {

            die("ERROR: ".$e->getMessage()."\nRequest: ".$str."\n");

        } catch ( Exception $e ) {

            die("ERROR: ".$e->getMessage()."\n");
        }

        return $result;
    }

    static function fetchArray( $result, $assoc = true ) {

        if( $result ) {

            return $result->fetch( $assoc ? PDO::FETCH_ASSOC : PDO::FETCH_BOTH );
        }

        return null;
    }

    static function get( $str, $default = null ) {

        $result = self::query($str);

        if( $result ) {

#            if( $row = $res->fetch() ) {
            if( $row = self::fetchArray( $result, false ) ) {

                return $row[0];
            }
        }

        return $default;
    }
}
