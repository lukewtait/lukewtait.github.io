function runIzhikevichModel(I,C,k,vr,vp,a,b,vpeak,c,d) {
/* 
Function to run Hodgkin-Huxley neuron simulation with parameter I as input
Model parameters and equations taken from Tait et al (2018) Journal of Theoretical Biology 449:23-34
*/


// ODE function
function vdotfun(v,u,C,k,vr,vp,I) {
    // Initialize variables
    let vdot=(1/C)*(k*(v-vr)*(v-vp)-u+I);
    return vdot;
}

function udotfun(v,u,a,b,vr) {
    let udot=a*(b*(v-vr)-u);
    return udot;
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
const v0=vr;
const u0=b*(v0-vr);

// Initialize all variables
const npoints=(tend-tstart)/dt + 1;
let t=Array(npoints);
let v=Array(npoints);
let u=Array(npoints);
let Iapp=Array(npoints);
let vdot;
let udot;

t[0]=tstart;
v[0]=v0;
u[0]=u0;
Iapp[npoints-1]=0;

// Simulate
let i;
for (i=0; i<npoints-1; i++) {
    t[i+1]=t[i]+dt;
    Iapp[i]=I*(t[i]>=tstep_up)*(t[i]<=tstep_down);
    vdot=vdotfun(v[i],u[i],C,k,vr,vp,Iapp[i])
    v[i+1]=v[i]+dt*vdot+sig*randn();

    udot=udotfun(v[i],u[i],a,b,vr)
    u[i+1]=u[i]+dt*udot;

    if (v[i+1]>vpeak) {
        v[i]=vpeak;
        v[i+1]=c;
        u[i+1]=u[i+1]+d;
    }
        
}

// Output to console
//console.log(v)

// Plot
function plotLines_V(xdata,ydata,divlbl,ystr) {
    let trace = [{
        x: xdata,
        y: ydata,
        mode: 'lines',
        name: 'Line plot'
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
            title: ystr,
            zeroline: false
        },
    }
    Plotly.newPlot(divlbl, trace,layout)
}
plotdiv = document.getElementById("simulated_voltage");
plotLines_V(t,v,plotdiv,"Voltage [mV]")


// Plot
function plotLines_I(xdata,ydata,divlbl,ystr) {
    let trace = [{
        x: xdata,
        y: ydata,
        mode: 'lines',
        name: 'Line plot'
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
            title: ystr,
            zeroline: false,
            range: [-Irange , Irange]
        },
    }
    Plotly.newPlot(divlbl, trace,layout)
}
plotdiv = document.getElementById("output_current");
plotLines_I(t,Iapp,plotdiv,"Input current [\muA]",true)


} // Close function

//runQIF()