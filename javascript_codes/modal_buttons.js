// ----------- CONSTANT STIMULUS MODAL ------------------ //

var const_modal = document.getElementById("constant-modal"); //modal
var const_btn = document.getElementById("constant-button"); //button 
var const_submit = document.getElementById("constant-submit"); //close
var const_cancel = document.getElementById("constant-cancel"); //close
const_btn.onclick = function() { // open modal
    const_modal.style.display = "block";
}
const_submit.onclick = function() { // close
    let val=Number(document.getElementById("constant-val").value);
    stim = add_baseline(stim,val);
    const_modal.style.display = "none";
}
const_cancel.onclick = function() { // close
    const_modal.style.display = "none";
}

// ----------- NOISE STIMULUS MODAL ------------------ //

var noise_modal = document.getElementById("noise-modal"); //modal
var noise_btn = document.getElementById("noise-button"); //button 
var noise_submit = document.getElementById("noise-submit"); //close
var noise_cancel = document.getElementById("noise-cancel"); //close
noise_btn.onclick = function() { // open modal
    noise_modal.style.display = "block";
}
noise_submit.onclick = function() { // close
    let val=Number(document.getElementById("noise-val").value);
    stim = add_noise(stim,val);
    noise_modal.style.display = "none";
}
noise_cancel.onclick = function() { // close
    noise_modal.style.display = "none";
}

// ----------- FLASH STIMULUS MODAL ------------------ //

var flash_modal = document.getElementById("flash-modal"); //modal
var flash_btn = document.getElementById("flash-button"); //button 
var flash_submit = document.getElementById("flash-submit"); //close
var flash_cancel = document.getElementById("flash-cancel"); //close
flash_btn.onclick = function() { // open modal
    flash_modal.style.display = "block";
}
flash_submit.onclick = function() { // close
    let Aval=Number(document.getElementById("flash-brightness").value);
    let tval=Number(document.getElementById("flash-time").value);
    stim = add_visualflash(stim,tval/1000,Aval);
    flash_modal.style.display = "none";
}
flash_cancel.onclick = function() { // close
    flash_modal.style.display = "none";
}

// ----------- STEP STIMULUS MODAL ------------------ //

var step_modal = document.getElementById("step-modal"); //modal
var step_btn = document.getElementById("step-button"); //button 
var step_submit = document.getElementById("step-submit"); //close
var step_cancel = document.getElementById("step-cancel"); //close
step_btn.onclick = function() { // open modal
    step_modal.style.display = "block";
}
step_submit.onclick = function() { // close
    let Aval=Number(document.getElementById("step-val").value);
    let t0val=Number(document.getElementById("step-ontime").value);
    let t1val=Number(document.getElementById("step-offtime").value);
    stim = add_step(stim,t0val/1000,t1val/1000,Aval);
    step_modal.style.display = "none";
}
step_cancel.onclick = function() { // close
    step_modal.style.display = "none";
}

// ----------- OSCILLATOR STIMULUS MODAL ------------------ //

var osc_modal = document.getElementById("osc-modal"); //modal
var osc_btn = document.getElementById("osc-button"); //button 
var osc_submit = document.getElementById("osc-submit"); //close
var osc_cancel = document.getElementById("osc-cancel"); //close
osc_btn.onclick = function() { // open modal
    osc_modal.style.display = "block";
}
osc_submit.onclick = function() { // close
    let Aval=Number(document.getElementById("osc-val").value);
    let fval=Number(document.getElementById("osc-freq").value);
    stim = add_oscillation(stim,fval,Aval);
    osc_modal.style.display = "none";
}
osc_cancel.onclick = function() { // close
    osc_modal.style.display = "none";
}

// ----------- RAMP STIMULUS MODAL ------------------ //

var ramp_modal = document.getElementById("ramp-modal"); //modal
var ramp_btn = document.getElementById("ramp-button"); //button 
var ramp_submit = document.getElementById("ramp-submit"); //close
var ramp_cancel = document.getElementById("ramp-cancel"); //close
ramp_btn.onclick = function() { // open modal
    ramp_modal.style.display = "block";
}
ramp_submit.onclick = function() { // close
    let val=Number(document.getElementById("ramp-val").value);
    stim = add_ramp(stim,val);
    ramp_modal.style.display = "none";
}
ramp_cancel.onclick = function() { // close
    ramp_modal.style.display = "none";
}

// ----------- NEURON SIM HELP ------------------ //

var help1_modal = document.getElementById("neuronsim_help-modal"); //modal
var help1_btn = document.getElementById("neuronsim_help-button"); //button 
var help1_cancel = document.getElementById("neuronsim_help-cancel"); //close
help1_btn.onclick = function() { // open modal
    help1_modal.style.display = "block";
}
help1_cancel.onclick = function() { // close
    help1_modal.style.display = "none";
}

// ----------- NETWORL SIM HELP ------------------ //

var help2_modal = document.getElementById("networksim_help-modal"); //modal
var help2_btn = document.getElementById("networksim_help-button"); //button 
var help2_cancel = document.getElementById("networksim_help-cancel"); //close
help2_btn.onclick = function() { // open modal
    help2_modal.style.display = "block";
}
help2_cancel.onclick = function() { // close
    help2_modal.style.display = "none";
}

// ----------- JR SIM HELP ------------------ //

var help3_modal = document.getElementById("jrsim_help-modal"); //modal
var help3_btn = document.getElementById("jrsim_help-button"); //button 
var help3_cancel = document.getElementById("jrsim_help-cancel"); //close
help3_btn.onclick = function() { // open modal
    help3_modal.style.display = "block";
}
help3_cancel.onclick = function() { // close
    help3_modal.style.display = "none";
}


// ----------- BRAIN SIM HELP ------------------ //
var help4_modal = document.getElementById("brainsim_help-modal"); //modal
var help4_btn = document.getElementById("brainsim_help-button"); //button 
var help4_cancel = document.getElementById("brainsim_help-cancel"); //close
help4_btn.onclick = function() { // open modal
    help4_modal.style.display = "block";
}
help4_cancel.onclick = function() { // close
    help4_modal.style.display = "none";
}
