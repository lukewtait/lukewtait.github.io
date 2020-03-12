// Gaussian random generator
function randn() {
    let u1;
    let u2;
    let v2;
    let accept=false;
    while (!accept) {
        u1=Math.random();
        v2=Math.random();
        u2=(2*v2-1)*Math.sqrt(2/Math.exp(1));

        if (Math.pow(u1,2)<= Math.exp(-0.5*Math.pow(u2,2)/Math.pow(u1,2))) {
            accept = true ; 
        }
    }
    x=u2/u1;
    return x
}

// ---------- FUNCTION TO PLOT STIMULUS ----------------------
function plotStim(xdata,ydata,divlbl,ystr) {
    let trace = [{
        x: xdata,
        y: ydata,
        mode: 'lines',
        name: 'Line plot'
    }];

    var layout = {
        //height: auto, 
        margin: {
            l: 50,
            r: 15, 
            b: 30,
            t: 10
        },
        xaxis: {
            showline: true,
            showticklabels: true,
            linewidth: 2,
            tickfont: {
                family: 'Arial',
                size: 12
            },
            title: 'Time [ms]',
            zeroline: false
        },
        yaxis: {
            showline: true,
            showticklabels: true,
            linewidth: 2,
            tickfont: {
                family: 'Arial',
                size: 12
            },
            title: ystr,
            zeroline: false//,
            //range:ylim
        }
    }
    Plotly.newPlot(divlbl, trace,layout)
}

function stimPlot() {
    const plotdiv = document.getElementById("output_stim");
    function checkGreater0(x){
        return x>=0;
    }
    let indT = t.findIndex(checkGreater0);
    let sti = stim.slice(indT,stim.length);
    let ti = t.slice(indT,t.length);
    plotStim(ti,sti,plotdiv,"stimulus")
}


// ---------- FUNCTIONS FOR GENERATING STIMULI ---------------
// function to initialize array of zeros
function zeros(npoints) {
    let x = Array(npoints);
    for (i=0 ; i<npoints; i++) {
        x[i]=0;
    }
    return x;
}

function make_time_axis() {
    // Get time axis
    const tstart=-5; //ms
    const tend=2; //ms
    const dt=0.0001; //ms
    const npoints=(tend-tstart)/dt + 1;
    t = Array(npoints);
    t[0]=tstart;
    let i
    for (i=0 ; i<npoints-1; i++) {
        t[i+1]=t[i]+dt;
    }
}

// function to add baseline to stimulus
function add_baseline(stim,baseline,doplot=true) {
    let i;
    for (i=0 ; i<stim.length ; i++) {
        stim[i] = stim[i]+baseline;
    }    
    // Plot stimulus
    if (doplot) {
        stimPlot()
    }
    return stim;
}

// function to add noise to stimulus
function add_noise(stim,std,doplot=true) {
    let i;
    for (i=0 ; i<stim.length ; i++) {
        stim[i] = stim[i]+std*randn();
    }

    // Plot stimulus
    if (doplot) {
        stimPlot()
    }
      
    return stim;
    
}

// function to add noise to stimulus
function add_visualflash(stim,t0,A=1,doplot=true) {
    let i;
    let n=7;
    let w=0.005;
    let q=0.5;
    for (i=0 ; i<stim.length ; i++) {
        if (t[i]>=t0) {
            stim[i] = stim[i]+A*q*(((t[i]-t0)/w)**n)*Math.exp(-(t[i]-t0)/w);
        }
    }  

    // Plot stimulus
    if (doplot) {
        stimPlot()
    }

    return stim;
}

// function to add step to stimulus
function add_step(stim,t0,t1,A,doplot=true) {
    let i;
    for (i=0 ; i<stim.length ; i++) {
        if ((t[i]>=t0)&(t[i]<=t1)) {
            stim[i] = stim[i]+A;
        }
    }  

    // Plot stimulus
    if (doplot) {
        stimPlot()
    }

    return stim;
}

// function to add oscillation to stimulus
function add_oscillation(stim,f,A,doplot=true) {
    let i;
    for (i=0 ; i<stim.length ; i++) {
        stim[i] = stim[i]+A*Math.sin(2*Math.PI*f*t[i]);
    }  

    // Plot stimulus
    if (doplot) {
        stimPlot()
    }

    return stim;
}

// function to add ramp to stimulus
function add_ramp(stim,grad,doplot=true) {
    let i;
    for (i=0 ; i<stim.length ; i++) {
        stim[i] = stim[i]+grad*t[i];
    }  

    // Plot stimulus
    if (doplot) {
        stimPlot()
    }

    return stim;
}

