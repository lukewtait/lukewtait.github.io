function simulateOscFunction() {
    
    // Get the type of coupling
    var form = document.getElementById("selectFCform");
    var data = new FormData(form);
    for (const entry of data){
        fctype=entry[1];
    };

    // Get global coupling value
    const G=Number(document.getElementById("Glconnectivity").value);

    // Make coupling values
    const k_lo_lf=G*(0.5+0.5*Math.random());
    const k_ro_lo=G*(0.5+0.5*Math.random());
    const k_rp_ro=G*(0.5+0.5*Math.random());
    const k_lf_rf=G*(0.5+0.5*Math.random());
    const k_rp_rf=G*(0.5+0.5*Math.random());

    // Make parameters
    let tstart=-2;
    let tend=20;
    let dt=0.001;
    let npoints=(tend-tstart)/dt + 1;
    const a=-0.05;
    let w=Array(5);
    let t=Array(npoints); t[0] = tstart;
    for (i=0; i<5; i++) {
        w[i]=2*Math.PI*(8+5*Math.random());
    }

    // Initialize
    let v_lf=Array(npoints); v_lf[0]=1;
    let v_lo=Array(npoints); v_lo[0]=1;
    let v_rf=Array(npoints); v_rf[0]=1;
    let v_ro=Array(npoints); v_ro[0]=1;
    let v_rp=Array(npoints); v_rp[0]=1;

    let u_lf=Array(npoints); u_lf[0]=0;
    let u_lo=Array(npoints); u_lo[0]=0;
    let u_rf=Array(npoints); u_rf[0]=0;
    let u_ro=Array(npoints); u_ro[0]=0;
    let u_rp=Array(npoints); u_rp[0]=0;

    let r_lf=Array(npoints); r_lf[0]=1;
    let r_lo=Array(npoints); r_lo[0]=1;
    let r_rf=Array(npoints); r_rf[0]=1;
    let r_ro=Array(npoints); r_ro[0]=1;
    let r_rp=Array(npoints); r_rp[0]=1;

    let p_lf=Array(npoints); p_lf[0]=0;
    let p_lo=Array(npoints); p_lo[0]=0;
    let p_rf=Array(npoints); p_rf[0]=0;
    let p_ro=Array(npoints); p_ro[0]=0;
    let p_rp=Array(npoints); p_rp[0]=0;

    // switch between the difference cases
    switch (fctype) {
        case "Add": 
            for (i=0; i<npoints-1; i++) {
                
                t[i+1] = t[i]+dt;

                v_lf[i+1]=v_lf[i] + dt*( (a-v_lf[i]**2-u_lf[i]**2)*v_lf[i] - w[0]*u_lf[i] + k_lo_lf*v_lo[i] ) + 0.02*randn();
                v_lo[i+1]=v_lo[i] + dt*( (a-v_lo[i]**2-u_lo[i]**2)*v_lo[i] - w[1]*u_lo[i] + k_ro_lo*v_ro[i] ) + 0.02*randn();
                v_rf[i+1]=v_rf[i] + dt*( (a-v_rf[i]**2-u_rf[i]**2)*v_rf[i] - w[2]*u_rf[i] + k_lf_rf*v_lf[i] + k_rp_rf*v_rp[i] ) + 0.02*randn();
                v_ro[i+1]=v_ro[i] + dt*( (a-v_ro[i]**2-u_ro[i]**2)*v_ro[i] - w[3]*u_ro[i] + k_rp_ro*v_rp[i] ) + 0.02*randn();
                v_rp[i+1]=v_rp[i] + dt*( (a-v_rp[i]**2-u_rp[i]**2)*v_rp[i] - w[4]*u_rp[i] ) + 0.02*randn();

                u_lf[i+1]=u_lf[i] + dt*( (a-v_lf[i]**2-u_lf[i]**2)*v_lf[i] + w[0]*v_lf[i] );
                u_lo[i+1]=u_lo[i] + dt*( (a-v_lo[i]**2-u_lo[i]**2)*v_lo[i] + w[1]*v_lo[i] );
                u_rf[i+1]=u_rf[i] + dt*( (a-v_rf[i]**2-u_rf[i]**2)*v_rf[i] + w[2]*v_rf[i] );
                u_ro[i+1]=u_ro[i] + dt*( (a-v_ro[i]**2-u_ro[i]**2)*v_ro[i] + w[3]*v_ro[i] );
                u_rp[i+1]=u_rp[i] + dt*( (a-v_rp[i]**2-u_rp[i]**2)*v_rp[i] + w[4]*v_rp[i] );

                r_lf[i+1]=Math.sqrt(v_lf[i+1]**2 + u_lf[i]**2);
                r_lo[i+1]=Math.sqrt(v_lo[i+1]**2 + u_lo[i]**2);
                r_rf[i+1]=Math.sqrt(v_rf[i+1]**2 + u_rf[i]**2);
                r_ro[i+1]=Math.sqrt(v_ro[i+1]**2 + u_ro[i]**2);
                r_rp[i+1]=Math.sqrt(v_rp[i+1]**2 + u_rp[i]**2);

                p_lf[i+1]=Math.atan(u_lf[i+1]/v_lf[i+1]);
                p_lo[i+1]=Math.atan(u_lo[i+1]/v_lo[i+1]);
                p_rf[i+1]=Math.atan(u_rf[i+1]/v_rf[i+1]);
                p_ro[i+1]=Math.atan(u_ro[i+1]/v_ro[i+1]);
                p_rp[i+1]=Math.atan(u_rp[i+1]/v_rp[i+1]);
            }
            break;

        case "Dif":
            for (i=0; i<npoints-1; i++) {
                
                t[i+1] = t[i]+dt;

                v_lf[i+1]=v_lf[i] + dt*( (a-v_lf[i]**2-u_lf[i]**2)*v_lf[i] - w[0]*u_lf[i] + k_lo_lf*(v_lo[i]-v_lf[i]) ) + 0.02*randn();
                v_lo[i+1]=v_lo[i] + dt*( (a-v_lo[i]**2-u_lo[i]**2)*v_lo[i] - w[1]*u_lo[i] + k_ro_lo*(v_ro[i]-v_lo[i]) ) + 0.02*randn();
                v_rf[i+1]=v_rf[i] + dt*( (a-v_rf[i]**2-u_rf[i]**2)*v_rf[i] - w[2]*u_rf[i] + k_lf_rf*(v_lf[i]-v_rf[i]) + k_rp_rf*(v_rp[i]-v_rf[i]) ) + 0.02*randn();
                v_ro[i+1]=v_ro[i] + dt*( (a-v_ro[i]**2-u_ro[i]**2)*v_ro[i] - w[3]*u_ro[i] + k_rp_ro*(v_rp[i]-v_ro[i]) ) + 0.02*randn();
                v_rp[i+1]=v_rp[i] + dt*( (a-v_rp[i]**2-u_rp[i]**2)*v_rp[i] - w[4]*u_rp[i] ) + 0.02*randn();

                u_lf[i+1]=u_lf[i] + dt*( (a-v_lf[i]**2-u_lf[i]**2)*v_lf[i] + w[0]*v_lf[i] );
                u_lo[i+1]=u_lo[i] + dt*( (a-v_lo[i]**2-u_lo[i]**2)*v_lo[i] + w[1]*v_lo[i] );
                u_rf[i+1]=u_rf[i] + dt*( (a-v_rf[i]**2-u_rf[i]**2)*v_rf[i] + w[2]*v_rf[i] );
                u_ro[i+1]=u_ro[i] + dt*( (a-v_ro[i]**2-u_ro[i]**2)*v_ro[i] + w[3]*v_ro[i] );
                u_rp[i+1]=u_rp[i] + dt*( (a-v_rp[i]**2-u_rp[i]**2)*v_rp[i] + w[4]*v_rp[i] );

                r_lf[i+1]=Math.sqrt(v_lf[i+1]**2 + u_lf[i]**2);
                r_lo[i+1]=Math.sqrt(v_lo[i+1]**2 + u_lo[i]**2);
                r_rf[i+1]=Math.sqrt(v_rf[i+1]**2 + u_rf[i]**2);
                r_ro[i+1]=Math.sqrt(v_ro[i+1]**2 + u_ro[i]**2);
                r_rp[i+1]=Math.sqrt(v_rp[i+1]**2 + u_rp[i]**2);

                p_lf[i+1]=Math.atan(u_lf[i+1]/v_lf[i+1]);
                p_lo[i+1]=Math.atan(u_lo[i+1]/v_lo[i+1]);
                p_rf[i+1]=Math.atan(u_rf[i+1]/v_rf[i+1]);
                p_ro[i+1]=Math.atan(u_ro[i+1]/v_ro[i+1]);
                p_rp[i+1]=Math.atan(u_rp[i+1]/v_rp[i+1]);
            }
            break;



        case "Pha":
            for (i=0; i<npoints-1; i++) {
                
                t[i+1] = t[i]+dt;

                r_lf[i+1]=r_lf[i] + dt*( (a-r_lf[i]**2)*r_lf[i] ) + 0.02*randn();
                r_lo[i+1]=r_lo[i] + dt*( (a-r_lo[i]**2)*r_lo[i] ) + 0.02*randn();
                r_rf[i+1]=r_rf[i] + dt*( (a-r_rf[i]**2)*r_rf[i] ) + 0.02*randn();
                r_ro[i+1]=r_ro[i] + dt*( (a-r_ro[i]**2)*r_ro[i] ) + 0.02*randn();
                r_rp[i+1]=r_rp[i] + dt*( (a-r_rp[i]**2)*r_rp[i] ) + 0.02*randn();

                p_lf[i+1]=p_lf[i] + dt*( w[0] + 0.1*k_lo_lf*(p_lo[i]-p_lf[i]) ) + 0.02*randn();
                p_lo[i+1]=p_lo[i] + dt*( w[1] + 0.1*k_ro_lo*(p_ro[i]-p_lo[i]) ) + 0.02*randn();
                p_rf[i+1]=p_rf[i] + dt*( w[2] + 0.1*k_lf_rf*(p_lf[i]-p_rf[i]) + 0.1*k_rp_rf*(p_rp[i]-p_rf[i]) ) + 0.02*randn();
                p_ro[i+1]=p_ro[i] + dt*( w[3] + 0.1*k_rp_ro*(p_rp[i]-p_ro[i]) ) + 0.02*randn();
                p_rp[i+1]=p_rp[i] + dt*( w[4] ) + 0.02*randn();

                v_lf[i+1]=r_lf[i+1]*Math.cos(p_lf[i+1]);
                v_lo[i+1]=r_lo[i+1]*Math.cos(p_lo[i+1]);
                v_rf[i+1]=r_rf[i+1]*Math.cos(p_rf[i+1]);
                v_ro[i+1]=r_ro[i+1]*Math.cos(p_ro[i+1]);
                v_rp[i+1]=r_rp[i+1]*Math.cos(p_rp[i+1]);

                u_lf[i+1]=r_lf[i+1]*Math.sin(p_lf[i+1]);
                u_lo[i+1]=r_lo[i+1]*Math.sin(p_lo[i+1]);
                u_rf[i+1]=r_rf[i+1]*Math.sin(p_rf[i+1]);
                u_ro[i+1]=r_ro[i+1]*Math.sin(p_ro[i+1]);
                u_rp[i+1]=r_rp[i+1]*Math.sin(p_rp[i+1]);
            }
            break;

        case "Amp":
            for (i=0; i<npoints-1; i++) {
                
                t[i+1] = t[i]+dt;

                r_lf[i+1]=Math.abs(r_lf[i] + dt*( (a-r_lf[i]**2)*r_lf[i] + k_lo_lf*(r_lo[i]-r_lf[i]) ) + 0.02*randn() );
                r_lo[i+1]=Math.abs(r_lo[i] + dt*( (a-r_lo[i]**2)*r_lo[i] + k_ro_lo*(r_ro[i]-r_lo[i]) ) + 0.02*randn() );
                r_rf[i+1]=Math.abs(r_rf[i] + dt*( (a-r_rf[i]**2)*r_rf[i] + k_lf_rf*(r_lf[i]-r_rf[i]) + k_rp_rf*(r_rp[i]-r_rf[i]) ) + 0.02*randn() );
                r_ro[i+1]=Math.abs(r_ro[i] + dt*( (a-r_ro[i]**2)*r_ro[i] + k_rp_ro*(r_rp[i]-r_ro[i]) ) + 0.02*randn() );
                r_rp[i+1]=Math.abs(r_rp[i] + dt*( (a-r_rp[i]**2)*r_rp[i] ) + 0.02*randn() );

                p_lf[i+1]=p_lf[i] + dt*( w[0] );
                p_lo[i+1]=p_lo[i] + dt*( w[1] );
                p_rf[i+1]=p_rf[i] + dt*( w[2] );
                p_ro[i+1]=p_ro[i] + dt*( w[3] );
                p_rp[i+1]=p_rp[i] + dt*( w[4] );

                v_lf[i+1]=r_lf[i+1]*Math.cos(p_lf[i+1]);
                v_lo[i+1]=r_lo[i+1]*Math.cos(p_lo[i+1]);
                v_rf[i+1]=r_rf[i+1]*Math.cos(p_rf[i+1]);
                v_ro[i+1]=r_ro[i+1]*Math.cos(p_ro[i+1]);
                v_rp[i+1]=r_rp[i+1]*Math.cos(p_rp[i+1]);

                u_lf[i+1]=r_lf[i+1]*Math.sin(p_lf[i+1]);
                u_lo[i+1]=r_lo[i+1]*Math.sin(p_lo[i+1]);
                u_rf[i+1]=r_rf[i+1]*Math.sin(p_rf[i+1]);
                u_ro[i+1]=r_ro[i+1]*Math.sin(p_ro[i+1]);
                u_rp[i+1]=r_rp[i+1]*Math.sin(p_rp[i+1]);
            }
            break;

    }

    // REMOVE THE INITIALIZATION
    function checkGreater0(x){
        return x>=0;
    }
    let indT = t.findIndex(checkGreater0);
    r_lf=r_lf.slice(indT,npoints);
    r_lo=r_lo.slice(indT,npoints);
    r_rf=r_rf.slice(indT,npoints);
    r_ro=r_ro.slice(indT,npoints);
    r_rp=r_rp.slice(indT,npoints);

    p_lf=p_lf.slice(indT,npoints);
    p_lo=p_lo.slice(indT,npoints);
    p_rf=p_rf.slice(indT,npoints);
    p_ro=p_ro.slice(indT,npoints);
    p_rp=p_rp.slice(indT,npoints);

    v_lf=v_lf.slice(indT,npoints);
    v_lo=v_lo.slice(indT,npoints);
    v_rf=v_rf.slice(indT,npoints);
    v_ro=v_ro.slice(indT,npoints);
    v_rp=v_rp.slice(indT,npoints);

    u_lf=u_lf.slice(indT,npoints);
    u_lo=u_lo.slice(indT,npoints);
    u_rf=u_rf.slice(indT,npoints);
    u_ro=u_ro.slice(indT,npoints);
    u_rp=u_rp.slice(indT,npoints);

    t = t.slice(indT,t.length);
    npoints=t.length;


    let V = Array(5);
    V[0] = v_lf;
    V[1] = v_lo;
    V[2] = v_rf;
    V[3] = v_ro;
    V[4] = v_rp;
    
    let A = Array(5);
    A[0] = r_lf;
    A[1] = r_lo;
    A[2] = r_rf;
    A[3] = r_ro;
    A[4] = r_rp;
    for (i=0; i<5; i++) {
        for (j=0; j<npoints; j++) {
            V[i][j]=V[i][j]+5*i;
            A[i][j]=A[i][j]+5*i;
        }
    }

    // Plot dynamics
    function plotTimeSeries(t,V) {
        let data=Array(5);
        let names=['L-IF','L-LO','R-IF','R-LO','R-PM'];
        for (i=0; i<5; i++) {
            data[i] = {
                x: t,
                y: V[i],
                mode: 'lines',
                name: names[i]
            }
        }

        var layout = {
            //height: auto,
            showlegend: false, 
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
                title: 'Region',
                zeroline: false,
                tickvals:[0, 5, 10, 15, 20],
                ticktext: names
                //range:ylim
            }
        }
        divlbl = document.getElementById("simulated_FCtime");
        Plotly.newPlot(divlbl, data,layout)
    }

    function plotAmp(t,V,A) {
        let data=Array(10);
        let names=['L-IF','L-LO','R-IF','R-LO','R-PM'];
        for (i=0; i<5; i++) {
            data[i] = {
                x: t,
                y: V[i],
                mode: 'lines',
                name: names[i]
            }
            data[i+5] = {
                x: t,
                y: A[i],
                mode: 'lines',
                name: names[i].concat(' Amplitude')
            }
        }

        var layout = {
            //height: auto, 
            showlegend: false,
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
                title: 'Region',
                zeroline: false,
                tickvals:[0, 5, 10, 15, 20],
                ticktext: ['l-lf', 'l-lo', 'r-rf', 'r-ro', 'r-rp']
                //range:ylim
            }
        }
        divlbl = document.getElementById("simulated_FCtime");
        Plotly.newPlot(divlbl, data,layout)
    }

    if (fctype == "Amp") {
        plotAmp(t,V,A)
    } else {
        plotTimeSeries(t,V)
    }




    function corr(x) {

        let n = x.length; // number of time series

        let m
        let z
        let Z=Array(n);
        let u
        let i
        let v

        console.log(x)
        console.log(z)
        
        for (m=0; m<n; m++) {
            z=x[m];
            console.log(z)
            
            // set to zero mean
            u=0;
            for (i=0; i<z.length; i++) {
                u = u+(z[i]/z.length);
            }
            for (i=0; i<z.length; i++) {
                z[i]=z[i]-u;
            }
            
            // set to unit standard deviation
            v=0; // variance
            for (i=0; i<z.length; i++) {
                v = v+(z[i]**2/(z.length-1));
            }
            for (i=0; i<z.length; i++) {
                z[i]=z[i]/Math.sqrt(v);
            }
            
            Z[m] = z;
        }

        // calculate correlations
        let C = Array(n) ; 
        let zm
        let zq
        let Cm
        let c
        let q
        for (m=0; m<n; m++) {
            zm = Z[m] ; 
            Cm = Array(n);
            for (q=0; q<n; q++) {
                c = 0 ;
                zq = Z[q];
                for (i=0; i<npoints; i++) {
                    c=c+(zm[i]*zq[i])/npoints ;
                }
                Cm[q]=Math.abs(c);
            }
            C[m]=Cm;
        }
        return C
    }


    function plf(x) {

        let n = x.length; // number of time series
        let npoints = x[0].length;
        
        // calculate phase locking
        let C = Array(n) ; 
        let m
        let q
        let i
        let xm
        let xq
        let Cm
        let ci
        let cr

        for (m=0; m<n; m++) {
            xm = X[m] ; 
            Cm = Array(n);
            for (q=0; q<n; q++) {
                ci = 0 ;
                cr = 0 ;
                xq = X[q];
                for (i=0; i<npoints; i++) {
                    dx = xm[i]-xq[i];
                    cr = cr+(Math.cos(dx)/npoints);
                    ci = ci+(Math.sin(dx)/npoints);
                }
                Cm[q]=Math.sqrt((cr**2)+(ci**2));
            }
            C[m]=Cm;
        }
        return C
    }


    // Plot functional connectivity
    function imagesc(plotdiv,C,AEC,PLF,ttl) {
        
        
        var Cdata = {
            type: 'heatmap',
            z: C,
            x: ['L-IF','L-LO','R-IF','R-LO','R-PM'],
            y: ['L-IF','L-LO','R-IF','R-LO','R-PM'],
            showscale: false,
            colorscale: [[0,'#cccccc'],[1,'#ff4444']],
            zmin:0,
            zmax:1
          } ; 
        
        var AECdata = {
            type: 'heatmap',
            z: AEC,
            x: ['L-IF','L-LO','R-IF','R-LO','R-PM'],
            y: ['L-IF','L-LO','R-IF','R-LO','R-PM'],
            xaxis: 'x2',
            yaxis: 'y2',
            showscale: false,
            colorscale: [[0,'#cccccc'],[1,'#ff4444']],
            zmin:0,
            zmax:1
        }

        var PLFdata = {
            type: 'heatmap',
            z: PLF,
            x: ['L-IF','L-LO','R-IF','R-LO','R-PM'],
            y: ['L-IF','L-LO','R-IF','R-LO','R-PM'],
            xaxis: 'x3',
            yaxis: 'y3',
            showscale: true,
            colorscale: [[0,'#cccccc'],[1,'#ff4444']],
            zmin:0,
            zmax:1
        }

        var data = [Cdata,AECdata,PLFdata];

        var layout =  {
            margin: {
                l: 50,
                r: 15, 
                b: 35,
                t: 30
            },
            title: {
                text: 'Connectivity (correlation, amplitude, phase)'
            },
            xaxis: {domain: [0, 0.32]},
            xaxis2: {domain: [0.34, 0.66], anchor: 'y2'},
            yaxis2: {anchor: 'x2',tickmode:'array',tickvals:[]},
            xaxis3: {domain: [0.68, 1], anchor: 'y3'},
            yaxis3: {anchor: 'x3',tickmode:'array',tickvals:[]},
            showlegend: false
          }
        
        Plotly.newPlot(plotdiv,data,layout)
        
    } 
    
    //correlation
    let X = Array(5);
    X[0] = v_lf;
    X[1] = v_lo;
    X[2] = v_rf;
    X[3] = v_ro;
    X[4] = v_rp;
    console.log(X)
    let C = corr(X);
    //amplitude envelope correlation
    X[0] = r_lf;
    X[1] = r_lo;
    X[2] = r_rf;
    X[3] = r_ro;
    X[4] = r_rp;
    AEC = corr(X);
    //plf
    X[0] = p_lf;
    X[1] = p_lo;
    X[2] = p_rf;
    X[3] = p_ro;
    X[4] = p_rp;
    PLF = plf(X);
    plotdiv = document.getElementById("simulated_FC");
    imagesc(plotdiv,C,AEC,PLF,["Corr","AEC","PLF"]);

}