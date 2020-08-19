function runSimulator(I) {
/* 
Function to run Hodgkin-Huxley neuron simulation with parameter I as input
Model parameters and equations taken from Tait et al (2018) Journal of Theoretical Biology 449:23-34
*/

//const I=-5 ; 

// Model parameters
const C=1.46; // muF/cm^2
const ENa=55; // mV
const EK=-85; // mV
const EL=-70; // mV
const gNa=24; // mS/cm^2
const gK=11; // mS/cm^2
const gL=0.15; // mS/cm^2


// ODE function
function odefun(v,h,n,C,ENa,EK,EL,gNa,gK,gL,I) {
    // Initialize variables
    let xdot=[0,0,0];
    let alpha;
    let beta;

    // m gating variable
    alpha = 0.38*(v+33)/(1-Math.exp(-(v+33)/9));
    beta = -2.3*(v+58)/(1-Math.exp((v+58)/12));
    let m=alpha/(alpha+beta); // instantaneous assumption

    // h gating variable
    alpha = -0.03*(v+48)/(1-Math.exp((v+48)/12));
    beta = 0.05*(v+21)/(1-Math.exp(-(v+21)/9));
    xdot[1]=alpha*(1-h)-beta*h;

    // n gating variable
    alpha = 0.02*(v+38)/(1-Math.exp(-(v+38)/10));
    beta = -0.018*(v+47)/(1-Math.exp((v+47)/35));
    xdot[2]=alpha*(1-n)-beta*n;

    // membrane voltage
//    iNa=gNa*Math.pow(m,3)*h*(v-ENa);
  //  iK=gK*Math.pow(n,4)*(v-EK);
    //iL=gL*(v-EL);
    //iion=iNa+iK+iL;
    //debug(I)
    xdot[0]=(1/C)*(I-gNa*Math.pow(m,3)*h*(v-ENa)-gK*Math.pow(n,4)*(v-EK)-gL*(v-EL));
    return xdot;
}

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

// Simulation parameters 
const tstart=0; //ms
const tstep_up=500; //ms
const tstep_down=1500; //ms
const tend=2000; //ms
const dt=0.01; //ms
const sig=0.01; //mV/ms

// Initial conditions
const v0=-70;
const h0=0.9866;
const n0=0.0307; 

// Initialize all variables
const npoints=(tend-tstart)/dt + 1;
let t=Array(npoints);
let v=Array(npoints);
let h=h0;
let n=n0;
let Iapp=Array(npoints);
let xdot;

t[0]=tstart;
v[0]=v0;
I[npoints-1]=0;

// Simulate
let i;
for (i=0; i<npoints-1; i++) {
    t[i+1]=t[i]+dt;
    Iapp[i]=I*(t[i]>=tstep_up)*(t[i]<=tstep_down);
    xdot=odefun(v[i],h,n,C,ENa,EK,EL,gNa,gK,gL,Iapp[i])
    v[i+1]=v[i]+dt*xdot[0]+sig*randn();
    h=h+dt*xdot[1];
    n=n+dt*xdot[2];
}

// Output to console
//debug(n)

// Plot
function plotLines(xdata,ydata,divlbl,ylbl) {
    let trace = [{
        x: xdata,
        y: ydata,
        mode: 'lines',
        name: 'Line plot',
        line: {
            width: 1.5
        }
    }];

    var layout = {
        height: 250, 
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
            title: ylbl,
            zeroline: false
        }
    }
    Plotly.newPlot(divlbl, trace, layout)
}
plotdiv = document.getElementById("patch_clamp_voltage");
plotLines(t,v,plotdiv,'Voltage [mV]')
plotdiv = document.getElementById("patch_clamp_current");
plotLines(t,Iapp,plotdiv,'Current [uA]')


} // Close function

//runSimulator()