// Make resting state stimulus
function makeRSStim(doplot=true) {

    document.getElementById("stimbuttons").style.display = "none";
    // make a time axis
    make_time_axis() ; 

    // Make stimulus
    stim = zeros(t.length);
    stim = add_baseline(stim,220,false);
    stim = add_noise(stim,100/3,false);

    // Plot stimulus
    if (doplot) {
        stimPlot()
    }

}

// Make resting state stimulus
function makeVEPStim() {

    document.getElementById("stimbuttons").style.display = "none";

    // make a time axis
    make_time_axis() ; 

    // Make stimulus
    stim = zeros(t.length);
    stim = add_baseline(stim,220,false);
    stim = add_visualflash(stim,0.5,1,false);

    // Plot stimulus
    stimPlot()

}

// ----- CUSTOM STIMULUS ------
function makeCustomStim() {

    document.getElementById("stimbuttons").style.display = "grid";

    // make a time axis
    make_time_axis() ; 

    // Make stimulus
    stim = zeros(t.length);

    // Plot stimulus
    stimPlot()

}
        


// ----------- SIMULATE ------------------
function simulateJRFunction() {
        
    make_time_axis();

    // Parameters
    const A=3.25; // mV
    const B=22; // mV
    const C=Number(document.getElementById("JRconnectivity").value); //125; // ms^-1
    const v0=6; // mV
    const a=100; // ms^-1
    const b=50; // ms^-1
    const e0=2.5; // ms^-1
    const r=0.56; // mV

    // Sigmoid function
    function Sigm(v,ei=e0,ri=r,vi=v0) {
        let S = 2*ei/(1+Math.exp(ri*(vi-v)));
        return S
    }

    // ODE functions
    function xpdotfun(zp) {
        // Initialize variables
        let xpdot=zp;
        return xpdot;
    }
    function xedotfun(ze) {
        // Initialize variables
        let xedot=ze;
        return xedot;
    }
    function xidotfun(zi) {
        // Initialize variables
        let xidot=zi;
        return xidot;
    }
    function zpdotfun(xp,xe,xi,zp,A,a) {
        // Initialize variables
        let zpdot=A*a*Sigm(xe-xi)-2*a*zp-(a**2)*xp;
        return zpdot;
    }
    function zedotfun(xp,xe,ze,A,a,p,C) {
        // Initialize variables
        let zedot=A*a*(p+0.8*C*Sigm(C*xp))-2*a*ze-(a**2)*xe;
        return zedot;
    }
    function zidotfun(xp,xi,zi,B,b,C) {
        // Initialize variables
        let zidot=B*b*0.25*C*Sigm(0.25*C*xp)-2*b*zi-(b**2)*xi;
        return zidot;
    }
    
    
    // Simulation parameters 
    dt=t[1]-t[0];
    console.log(dt);
    
    // Initialize all variables
    const npoints=t.length;
    let xp=zeros(npoints);
    let xe=zeros(npoints);
    let xi=zeros(npoints);
    let zp=zeros(npoints);
    let ze=zeros(npoints);
    let zi=zeros(npoints);
    let nmm=zeros(npoints); nmm[0]=xe[0]-xi[0];
    let p=[];
    
    // Simulate
    let i;
    for (i=0; i<npoints-1; i++) {

        xp[i+1] = xp[i]+dt*xpdotfun(zp[i]);
        xe[i+1] = xe[i]+dt*xedotfun(ze[i]);
        xi[i+1] = xi[i]+dt*xidotfun(zi[i]);
        zp[i+1] = zp[i]+dt*zpdotfun(xp[i],xe[i],xi[i],zp[i],A,a);
        ze[i+1] = ze[i]+dt*zedotfun(xp[i],xe[i],ze[i],A,a,stim[i],C);
        zi[i+1] = zi[i]+dt*zidotfun(xp[i],xi[i],zi[i],B,b,C);
            
        nmm[i+1]=xe[i+1]-xi[i+1];

        t[i] = 1000*t[i]; // make into ms for consistency 
    }
    t[npoints-1]=1000*t[npoints-1];

    stimPlot()

    function checkGreater0(x){
        return x>=0;
    }
    indT = t.findIndex(checkGreater0);
    nmm = nmm.slice(indT,nmm.length);
    t = t.slice(indT,t.length);
    console.log(t)

    // Plot stimulus
    const plotdiv = document.getElementById("simulated_NMM");
    plotStim(t,nmm,plotdiv,"M/EEG [mV]")

    make_time_axis() // required to get back to original time axis 

}
    