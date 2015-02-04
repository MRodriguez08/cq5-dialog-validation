/**
 * Helper class to provide a basic validation for configuration dialogs.
 * @author mauricio.rodriguez
 */
function CqDialogValidator() {
	
	/**
	 * Error messages for each required field passed as parameter.
	 */
	this.errorMessages = {
		generalError : "Please check all marked fields",		
	}
	
	this.valueIsEmpty = function(value){
		return (value.trim().length === 0);
	}
	
	/**
	 * Validates all dialog fields marked as required in dialog.xml
	 * cls="required".
	 * Supported field types:
	 * - multifield
	 * - textfield
	 */
	this.validateDialog = function(dialog){
		console.log("config dialog validation...");
		var valid = true;
		var error = "";
		
		//check required multifields
		var i = 0;
		// retrieve all fields without considering the type
		var multifields = dialog.findByType("box");		
		while(i < multifields.length){
			var iterationValid = true;
			var field = multifields[i];
			if (field.hasClass("required")){			
				if (field.getXType() == 'multifield'){				
					if (field.getValue().length == 0){					
						valid = false;
						iterationValid = false;
					}
				} else if (field.getXType() == 'textfield'){
					if (this.valueIsEmpty(field.getValue())){
						valid = false;
						iterationValid = false;
					}			
				}
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
				title:'Validation Error',
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
				if (field.getXType() == 'multifield') { //if the field is multifield
					if (field.getValue().length == 0){
						iterationValid = false;
					}
				} else if (field.getXType() == 'textfield'){ //if the field is textfield
					if (this.valueIsEmpty(field.getValue())){
						iterationValid = false;
					}			
				}
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
	 * Creates the key for the messages array
	 */
	this._getFieldMessageKey = function(fieldName){
		//we remove the "./"
		var key = fieldName.substring(2, fieldName.length);
		return key;
	}
	
	/**
	 * marks the field as invalid.
	 * the method depends on the field type (by default multifields are not marked :s )
	 */
	this._markInvalid = function(field){
		if (field.getXType() == 'multifield'){
			//manually add css clases to update field status
			//mutifield "invalid" state is not correctly shown :s
			field.addClass("x-form-invalid");
			field.addClass("x-panel");
		} else if (field.getXType() == 'textfield'){
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