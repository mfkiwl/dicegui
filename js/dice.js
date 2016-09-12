document.getElementById("runLi").onclick = function() {
    writeInputFile();
    writeParamsFile();
    callDICeExec();
};

function callDICeExec() {

    var inputFile = workingDirectory;
    if(os.platform()=='win32'){
        inputFile += '\\input.xml';
    }else{
        inputFile += '/input.xml';
    }
    
    var child_process = require('child_process');
    var readline      = require('readline');
    var proc          = child_process.spawn(execPath, ['-i',inputFile,'-v','-t']);

    readline.createInterface({
        input     : proc.stdout,
        terminal  : false
    }).on('line', function(line) {
        //console.log(line);
        $('#consoleWindow').append(line + '<br/>');
        var objDiv = document.getElementById("consoleWindow");
        objDiv.scrollTop = objDiv.scrollHeight;
    });

//    proc.stderr.on('data', (data) => {
//        console.log(`stderr: ${data}`);
//        alert('DICe execution failed (see console for details)');
//    });
    
    proc.on('error', function(){
        alert('DICe execution failed: invalid executable: ' + execPath);
        var objDiv = document.getElementById("consoleWindow");
        objDiv.scrollTop = objDiv.scrollHeight;
    });
    
    proc.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if(code!=0){
            alert('DICe execution failed (see console for details)');
        }
        // move the scroll on the console to the bottom
        var objDiv = document.getElementById("consoleWindow");
        objDiv.scrollTop = objDiv.scrollHeight;
    });    
}

function writeInputFile() {
    fileName = workingDirectory;
    outputFolder = workingDirectory;
    paramsFile = workingDirectory;
    if(os.platform()=='win32'){
        fileName += '\\input.xml';
        outputFolder += '\\results\\';
        paramsFile += '\\params.xml';
    }else{
        fileName += '/input.xml';
        outputFolder += '/restuls/';
        paramsFile += '/params.xml';
    }
    $('#consoleWindow').append('writing input file ' + fileName + '<br/>');
    var content = '';
    content += '<!-- Auto generated input file from DICe GUI -->\n';
    content += '<ParameterList>\n';
    content += '<Parameter name="output_folder" type="string" value="' + outputFolder + '" /> \n';
    content += '<Parameter name="image_folder" type="string" value="" />\n';
    content += '<Parameter name="correlation_parameters_file" type="string" value="' + paramsFile + '" />\n';
    content += '<Parameter name="subset_size" type="int" value="'+$("#subsetSize").val()+'" />\n';
    content += '<Parameter name="step_size" type="int" value="'+$("#stepSize").val()+'" />\n';
    content += '<Parameter name="separate_output_file_for_each_subset" type="bool" value="false" />\n';
    content += '<Parameter name="create_separate_run_info_file" type="bool" value="true" />\n';
    content += '<Parameter name="reference_image" type="string" value="' + refImagePathLeft + '" />\n';
    content += '<ParameterList name="deformed_images">\n';
    // add the deformed images
    for(var i = 0, l = defImagePathsLeft.length; i < l; i++) {
        content += '<Parameter name="'+defImagePathsLeft[i].path+'" type="bool" value="true" />\n';        
    }
    content += '</ParameterList>\n';
    content += '</ParameterList>\n';
    fs.writeFile(fileName, content, function (err) {
        if(err){
            alert("ERROR: an error ocurred creating the file "+ err.message)
         }
        $('#consoleWindow').append('input.xml file has been successfully saved <br/>');
    });
}

