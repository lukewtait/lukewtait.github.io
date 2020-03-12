function runEntorhinalModel(dvloc,istheta,istg) {
    /* 
    Function to run entorhinal gamma simulator
    This work is unpublished and highly preliminary, and simulations just serve to demonstrate an example of a weak PING rhythm in the context of the EC
    */

    
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
    // --- MAKE PARAMETERS ----

    // excitatory cells
    // these parameters are based upon Izhikevich's book dynamical systems in neuroscience, with parameters updated to reflect recordings in mice
    // this includes setting C=150pF (Booth et al. 2016) and updating "a" so that oscillations are at ~7 Hz, which is faster than the ~4Hz found in rats and used by Izhikevich
    // value of I0 (constant input) is chosen such that a gamma rhythm is generated
    // Isin is set such that if a theta rythm is generated then it oscillates between 0 and I0
    var e = {
        N:40 , 
        C:150 , 
        k:0.75 , 
        vr:-60 , 
        vt:-45 , 
        a:0.025 ,
        b:15 ,
        vp:30 , 
        c:-50 , 
        d:100 , 
        I0:700 , 
        Isin:700 , 
        sig:0.1}
    // deal with case of no theta rhythm
    if (!istheta) {
        e.Isin=0;
    }
    if (istg & istheta) {
        e.Isin=100 // long range neurodegeneration to reduce theta power
    }

    // inhibitory cells
    // parameters chosen from Ferguson et al (2013), which fits parameters of Izhikevich model to PV+ interneurons in hippocampus
    // I don't know of a study which has done this for EC, but it is likely that dynamics will be similar between EC and hippocampal PV+ interneurons
    // PV+ interneurons are responsible for gamma rhythm in EC (Beed et al 2013) so seems sensible to use this model
    // Parameter "I" chosen such that cells are at rest but excitable, and has variation to introduce heterogeneity
    var i = { 
        N:10 , 
        C:90 , 
        klow:1.7 , 
        khigh:14 , 
        vr:-60.6 , 
        vt:-43.1 , 
        a:0.1 , 
        b:-0.1 ,
        vp:2.5 , 
        c:-67 ,
        d:0.1 , 
        sig:0.01}
    i.I=125+1*randn(i.N,1) ;

    // connectivity
    var conn = { 
        Pei:1, // probability of e->i connection 
        Pie:1-dvloc*(1-0.35), // Probability of i->e connection, dorsal - 1 , ventral 0.35  
        G:30, // synaptic strength 
        taue:1, // synaptic decay time constants
        taui:1}
    conn.gie=2.5*conn.G; // i/e ratio is ~2.5 (Beed et al 2013)
    conn.gei=conn.G;
    if (istg) {
        conn.gei=0.15*conn.G // in discussion of Booth et al, they suggest excitatory neurodegeneration is reason for loss of gamma
    }
    console.log(conn.Pie)

    // make connectivity matrix Kie (i->e)
    let Kei=[];
    let Kie=[];
    let kvec = [] ;
    let j;
    let k;
    for (j=0; j<e.N; j++) {
        kvec=[];
        for (k=0; k<i.N; k++) {
            kvec.push(Math.random()<conn.Pie);
            /*Kie[j][k] = Math.random()<conn.Pie ; 
            Kei[k][j] = Math.random()<conn.Pei ; */
        }
        Kie.push(kvec)
    }
    console.log(Kie)

    // make connectivity matrix Kei (e->i)
    for (j=0; j<i.N; j++) {
        kvec=[];
        for (k=0; k<e.N; k++) {
            kvec.push(Math.random()<conn.Pei);
            /*Kie[j][k] = Math.random()<conn.Pie ; 
            Kei[k][j] = Math.random()<conn.Pei ; */
        }
        Kei.push(kvec)
    }
    console.log(Kei)

    // make wilson-cowan model for theta rhythm
    var w = {
        taue:18,
        cee:10, 
        cei:6, 
        ae:1, 
        be:0, 
        ce:1,
        P:0.5, 
        taui:20,
        cie:10,
        cii:1,
        ai:1,
        bi:0,
        ci:1,
        Q:0,
        the:2,
        thi:3.5};
        
    // make sigmoid functions for wilson-cowan model
    function Se(f,w) {
        let se = w.ce/(1+Math.exp(-w.ae*(f-w.be)));
        return se
    }

    function Si(f,w) {
        let si = w.ci/(1+Math.exp(-w.ai*(f-w.bi)));
        return si
    }

    // --- MAKE TIME AXIS --- 
    const tstart=-500; //ms
    const tend=2000; //ms
    const dt=0.1; //ms
    const npoints=(tend-tstart)/dt + 1;
    let t=Array(npoints);    
    t[0]=tstart;

    // --- SIMULATE WILSON-COWAN MODEL IN MEDIAL SEPTUM ---
    let Edot
    let Idot
    let Ems=Array(npoints);
    let Ims=Array(npoints);
    let indT=Array(npoints);
    Ems[0] = 0 ; 
    Ims[0] = 0 ; 
    indT[0]=false;

    function Edotfun(E,I,w) {
        let Edot = (1/w.taue)*(-E + Se(1.2*(w.cee*E - w.cei*I + w.P - w.the),w));
        return Edot
    }
    function Idotfun(E,I,w) {
        let Idot = (1/w.taui)*(-I + Si(2.0*(w.cie*E - w.cii*I + w.Q - w.thi),w));
        return Idot
    }

    // Simulate
    for (j=0; j<npoints-1; j++) {
        t[j+1]=t[j]+dt;
        Edot=Edotfun(Ems[j],Ims[j],w);
        Ems[j+1]=Ems[j]+dt*Edot;
    
        Idot=Idotfun(Ems[j],Ims[j],w);
        Ims[j+1]=Ims[j]+dt*Idot; 
        
        indT[j+1]=(t[j+1]>=0);
    }

    // normalize from -1 to 0
    function checkGreater0(x){
        return x>=0;
    }
    indT = t.findIndex(checkGreater0);
    Ix = Ims.slice(indT,Ims.length);
    for (j=0; j<npoints; j++){
        Ims[j] = (Ims[j]-0.969594819057338)/0.837977656750625; //Math.max(...Ix); //Ix[j] = Ix[j]-Math.max(...Ix);
    }

    // --- INITIALIZE STELLATE CELLS ---
    let ve = Array(npoints) ; ve[0] = e.vr ; 
    let ue = Array(npoints) ; ue[0] = e.b*(ve[0]-e.vr) ; 
    for (j=0; j<npoints-1; j++) {
        ve[j+1] = ve[j] + dt*( (1/e.C)*(e.k*(ve[j]-e.vr)*(ve[j]-e.vt)-ue[j]) ) + 0.01*randn() ; 
        ue[j+1] = ue[j] + dt*( e.a*(e.b*(ve[j]-e.vr)-ue[j]) ) ; 
        
        if (ve[j+1]>e.vp) {
            ve[j+1]=e.c ; 
            ue[j+1]=ue[j+1]+e.d ; 
        }
    }
    let idx = [] ;
    let ve0 = [] ; let vi0 = [];
    let ue0 = [] ; let ui0 = [];
    for (j=0; j<e.N; j++) {
        idx = Math.floor((npoints-indT)*Math.random())+indT;
        ve0[j] = ve[idx];
        ue0[j] = ue[idx];
        vi0[j] = -53.4666 ;
        ui0[j] = -0.7133 ; 
    }

    // --- SIMULATE NETWORK ---


    ve = ve0 ;
    console.log(ve)
    ue = ue0 ; 
    let vi = vi0 ; 
    let ui = ui0 ; 
    let sie = Array(e.N); 
    let sei = Array(i.N);
    for (j=0; j<e.N; j++) {
        sie[j] = Math.random();
    }
    for (j=0; j<i.N; j++) {
        sei[j] = Math.random();
    }
    let lfp = Array(npoints);
    for (j=0; j<npoints; j++){
        lfp[j]=-65;
    }

    let ape=[];
    let tse=[];
    let api=[];
    let tsi=[];
    let Isyn_e = [];
    let Isyn_i = [];
    let hasspikede;
    let hasspikedi;
    
    function mean(arr) {
        let n = 0;
        for (ni=0; ni<arr.length; ni++) {
            n=n+arr[ni];
        }
        n=n/arr.length;
        return n
    }

    
    // simulate
    for (j=0; j<npoints-1; j++) {
        //console.log(j)

        
        // excitatory
        hasspikede=Array(e.N);
        for (k=0; k<e.N; k++) {
            // make synpatic currents
            Isyn_e = -conn.gie*sie[k]*(ve[k]+80) ;

            // update excitatory cells
            ve[k] = ve[k] + dt*( (1/e.C)*(e.k*(ve[k]-e.vr)*(ve[k]-e.vt)-ue[k]+e.I0+e.Isin*Ims[j] + Isyn_e) ) + 0.5*randn() ;
            ue[k] = ue[k] + dt*( e.a*(e.b*(ve[k]-e.vr)-ue[k]) ) ;

            // check if spiked
            hasspikede[k]=0;
            if (ve[k]>e.vp) {
                hasspikede[k]=1;
                ve[k]=e.c;
                ue[k]=ue[k]+e.d;
                ape.push(k);
                tse.push(t[j]);
            }
        }

        // inhibitory
        hasspikedi=Array(i.N);
        for (k=0; k<i.N; k++) {
            // make synpatic currents
            Isyn_i[k] = -conn.gei*sei[k]*(vi[k]-0) ;

            // update inhibitory cells
            if (vi[k]>i.vt) {
                ki=i.khigh;
            } else {
                ki=i.klow;
            }
            vi[k] = vi[k] + dt*( (1/i.C)*(ki*(vi[k]-i.vr)*(vi[k]-i.vt)-ui[k]+i.I + Isyn_i[k]) ) + 0.01*randn() ; 
            ui[k] = ui[k] + dt*( i.a*(i.b*(vi[k]-i.vr)-ui[k]) ) ; 

            // check if spiked
            hasspikedi[k]=0;
            if (vi[k]>i.vp) {
                hasspikedi[k]=1;
                vi[k]=i.c;
                ui[k]=ui[k]+i.d;
                api.push(k+e.N);
                tsi.push(t[j]);
            }
        }

        // update synapses - excitatory
        for (k=0; k<e.N; k++) {
            // synaptic decay
            sie[k] = sie[k] + dt*( -sie[k]/conn.taui );
            
            // did the inhibitory cell spike?
            n = 0;
            for (ki=0; ki<i.N; ki++) {
                n=n+hasspikedi[ki]*Kie[k][ki];
            }

            sie[k] = sie[k]+n;
        }

        //updated synapses - inhibitory
        for (k=0; k<i.N; k++) {
            // synaptic decay
            sei[k] = sei[k] + dt*( -sei[k]/conn.taue );

            // did the excitatory cell spike?
            n=0;
            for (ki=0; ki<e.N; ki++) {
                n=n+hasspikede[ki]*Kei[k][ki];
            }

            sei[k] = sei[k]+n;
        }

        //console.log(sei)
        lfp[j+1] = lfp[j] + dt*((1/12)*(-(lfp[j]-65) - mean(Isyn_i)) + (Math.sqrt(3)/i.N)*(e.I0+e.Isin*Ims[j])) ;
        // note 3 here is a scaling factor chosen such that the theta/gamma
        // ratio of LFP matches experimental values
        
    }




    // ------ MAKE PLOT OUTPUT ------
    lfp = lfp.slice(indT,lfp.length);
    t = t.slice(indT,t.length);

    mlfp=mean(lfp);

    // do a global rescaling of the LFP such that dorsal gamma is approx in line with Booth et al (2016)
    // this doesn't make any difference, since it is controlled by conductance of tissue. distance from electrodes to cells, number of cells, etc
    if (e.Isin == 0) {
        A=6e-4;
    } else {
        A=0.72;
    }
    for (j=0; j<=npoints; j++) {
        lfp[j] = A*(lfp[j]-mlfp);
    }


    // Plot
    function plotLines(xdata,ydata,divlbl,ystr) {
        let trace = [{
            x: xdata,
            y: ydata,
            mode: 'lines',
            name: 'Line plot'
        }];

        var ylim=[-0.4,0.2];
        if (istheta) {
            ylim=[-500,500];
        }
    
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
                zeroline: false,
                range:ylim
            }
        }
        Plotly.newPlot(divlbl, trace,layout)
    }


    // Plot
    function plotRaster(xedata,yedata,xidata,yidata,divlbl,ystr) {
        let trace = [{
            x: xedata,
            y: yedata,
            mode: 'markers',
            marker: {
                color: 'rgb(0, 0, 0)',
                size: 2
              },
            name: 'Line plot'
        } , {
            x: xidata,
            y: yidata,
            marker: {
                color: 'rgb(255, 0, 0)',
                size: 2
              },
            mode: 'markers',
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
                zeroline: false,
                range: [0,2000]
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
                range: [-1,50]
            },
            showlegend:false
        }
        Plotly.newPlot(divlbl, trace,layout)
    }



    plotdiv = document.getElementById("simulated_lfp");
    plotLines(t,lfp,plotdiv,"LFP")

    plotdiv = document.getElementById("output_raster");
    plotRaster(tse,ape,tsi,api,plotdiv,"Cell number")

    } // Close function
    
    //runQIF()