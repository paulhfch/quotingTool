'use strict';

//Quote constructor
function QuoteObject() { }
QuoteObject.prototype.getFormCount = function(){
    var count = 0;
   
   for ( var key in this.forms ) {
        if ( this.forms.hasOwnProperty( key ) ) {
            count = count + this.forms[key].count;
        }   
   }
   
   return count;
}
QuoteObject.prototype.getSubtotal = function(){
    var total = 0;
   
   for ( var key in this.forms ) {
    if ( this.forms.hasOwnProperty( key ) ) {
        total = total + this.forms[key].rate * this.forms[key].count * this.forms[key].time;
    }   
   }
   
   if (total < 50 && total != 0 ) {
     total = 50;
   }
   
   return Number( total ).toFixed( 2 );
}
QuoteObject.prototype.trim = function(){
    function isEmpty( form ) {
        return form.count === null || form.count === 0;
    }
    
    for ( var key in this.forms ) {
        if ( this.forms.hasOwnProperty( key ) && isEmpty( this.forms[key] ) ) {
          delete this.forms[key];
        }
    }
}

var taxPayors = new Array();

/*Common Utils*/
function showAlert( $scope, msg ) {
    $scope.warning = msg;
    $( ".alert" ).show().fadeOut( 5000 );
}

function isEmpty( variable ) {
    return typeof variable === "undefined" || variable === null || variable === "";
}
    
/* Controllers */
function Login( $scope ) {
    //TODO
    $scope.login = function(){
        location.hash = "#/admin";
    };
}
Login.$inject = [ '$scope' ];

function Quote( $scope, $location ) {
    $scope.taxPayors = taxPayors;
    
    var newTaxPayor =  {
            index : 0,
            name : "",
            quote : null,
            count : 0,
            subtotal : Number( 0 ).toFixed( 2 ),
            summary : null
        };
    
    // addNewTaxPayer() method binded to ng-click
    $scope.addNewTaxPayor = function(){
        var taxPayor = jQuery.extend( true, {}, newTaxPayor );
        taxPayor.quote = new QuoteObject();
        taxPayor.quote.forms = jQuery.extend( true, {}, formsTemplate );
        taxPayors.push( taxPayor );
        taxPayor.index = taxPayors.length - 1;
    }
    
    //init table with the first entry 
    if ( taxPayors.length == 0 ) {
        $scope.addNewTaxPayor();
    }
   
    $scope.getQuote = function(){
        for ( var i = 0; i < taxPayors.length; i++ ) {
            if ( taxPayors[i].name === null || taxPayors[i].name === "" ) {
                showAlert( $scope, "Please fill out all tax payors' names beforing proceeding." );
                
                return;
            }
        }
        
        $location.path( "/summary" );
    
        //TODO submit a quote
    };
    
    $scope.edit = function( taxPayorIndex ){
        if ( isEmpty( taxPayors[taxPayorIndex].name ) ) {
            showAlert( $scope, "Please fill out the tax payor's name before proceeding." );
            
            return;
        }
        
        $location.path( "/forms/" +  taxPayorIndex );
    }
   
    $scope.remove = function( taxPayorIndex ){
        //do not delete the last taxPayor
        if ( taxPayors.length === 1 ) {
            showAlert( $scope, "Please ensure at least one tax payor." );
            
            return;
        }
        
        taxPayors.splice( taxPayorIndex, 1 );
        
        //update taxPay indexes
        for ( var i = 0; i < taxPayors.length; i ++ ) {
            taxPayors[i].index = i;
        }
    }
   
   //update quote info
   for ( var i = 0; i < taxPayors.length; i ++ ) {
        taxPayors[i].count = taxPayors[i].quote.getFormCount();
        taxPayors[i].subtotal = taxPayors[i].quote.getSubtotal();
   }
}
Quote.$inject = ['$scope', '$location'];

function Forms( $scope, $routeParams, $location ) {
    $scope.taxPayor = taxPayors[ $routeParams.taxPayorIndex ];
    
    if ( isEmpty( $scope.taxPayor ) ) {
        $location.path( "/quote" );
    }
    
    $scope.back = function(){
         $location.path( "/quote" );
    }
}
Forms.$inject = ['$scope', '$routeParams', '$location'];

function Summary( $scope, $http, emailService ) {
    $scope.taxPayors = taxPayors;
    
    for ( var i = 0; i < taxPayors.length; i ++ ) {
        taxPayors[i].summary = jQuery.extend( true, {}, taxPayors[i].quote );
        taxPayors[i].summary.trim();
    }
    
    //update total
    var total = 0;
    for ( var i = 0; i < taxPayors.length; i++ ) {
        total = total + Number( taxPayors[i].quote.getSubtotal() );
    }
    $scope.total = Number( total ).toFixed( 2 );
    
    //generate summary email
    $scope.email = {
        subject : "Quote Summary " + new Date(),
        summary : ""
    }
    
    for ( var i = 0; i  < taxPayors.length; i++ ) {
       $scope.email.summary += taxPayors[i].name + " : $" + taxPayors[i].subtotal + "%0D%0A";
       var forms = taxPayors[i].summary.forms
       for ( var key in forms ) {
             $scope.email.summary += " - " + forms[key].id + " x " +  forms[key].count + "%0D%0A";
       }
       $scope.email.summary += "%0D%0A";
    }
    
    $scope.submitQuote = function(){
        if ( isEmpty( $scope.contactName)
            || isEmpty( $scope.contact ) ) {
            showAlert( "Please fill out the contact information." );
            
            return;
        }
        
        //TODO Update quote submitted
    }
}
Summary.$inject = ['$scope', '$http'];
