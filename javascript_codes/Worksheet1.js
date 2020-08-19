// ----------------------- PART 1 ----------------------------------------------

// Make Euler function
function EulerODE(t,x0,f) {
    var N
    var T 
    var h
    var x

    strcode = document.getElementById("codetext_q1_EulerODE").value;
    eval(strcode)

    return x
}

// Make time axis
function makeTimeAxis(tstart,tend,h) {
    const npoints=Math.ceil((tend-tstart)/h) + 1;
    var t=Array(npoints);
    t[0]=tstart;
    let i;
    for (i=0; i<npoints-1; i++) {
        t[i+1]=t[i]+h;    
    }
    return t
}

// Make firing rate function
function FiringRateModel(x,P) {
        
    const tau = 3.2 ; // time constant
    const k = 4 ; // slope of sigmoid
    const th = 1 ; // threshold

    // Make sigmoid
    var S = 1./(1+Math.exp(-k*(P-th))) ; 
    
    // Calculate xdot
    var xdot = (1/tau)*(-x+S) ; 

    return xdot
}

// Makr exact solution to firing rate model
function makeExactFiringRate(texact,x0,P) {

    const tau = 3.2 ; // time constant
    const k = 4 ; // slope of sigmoid
    const th = 1 ; // threshold

    // Make sigmoid
    var S = 1./(1+Math.exp(-k*(P-th))) ; 
    
    // Calculate xexact
    let xexact=Array(texact.length);
    let i;
    for (i=0; i<texact.length; i++) {
          xexact[i] = (x0-S)*Math.exp(-texact[i]/tau) + S;
    }

    return xexact
}


function SimulateFiringRateModel() {

    // Output "simulating..." to console
    var str=document.getElementById("eulerODEoutput_textarea").value;
    document.getElementById("eulerODEoutput_textarea").value=str.concat('Simulating...');

    // Initialize variables
    var tstart=0
    var tend=100
    var h
    var x0
    var P

    // Import variables from input
    P=Number(document.getElementById("dialInputCurrent").value);
    h=Number(document.getElementById("dialTimeStep").value);
    x0=Number(document.getElementById("dialInitialRate").value);

    // Make time axis
    let t = makeTimeAxis(tstart,tend,h) ; 

    // Make function 
    function f(x) {
        let xdot = FiringRateModel(x,P) ; 
        return xdot
    };

    // Run the Euler solver
    eulerODE1.save();
    let time0 = performance.now();
    var x=EulerODE(t,x0,f) ;
    let time1 = performance.now()-time0;
    str=document.getElementById("eulerODEoutput_textarea").value;
    document.getElementById("eulerODEoutput_textarea").value=str.concat('Done\n');

    // Make exact time axis
    let texact = makeTimeAxis(tstart,tend,1e-3) ; 
    let xexact = makeExactFiringRate(texact,x0,P) ; 

    // Plot
    let trace = [{
        x: t,
        y: x,
        mode: 'lines',
        name: 'Euler',
        line: {color: 'rgb(100,100,100)'}
    } , {
        x: texact, 
        y: xexact, 
        mode: 'lines', 
        name: 'Exact',
        line: {color: 'rgb(100,100,255)',dash: 'dash'}
    }];

    var layout = {
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
        title: 'Firing rate'
        }
    }
    Plotly.newPlot(document.getElementById("eulerODEoutput"), trace,layout)


    // Output time elapsed to "console"
    var str=document.getElementById("eulerODEoutput_textarea").value;
    str=str.concat('Time elapsed: ');
    str=str.concat(time1.toString());
    document.getElementById("eulerODEoutput_textarea").value=str.concat(' ms\n');

    // Calculate RMSE
    let xerr = makeExactFiringRate(t,x0,P) ; 
    let i; let err=0;
    for (i=0; i<t.length; i++) {
        err=err+Math.pow(xerr[i]-x[i],2); 
    }
    err=err/t.length;
    err=Math.sqrt(err);
    var str=document.getElementById("eulerODEoutput_textarea").value;
    str=str.concat('RMSE: ');
    str=str.concat(err.toString());
    document.getElementById("eulerODEoutput_textarea").value=str.concat('\n\n');

}








// ----------------------- PART 2 ----------------------------------------------

