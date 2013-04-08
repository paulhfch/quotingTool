'use strict';

/* Services */

angular.module('quotingTool.services', []).
    service( 'db', function(){
        this.submit = function( payload ){
            //TODO
            console.log( payload );
            
            var id = -1;
            
            return id;
        }
        
        this.update = function( id, payload ){
            //TODO
            console.log( payload );
        }
    }
);
    
angular.module('quotingTool.services', []).
    service( 'emailService', function(){
        this.submit = function( payload ){
            //TODO
           console.log( payload );
        }
    }
);