function runQIF(I,r,th,Ibif,vpeak,vahp,tau) {
/* 
Function to run Hodgkin-Huxley neuron simulation with parameter I as input
Model parameters and equations taken from Tait et al (2018) Journal of Theoretical Biology 449:23-34
*/

//const I=3 ; 

// Model parameters
//const r=-70; // muF/cm^2
//const th=-47; // mV
//const tau=81; // mV
//const Ibif=2.8; // mV
//const vpeak=44; // mS/cm^2
//const vahp=-60; // mS/cm^2

// Get R
const R = Math.pow((th-r),2)/(4*Ibif);

// ODE function
function QIFodefun(v,r,th,tau,R,I) {
    // Initialize variables
    let vdot=(1/tau)*((v-r)*(v-th)+R*I);
    return vdot;
}

// Simulation parameters 
const tstart=0; //ms
const tstep_up=500; //ms
const tstep_down=1500; //ms
const tend=2000; //ms
const dt=0.01; //ms

// Initial conditions
const v0=-70;

// Initialize all variables
const npoints=(tend-tstart)/dt + 1;
let t=Array(npoints);
let v=Array(npoints);
let Iapp=Array(npoints);
let xdot;

t[0]=tstart;
v[0]=v0;
Iapp[npoints-1]=0;

// Simulate
let i;
for (i=0; i<npoints-1; i++) {
    t[i+1]=t[i]+dt;
    Iapp[i]=I*(t[i]>=tstep_up)*(t[i]<=tstep_down);
    xdot=QIFodefun(v[i],r,th,tau,R,Iapp[i])
    v[i+1]=v[i]+dt*xdot;

    if (v[i+1]>vpeak) {
        v[i]=vpeak;
        v[i+1]=vahp;
    }
        
}

// Output to console
//debug(n)

// Plot
function plotLines_QIF(xdata,ydata,divlbl) {
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
            title: "Voltage [mV]",
            zeroline: false
        }
    }

    Plotly.newPlot(divlbl, trace,layout)
}
plotdiv = document.getElementById("simulated_voltage");
plotLines_QIF(t,v,plotdiv)


} // Close function

//runQIF()