// Make Euler function
function EulerODE_luke(t,x0,f) {
    var N
    var T 
    var h
    var x

    // number of time points
    T=t.length ;
    N=x0.length ; 

    // Initialize output array
    x=Array(T); // make x an empty array with T entries, one for each time point
    x[0]=x0 ; // enter initial condition to first time point

    // Do Euler loop
    for (i=0; i < T-1; i++) { // loop over time points from time 0 to time T-1

        // **** YOUR CODE HERE ****
        h=t[i+1]-t[i] ; // find the time step h, which is the difference between t[i+1] and t[i]
        fx = f(x[i]) ; 
        x[i+1]=Array(N);

        for (j=0; j < N ; j++) { // loop over dimensions
            x[i+1][j]=x[i][j]+h*fx[j] ; // calculate x[i+1] from x[i] using Euler step
        }

    }

    return x
}


// Make firing rate function
function WilsonCowanModel(x_i,P) {
        
    // declare the variables
    var E ; var I ; 
    
    var tauE ; var tauI ; 
    var cEE  ; var cIE  ; 
    var cEI  ; var cII  ; 
    var kE   ; var kI   ; 
    var thE  ; var thI  ; 

    var inputE ; var inputI ; 
    var SE ; var SI ; 

    var Edot ; var Idot ; 
    var xdot_i=Array(2) ; 

    // Get ODE function
    wilsoncowanODE1.save();
    strcode = document.getElementById("codetext_q2_WilsonCowanODE").value;
    eval(strcode);

    return xdot_i
}


function SimulateWCModel() {

    // Output "simulating..." to console
    var str=document.getElementById("WCODEoutput_textarea").value;
    document.getElementById("WCODEoutput_textarea").value=str.concat('Simulating...');

    
    // Initialize variables
    var tstart=-1500;
    var tend=1000;
    var h=0.1;
    var x0=[Math.random(),Math.random()];
    var P;

    // Import variables from input
    P=Number(document.getElementById("dialWCInputCurrent").value);

    // Make time axis
    let t = makeTimeAxis(tstart,tend,h) ; 

    // Make function 
    function f(x) {
        let xdot = WilsonCowanModel(x,P) ; 
        return xdot
    };


    // Run the Euler solver
    let time0 = performance.now();
    var x=EulerODE_luke(t,x0,f) ;
    let time1 = performance.now()-time0;
    str=document.getElementById("WCODEoutput_textarea").value;
    document.getElementById("WCODEoutput_textarea").value=str.concat('Done\n');

    // Extract the two time series for plotting
    let tmpx = x ; 
    x = Array(2) ; 
    let i=0 ; 
    while (t[i]<0) {
        i=i+1 ; 
    }
    t = t.slice(i);
    tmpx = tmpx.slice(i);
    x[0] = Array(t.length);
    x[1] = Array(t.length);
    let j
    for (j=0; j<t.length; j++) {
        x[0][j] = tmpx[j][0];
        x[1][j] = tmpx[j][1];
    }

    // Plot
    let trace = [{
        x: t,
        y: x[0],
        mode: 'lines',
        name: 'E',
        line: {color: 'rgb(100,100,100)'}
    } , {
        x: t, 
        y: x[1], 
        mode: 'lines', 
        name: 'I',
        line: {color: 'rgb(255,100,100)'}
    }];

    var layout = {
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
        title: 'Firing rate'
        }
    }
    Plotly.newPlot(document.getElementById("WCODEoutput"), trace,layout)


    // Output time elapsed to "console"
    var str=document.getElementById("WCODEoutput_textarea").value;
    str=str.concat('Time elapsed: ');
    str=str.concat(time1.toString());
    document.getElementById("WCODEoutput_textarea").value=str.concat(' ms\n\n');


}







// ----------------------- PART 2 ----------------------------------------------


// noise generator function
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


