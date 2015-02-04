# cq5-dialog-validation
This simple script provides a basic validation of CQ5 dialogs, since validations of some xtypes like multifiels are not correctly applied.
allowBlank="false" works fine for xtype textfield, but for multifield it always marks the field as invalid (I don't know wy) so, I've decided to implement an on beforesubmit solution.

## Supported xtypes
*  [Textfield](http://docs.adobe.com/docs/en/cq/5-6/widgets-api/index.html?class=CQ.Ext.form.TextField)
*  [Multifield](http://docs.adobe.com/docs/en/cq/5-6/widgets-api/index.html?class=CQ.form.MultiField)

## Considerations of dialog.xml
### Register listeners
```xml
	<!-- We should register both beforesubmit and loadcontent handlers -->
	<!-- beforesubmit: handles beforesubmit event, checking all fields marked as required and preventing default if -->
	<!-- some of them fails -->
	<!-- loadcontent: handles on loadcontent event, checking if some of the values is not valid and marking them as invalid -->
	<!-- this function is needed to update dialog and avoid previous error states -->
    <listeners 
    	jcr:primaryType="nt:unstructured"		
        beforesubmit="function(dialog){	return cqDialogValidator.validateDialog(dialog); }"
        loadcontent="function(dialog){	return cqDialogValidator.setupDialog(dialog); }"  />
```
### Mark fields as required
To set fields as required, we only need to add a CSS class to the widget as follows:
####Multifield
```xml
<!-- since this multifield is marked as required (cls="required"), will be checked on beforesubmit -->
<mfOne 
    jcr:primaryType="cq:Widget" 
    fieldLabel="Multifield One"
    name="./multifieldOne"
    cls="required"
    xtype="multifield" />
```
####Textfield
```xml
<tfTwo 
  	jcr:primaryType="cq:Widget" 
  	fieldLabel="Textfield Two"
  	name="./textFieldOne"
  	cls="required"
  	xtype="textfield" />	
```
The important directive is **cls="required"** since the plugin uses **Field.hasClass()** function to determine which fields are required.

Note that with 
```xml
<tfTwo 
  	jcr:primaryType="cq:Widget" 
  	fieldLabel="Textfield Two"
  	name="./textFieldOne"
  	cls="required"
  	allowBlank="false"
  	validator="function(value) {return !cqDialogValidator.valueIsEmpty(value); }"
  	xtype="textfield" />	
```
We can use **cqDialogValidator.valueIsEmpty(value)** to perfome a validation in onchange event (as mentioned, allowBlank does not work properly in multifield).

##To be continued
As i said, this is a very basic validation plugin, and is ment to be extended with other common xtypes. For now, this have solved my problems but I'm sure I'll face some other xtypes issues and then I'll update the script.
