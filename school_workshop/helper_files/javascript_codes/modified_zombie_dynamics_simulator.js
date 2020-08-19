function runSimulator(s0,z0,r,K,a,c,q) {
/* 
Function to run zombie apocalypse simulation with parameter
*/

// Model parameters
//const r=1; // growth rate, year^-1
//const K=250; // carrying capacity
//const a=0.2; // zombie biting rate, year^-1
//const c=0.1; // brain destroying rate, year^-1 
//const q=2; // zombie natural death rate, year^-1

// ODE function
function odefun(s,z,sm,zm,r,K,a,c,q) {
    // Initialize variables
    let xdot=[0,0,0,0];

    xdot[0]=r*s*(1-(s/K))-a*s*z;
    xdot[1]=(a-c)*s*z-q*z;

    xdot[2]=r*sm*(1-(sm/K))-a*sm*zm;
    xdot[3]=(a-c)*sm*zm;

    return xdot;
}

// Simulation parameters 
const tstart=0; // year
const tend=200; // year
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

let sm=Array(npoints);
let zm=Array(npoints);
sm[0]=s0;
zm[0]=z0;

// Simulate
let i;
for (i=0; i<npoints-1; i++) {
    t[i+1]=t[i]+dt;
    xdot=odefun(s[i],z[i],sm[i],zm[i],r,K,a,c,q)
    s[i+1]=s[i]+dt*xdot[0];
    z[i+1]=z[i]+dt*xdot[1];
    sm[i+1]=sm[i]+dt*xdot[2];
    zm[i+1]=zm[i]+dt*xdot[3];
}

// Output to console
//debug(zm)

// Plot
function plotLines2(xdata,ydata1,ydata2,divlbl,col,ylbl) {
    let trace1 = {
        x: xdata,
        y: ydata1,
        mode: 'lines',
        name: 'modified model',
        line: {
            color: col
        }
    };
    let trace2 = {
        x: xdata,
        y: ydata2,
        mode: 'lines',
        name: 'original model',
        line: {
            color: col,
            dash: 'dot'
        }
    };

    let layout = {
        showlegend: true,
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
        },
        legend: {
            x: 0.6,
            y: 0.9,
            bgcolor: 'rgb(240,240,240)'
        }
    };

    trace=[trace1,trace2];
    Plotly.newPlot(divlbl, trace,layout)
}
plotdiv = document.getElementById("modified_human_population");
plotLines2(t,s,sm,plotdiv,'rgb(0,0,0)','Human population')
plotdiv = document.getElementById("modified_zombie_population");
plotLines2(t,z,zm,plotdiv,'rgb(180,0,0)','Zombie population')

} // Close function

// runSimulator()