// Make Euler function
function EulerSDE_luke(t,x0,f,sig) {
    var N
    var T 
    var h
    var x

    // number of time points
    T=t.length ;
    N=x0.length ; 

    // Initialize output array
    x=Array(T); // make x an empty array with T entries, one for each time point
    x[0]=x0 ; // enter initial condition to first time point

    // Do Euler loop
    for (i=0; i < T-1; i++) { // loop over time points from time 0 to time T-1

        // **** YOUR CODE HERE ****
        h=t[i+1]-t[i] ; // find the time step h, which is the difference between t[i+1] and t[i]
        fx = f(x[i]) ; 
        x[i+1]=Array(N);

        for (j=0; j < N ; j++) { // loop over dimensions
            x[i+1][j]=x[i][j]+h*fx[j]+Math.sqrt(h)*sig[j]*randn(); // calculate x[i+1] from x[i] using Euler step
        }

    }

    return x
}


// Make firing rate function
function WilsonCowanModel_luke(x_i,P) {
        
    // initialize output array
    var xdot_i=Array(2) ; 

    // Extract E and I
    var E = x_i[0] ;
    var I = x_i[1] ;

    // Set parameters
    var tauE = 3.2 ; var tauI = 3.2 ; // population time constants
    var cEE  = 2.4 ; var cIE  = 2   ; // connectivity onto E population
    var cEI  = 2   ; var cII  = 0   ; // connectivity onto I population
    var kE   = 4   ; var kI   = 4   ; // slope of sigmoid
    var thE  = 1   ; var thI  = 1   ; // threshold

    // Get the input to the populations
    var inputE = P + cEE*E - cIE*I ; // input to E population
    var inputI = cEI*E - cII*I ; // input to I population

    // Calculate sigmoid function
    var SE = 1/(1+Math.exp(-kE*(inputE-thE))) ; // sigmoid for E
    var SI = 1/(1+Math.exp(-kI*(inputI-thI))) ; // sigmoid for I

    // Calculate rates of change
    var Edot = (1/tauE)*(-E + SE) ;    
    var Idot = (1/tauI)*(-I + SI) ; 

    // Package Edot and Idot
    xdot_i = [Edot , Idot] ;

    return xdot_i
}


function SimulateSWCModel() {

    // Output "simulating..." to console
    var str=document.getElementById("WCSDEoutput_textarea").value;
    document.getElementById("WCSDEoutput_textarea").value=str.concat('Simulating...');

    
    // Initialize variables
    var tstart=-1500;
    var tend=1000;
    var h=0.1;
    var x0=[Math.random(),Math.random()];
    var P;
    var sig=Array(2);

    // Import variables from input
    P=Number(document.getElementById("dialSWCInputCurrent").value);
    sig[0]=Number(document.getElementById("dialSWCNoise").value);
    sig[1]=0;
    console.log(P)
    console.log(sig)

    // Make time axis
    let t = makeTimeAxis(tstart,tend,h) ; 

    // Make function 
    function f(x) {
        let xdot = WilsonCowanModel_luke(x,P) ; 
        return xdot
    };
    console.log(f(x0))

    // Run the Euler solver
    let time0 = performance.now();
    var x=EulerSDE_luke(t,x0,f,sig) ;
    let time1 = performance.now()-time0;
    str=document.getElementById("WCSDEoutput_textarea").value;
    document.getElementById("WCSDEoutput_textarea").value=str.concat('Done\n');
    console.log(x)

    // Extract the two time series for plotting
    let tmpx = x ; 
    x = Array(2) ; 
    let i=0 ; 
    while (t[i]<0) {
        i=i+1 ; 
    }
    t = t.slice(i);
    tmpx = tmpx.slice(i);
    x[0] = Array(t.length);
    x[1] = Array(t.length);
    let j
    for (j=0; j<t.length; j++) {
        x[0][j] = tmpx[j][0];
        x[1][j] = tmpx[j][1];
    }

    // Plot
    let trace = [{
        x: t,
        y: x[0],
        mode: 'lines',
        name: 'E',
        line: {color: 'rgb(100,100,100)'}
    } , {
        x: t, 
        y: x[1], 
        mode: 'lines', 
        name: 'I',
        line: {color: 'rgb(255,100,100)'}
    }];

    var layout = {
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
        title: 'Firing rate'
        }
    }
    Plotly.newPlot(document.getElementById("WCSDEoutput"), trace,layout)


    // Output time elapsed to "console"
    var str=document.getElementById("WCSDEoutput_textarea").value;
    str=str.concat('Time elapsed: ');
    str=str.concat(time1.toString());
    document.getElementById("WCSDEoutput_textarea").value=str.concat(' ms\n\n');


}
