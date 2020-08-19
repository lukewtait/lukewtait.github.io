function runSimulator(s0,z0,r,K,a,c) {
/* 
Function to run zombie apocalypse simulation with parameter
*/

// Model parameters
//const r=1; // growth rate, year^-1
//const K=250; // carrying capacity
//const a=0.1; // zombie biting rate, year^-1
//const c=0.2; // brain destroying rate, year^-1 

// ODE function
function odefun(s,z,r,K,a,c) {
    // Initialize variables
    let xdot=[0,0];

    xdot[0]=r*s*(1-(s/K))-a*s*z;
    xdot[1]=(a-c)*s*z;

    return xdot;
}

// Simulation parameters 
const tstart=0; // year
const tend=10; // year
const dt=1/365; // year

// Initial conditions
//const s0=200; // initial population of humans
//const z0=1; // initial population of zombies

// Initialize all variables
const npoints=(tend-tstart)/dt + 1;
let t=Array(npoints);
let s=Array(npoints);
let z=Array(npoints);
let xdot;

t[0]=tstart;
s[0]=s0;
z[0]=z0;

// Simulate
let i;
for (i=0; i<npoints-1; i++) {
    t[i+1]=t[i]+dt;
    xdot=odefun(s[i],z[i],r,K,a,c)
    s[i+1]=s[i]+dt*xdot[0];
    z[i+1]=z[i]+dt*xdot[1];
}

// Output to console
//debug(n)

// Plot
function plotLines(xdata,ydata,divlbl,col,ylbl) {
    let trace = [{
        x: xdata,
        y: ydata,
        mode: 'lines',
        line: {
            color: col
        }
    }];

    let layout = {
        showlegend: false,
        height: 500, 
        width: 500, 
        xaxis: {
            showline: true,
            showgrid: false,
            showticklabels: true,
            linewidth: 2,
            tickfont: {
                family: 'Arial',
                size: 12
            },
            title: 'Time [years]'
        },
        yaxis: {
            showline: true,
            showgrid: false,
            showticklabels: true,
            linewidth: 2,
            tickfont: {
                family: 'Arial',
                size: 12
            },
            title: ylbl,
            rangemode: 'nonnegative'
        }
    };
    Plotly.newPlot(divlbl, trace,layout);
}
plotdiv = document.getElementById("human_population");
plotLines(t,s,plotdiv,'rgb(0,0,0)','Human population')
plotdiv = document.getElementById("zombie_population");
plotLines(t,z,plotdiv,'rgb(180,0,0)','Zombie population')


} // Close function

//runSimulator()