function writeParamsFile() {
    paramsFile = workingDirectory;
    if(os.platform()=='win32'){
        paramsFile += '\\params.xml';
    }else{
        paramsFile += '/params.xml';
    }
    $('#consoleWindow').append('writing parameters file ' + paramsFile + '<br/>');
    var content = '';
    content += '<!-- Auto generated parameters file from DICe GUI -->\n';
    content += '<ParameterList>\n';
    content += '<Parameter name="interpolation_method" type="string" value="KEYS_FOURTH" />\n';
    content += '<Parameter name="optimization_method" type="string" value="GRADIENT_BASED" />\n';
    content += '<Parameter name="initialization_method" type="string" value="USE_FIELD_VALUES" />\n';
    if($("#translationCheck")[0].checked){
        content += '<Parameter name="enable_translation" type="bool" value="true" />\n';
    }else{
        content += '<Parameter name="enable_translation" type="bool" value="false" />\n';
    }
    if($("#rotationCheck")[0].checked){
        content += '<Parameter name="enable_rotation" type="bool" value="true" />\n';
    }else{
        content += '<Parameter name="enable_rotation" type="bool" value="false" />\n';
    }
    if($("#normalStrainCheck")[0].checked){
        content += '<Parameter name="enable_normal_strain" type="bool" value="true" />\n';
    }else{
        content += '<Parameter name="enable_normal_strain" type="bool" value="false" />\n';
    }
    if($("#shearStrainCheck")[0].checked){
        content += '<Parameter name="enable_shear_strain" type="bool" value="true" />\n';
    }else{
        content += '<Parameter name="enable_shear_strain" type="bool" value="false" />\n';
    }
    if($("#strainCheck")[0].checked){
        content += '<ParameterList name="post_process_vsg_strain">\n';
        content += '<Parameter name="strain_window_size_in_pixels" type="int" value="'+$("#strainGaugeSize").val()+'" />\n';
        content += '</ParameterList>\n';
    }
    content += '<Parameter name="output_delimiter" type="string" value="," />\n'
    content += '<ParameterList name="output_spec"> \n';
    content += '<Parameter name="COORDINATE_X" type="bool" value="true" />\n';
    content += '<Parameter name="COORDINATE_Y" type="bool" value="true" />\n';
    content += '<Parameter name="DISPLACEMENT_X" type="bool" value="true" />\n';
    content += '<Parameter name="DISPLACEMENT_Y" type="bool" value="true" />\n';
    content += '<Parameter name="SIGMA" type="bool" value="true" />\n';
    content += '<Parameter name="GAMMA" type="bool" value="true" />\n';
    content += '<Parameter name="BETA" type="bool" value="true" />\n';
    content += '<Parameter name="STATUS_FLAG" type="bool" value="true" />\n';
    if($("#strainCheck")[0].checked){
        content += '<Parameter name="VSG_STRAIN_XX" type="bool" value="true" />\n';
        content += '<Parameter name="VSG_STRAIN_YY" type="bool" value="true" />\n';
        content += '<Parameter name="VSG_STRAIN_XY" type="bool" value="true" />\n';
    }
    content += '</ParameterList>\n';
    content += '</ParameterList>\n';
    fs.writeFile(paramsFile, content, function (err) {
        if(err){
            alert("ERROR: an error ocurred creating the file "+ err.message)
         }
        $('#consoleWindow').append('params.xml file has been successfully saved <br/>');
    });
}

function checkValidInput() {
    $('#consoleWindow').append('checking if input requirements met to enable running DICe ... <br/>');
    var validInput = true;
    // see if the left reference image is set:
    if(refImagePathLeft=='undefined') {
        $('#consoleWindow').append('reference image not set yet <br/>');
        validInput = false;
    }
    // check that the image extensions all match
    var refExtension = refImagePathLeft.split('.').pop().toLowerCase();
    if(!defImagePathsLeft[0]){
        $('#consoleWindow').append('deformed images have not been defined yet <br/>');
        validInput = false;
    }
    // check all the deformed images
    for(var i = 0, l = defImagePathsLeft.length; i < l; i++) {
        var defExtension = defImagePathsLeft[i].name.split('.').pop().toLowerCase();
        if(refExtension!=defExtension){
            $('#consoleWindow').append('deformed image ' + defImagePathsLeft[i].name + ' extension does not match ref extension <br/>');
            validInput = false;
        }
    }

    if(showStereoPane){
        $('#consoleWindow').append('running in stereo has not been enabled yet <br/>');
        validInput = false;
    }
    
    // TODO check right images ...
    // TODO see if the left and right ref have the same dimensions
    // TODO check the number of def images left and right
    
    if(validInput){       
        $("#runLi").show();
    }else{
        $("#runLi").hide();
    }
}
