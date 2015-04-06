/**
 * CQ5 Basic Dialog Validator
 * @author mauricio.rodriguez 
 */
(function ( cq ) {
    'use strict';
    
    /**
     * helper function to resolve javascript objects types
     */
    var type = (function(global) {
        var cache = {};
        return function(obj) {
            var key;
            return obj === null ? 'null' // null
                : obj === global ? 'global' // window in browser or global in nodejs
                : (key = typeof obj) !== 'object' ? key // basic: string, boolean, number, undefined, function
                : obj.nodeType ? 'object' // DOM element
                : cache[key = ({}).toString.call(obj)] // cached. date, regexp, error, object, array, math
                || (cache[key] = key.slice(8, -1).toLowerCase()); // get XXXX from [object XXXX], and cache it
        };
    }(this));
    
    /**
	 * Error messages for each required field passed as parameter.
	 */
	var errorMessages = {
		generalError : "Please check all marked fields",		
	}
	
	/**
	 * Supported parameter types:
	 * - string
	 * - textfield
	 * - multifield
	 * - richtext
	 */
	var valueIsEmpty = function(value){
		
		var objType = type(value);
		
		//add support for extypes
		if (objType === 'object')
			objType = value.getXType();
		
		if (objType === 'string'){
			return (value.trim().length === 0);
		} else if (objType === 'textfield' || objType === 'richtext'){
			return (value.getValue().trim().length === 0);
		} else if (objType === 'multifield'){
			return (value.getValue().length === 0);
		} else
			return false;
	}
	
	/**
	 * marks the field as invalid.
	 * the method depends on the field type (by default multifields are not marked :s )
	 */
	var _markInvalid = function(field){
		if (field.getXType() == 'multifield'){
			//manually add css clases to update field status
			//mutifield "invalid" state is not correctly shown :s
			field.addClass("x-panel x-form-invalid");
		} else if (field.getXType() == 'textfield' || field.getXType() == 'richtext'){
			field.markInvalid();
		}
	}
	
	/**
	 * marks the field ass valid
	 * the method depends on the field type (by default multifields are not marked :s )
	 */
	var _markValid = function(field){
		if (field.getXType() == 'multifield'){
			//manually remove css clases to update field status
			field.removeClass("x-panel");
			field.removeClass("x-form-invalid");
		} else if (field.getXType() == 'textfield'){
			//nothing becaouse xtype textfield is correctly initialized in dialog creation.
		}
	}

    var dialogMethods = {
	    init : function(options) {
	
	    },
	    sayWhat : function( ) { return false; },// !!!
	    
	    setup : function(dialog){
	    	var valid = true;
			var error = "";
	    	
			//we use box as type parameter to select all fields no matter the type.
			//findByType( String/Class xtype, [Boolean shallow] ) : Array
			//note that by default shallow = false, so funtion findByType will search for 
			//subclasses of box to...
			var multifields = dialog.findByType("box");		
			var i = 0;
			while(i < multifields.length){
				var iterationValid = true;
				var field = multifields[i];
				if (field.hasClass("required")){
					if (valueIsEmpty(field)){
						valid = false;
						iterationValid = false;
					}
					
					//update field state
					if (iterationValid){				
						_markValid(field);
					} else {
						_markInvalid(field);
					}
				}
				i++;
			}
			return valid;
		},
	    
	    /**
		 * validates all dialog fields marked as required in dialog.xml
		 * cls="required".
		 * supported field types:
		 * - multifield
		 * - textfield
		 * - richtext
		 */
		validate : function(dialog){
			var valid = true;
			var error = "";
			
			var i = 0;
			//we use box as type parameter to select all fields no matter the type.
			//findByType( String/Class xtype, [Boolean shallow] ) : Array
			//note that by default shallow = false, so funtion findByType will search for 
			//subclasses of box to...
			var multifields = dialog.findByType("box");		
			while(i < multifields.length){
				var iterationValid = true;
				var field = multifields[i];
				if (field.hasClass("required")){
					if (valueIsEmpty(field)){
						valid = false;
						iterationValid = false;
					}
					
					//update field state
					if (iterationValid){				
						_markValid(field);
					} else {
						_markInvalid(field);
					}	
				}
				i++;
			}
			
			if (!valid){
				CQ.Ext.Msg.show({
					title: 'Validation Error',
					msg: errorMessages["generalError"],
					buttons:CQ.Ext.MessageBox.OK,
					icon:CQ.Ext.MessageBox.ERROR}
			    );
			}
			return valid;
		},
	};
    
    var validationMethods = {
    	    init : function(options) {
    	
    	    },
    		isEmpty : function(value){
    			return valueIsEmpty(value);
    		},
    		notEmpty : function(value){
    			return !valueIsEmpty(value);
    		},
    	};
	
	/**
	 * Helper class to provide a basic validation for configuration dialogs.
	 */
    cq.dialog = function(methodOrOptions) {
		
		if ( dialogMethods[methodOrOptions] ) {
            return dialogMethods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return dialogMethods.init.apply( this, arguments );
        } else {
        	console.error( 'Method ' +  methodOrOptions + ' does not exist on cqJs.dialog' );
        }    
	}
    
	/**
	 * Helper class to provide a basic validation for configuration dialogs.
	 */
    cq.validate = function(methodOrOptions) {
		
		if ( validationMethods[methodOrOptions] ) {
            return validationMethods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return validationMethods.init.apply( this, arguments );
        } else {
        	console.error( 'Method ' +  methodOrOptions + ' does not exist on cqJs.validate' );
        }    
	} 

})(this.cqJs = this.cqJs || {});