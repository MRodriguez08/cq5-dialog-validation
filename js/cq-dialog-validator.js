/**
 * CQ5 Basic Dialog Validator
 * @author mauricio.rodriguez 
 */

// support section

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

// support section


/**
 * Helper class to provide a basic validation for configuration dialogs.
 */
function CqDialogValidator() {
	
	/**
	 * Error messages for each required field passed as parameter.
	 */
	this.errorMessages = {
		generalError : "Please check all marked fields",		
	}
	
	/**
	 * Supported parameter types:
	 * - string
	 * - textfield
	 * - multifield
	 * - richtext
	 */
	this.valueIsEmpty = function(value){
				
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
	 * validates all dialog fields marked as required in dialog.xml
	 * cls="required".
	 * supported field types:
	 * - multifield
	 * - textfield
	 * - richtext
	 */
	this.validateDialog = function(dialog){
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
				if (this.valueIsEmpty(field)){
					valid = false;
					iterationValid = false;
				}
				
				//update field state
				if (iterationValid){				
					this._markValid(field);
				} else {
					this._markInvalid(field);
				}	
			}
			i++;
		}
		
		if (!valid){
			CQ.Ext.Msg.show({
				title: 'Validation Error',
				msg: this.errorMessages["generalError"],
				buttons:CQ.Ext.MessageBox.OK,
				icon:CQ.Ext.MessageBox.ERROR}
		    );
		}
		return valid;
	}
	
	this.setupDialog = function(dialog){
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
				if (this.valueIsEmpty(field)){
					valid = false;
					iterationValid = false;
				}
				
				//update field state
				if (iterationValid){				
					this._markValid(field);
				} else {
					this._markInvalid(field);
				}
			}
			i++;
		}
	}
	
	/**
	 * marks the field as invalid.
	 * the method depends on the field type (by default multifields are not marked :s )
	 */
	this._markInvalid = function(field){
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
	this._markValid = function(field){
		if (field.getXType() == 'multifield'){
			//manually remove css clases to update field status
			field.removeClass("x-panel");
			field.removeClass("x-form-invalid");
		} else if (field.getXType() == 'textfield'){
			//nothing becaouse xtype textfield is correctly initialized in dialog creation.
		}
	}
	
} 

//instantiation of the dialog validator
var cqDialogValidator = new CqDialogValidator();