// V15_ILLUMINATED

'use strict';

const C = require('./layout_common');
const Track = require('./layout_track');

const palette = () => ({
  bg:'#000000', face0:'#202734', face1:'#05080E',
  bezel:'#C7D1DC', bezel2:'#4B5360',
  tick:'#FFFFFF', minor:'#A5B2C3', num:'#FFFFFF',
  glow:'#FF263C', red:'#FF3048', needle:'#FF344A',
  hub:'#15171B', accent:'#FF3448',
  text:'#FFFFFF', dim:'#999FA9',
  ev:'#00BFFF', regen:'#3DDC84',
  track:'#252830'
});

const white = t => ({
  color:[t.text,1], glow:[t.glow,0.06]
});
const muted = t => ({
  color:[t.dim,1], glow:[t.glow,0]
});
const blue = t => ({
  color:[t.ev,1], glow:[t.ev,0.15]
});

function colors(t, battery=false) {
  return {
    face0:t.face0, face1:t.face1,
    bezel:t.bezel, bezel2:t.bezel2,
    tick:battery?'#67D7FF':t.tick,
    minor:battery?'#267CA8':'#A5B2C3',
    num:battery?'#67D7FF':t.num,
    red:battery?t.ev:t.red,
    needle:battery?t.ev:t.needle,
    hub:t.hub, accent:battery?t.ev:t.accent,
    glow:battery?t.ev:t.glow
  };
}

function dial(key,cx,cy,size,scale,value,battery=false) {
  const k=size/640;
  return {
    key,kind:'dial',z:key==='rpmDial'?10:1,
    x:cx-size/2,y:cy-size/2,w:size,h:size,
    params:{
      u_scale:[scale[0],scale[1],scale[2],scale[0]+1],
      u_arc:[-135,135,44*k,220*k],
      u_needle_dim:[283*k,50*k,17*k,5],
      u_look:[1.4,0.95,0,0],
      u_look2:[16*k,k,1.4,1]
    },
    colors:t=>colors(t,battery),
    max:scale[0],sweep:true,value
  };
}

function infoBox(key,x,label,reading,colour=white) {
  return [
    {
      key:key+'Panel',kind:'panel',
      x,y:575,w:260,h:95,
      params:{u_box:[12,2,0.4,1]},
      colors:()=>({
        top:'#1B1D22',
        bottom:'#0C0D10',
        border:'#353941'
      })
    },
    C.text(key+'Label',x+10,590,240,23,
      label,muted),
    C.text(key+'Value',x+10,621,240,35,
      reading,colour)
  ];
}

module.exports = {
  id:'gt3_hybrid',
  title:'GT3 Hybrid',
  palette,
  gearText:C.gearText,

  pieces(o) {
    if(o.centre==='map'||o.centre==='stock')
      return Track.pieces(o);

    const rpm=C.rpmScale(o);
    const speed=C.speedScale(o);

    return [
      C.flat('bg',0,0,1920,720,'bg'),

      // V8: matte graphite OEM cockpit surface
      {
        key:'v8CockpitSurface',
        kind:'panel',
        x:0,y:0,w:1920,h:720,
        z:-5,
        params:{u_box:[0,0,0.2,1]},
        colors:()=>({
          top:'#111318',
          bottom:'#07080B',
          border:'#111318'
        })
      },

      // Subtle centre instrument surround
      {
        key:'v8InstrumentSurround',
        kind:'panel',
        x:195,y:48,w:1530,h:475,
        z:-4,
        params:{u_box:[35,1,0.25,1]},
        colors:()=>({
          top:'#171A20',
          bottom:'#0C0E12',
          border:'#242831'
        })
      },

      // OEM-style metallic separator lines
      C.flat('v8TopAccent',245,60,1430,2,'bezel2'),
      C.flat('v8LowerAccent',205,610,1510,2,'bezel2'),



      // V6: dark cockpit side panels
      {
        key:'v6LeftPanel',kind:'panel',
        x:12,y:165,w:175,h:320,
        params:{u_box:[14,1,0.4,1]},
        colors:()=>({
          top:'#15171C',
          bottom:'#08090C',
          border:'#30343C'
        })
      },
      {
        key:'v6RightPanel',kind:'panel',
        x:1733,y:165,w:175,h:320,
        params:{u_box:[14,1,0.4,1]},
        colors:()=>({
          top:'#15171C',
          bottom:'#08090C',
          border:'#30343C'
        })
      },

      // Red motorsport accent strips
      C.flat('v6LeftAccent',24,178,3,292,'accent'),
      C.flat('v6RightAccent',1893,178,3,292,'accent'),

      // Left-side driving information
      C.text('v6OutsideLabel',34,195,140,24,
        'OUTSIDE',muted),
      C.text('v6OutsideValue',30,231,148,40,
        d=>C.outsideText(o,d.outside),white),

      C.flat('v6LeftRule',36,293,128,2,'bezel2'),

      C.text('v6FuelLabel',34,317,140,24,
        'FUEL RANGE',muted),
      C.text('v6FuelValue',30,355,148,42,
        d=>C.distText(o,d.frange),white),

      // Right-side hybrid information
      C.text('v6ElectricLabel',1745,195,150,24,
        'E-RANGE',muted),
      C.text('v6ElectricValue',1742,231,150,40,
        C.focus.range(o),blue),

      C.flat('v6RightRule',1751,293,128,2,'bezel2'),

      C.text('v6PowerLabel',1745,317,150,24,
        'E-POWER',muted),
      C.text('v6PowerValue',1742,355,150,42,
        C.kwText,blue),



      // Left: speedometer
      dial('speedDial',510,360,390,
        [speed.max,speed.major,speed.minor,speed.max+1],
        d=>C.isNum(d.speed)?C.speedIn(o,d.speed):0),

      C.text('speedValue',410,425,200,70,
        d=>C.speedText(o,d),white),
      C.text('speedUnit',430,496,160,25,
        C.speedUnit(o),muted),

      // Right: hybrid battery gauge
      dial('batteryDial',1410,360,390,
        [100,20,10,101],
        d=>C.isNum(d.soc)?d.soc:0,true),

      C.text('socValue',1300,432,220,68,
        C.socText,blue),
      C.text('socLabel',1285,501,250,25,
        'BATTERY',muted),

      // Centre: main RPM tachometer


      // V18: thin illuminated RPM redline arc
      {
        key:'v18RedlineArc',
        kind:'band',
        z:12,
        x:690.2,y:50.2,
        w:539.6,h:539.6,
        params:{
          u_geo:[269.8,269.8,254.8,5],
          u_span:[101.25,135,0,0],
          u_marks:[0,0,0,0],
          u_red:[2],
          u_soft:[1]
        },
        colors:t=>({
          track:'#08090D',
          fill0:'#FF3048',
          fill1:'#FF3048',
          redc:'#FF3048',
          tip:'#FF6070',
          tick:'#FF3048',
          num:'#FF3048'
        }),
        value:()=>1,
        max:1,
        sweep:true
      },
      dial('rpmDial',960,320,560,
        [rpm.max,rpm.major,rpm.minor,rpm.red],
        d=>C.isNum(d.rpm)?d.rpm/1000:0),

      C.text('gear',855,342,210,82,
        C.gearText,white),
      C.text('rpmValue',865,430,190,39,
        d=>C.isNum(d.rpm)?String(Math.round(d.rpm)):'--',
        white),
      C.text('rpmUnit',875,473,170,22,
        'RPM',muted),


      {
        key:'v7LowerPanel',
        kind:'panel',
        x:194,y:563,w:1530,h:119,
        z:-1,
        params:{u_box:[16,1,0.25,1]},
        colors:()=>({
          top:'#14161A',
          bottom:'#08090B',
          border:'#292D34'
        })
      },

      C.flat('v7TopRule',215,565,1488,2,'bezel2'),


      // V14: driving mode inside central RPM gauge
      C.text('v14DriveModeLabel',820,505,280,18,
        'DRIVING MODE',muted),

      C.text('v14DriveMode',820,527,280,28,
        d=>{
          const value = d && d.driveMode;
          return value == null || value === ''
            ? '--' : String(value).toUpperCase();
        },white),

      // Lower information panels
      ...infoBox('oil',220,'OIL TEMP',
        d=>C.tempText(o,d.oil)),
      ...infoBox('coolant',535,'COOLANT',
        d=>C.tempText(o,d.coolant)),
      ...infoBox('fuelBottom',1125,'FUEL RANGE',
        d=>C.distText(o,d.frange)),
      ...infoBox('outsideBottom',1440,'OUTSIDE TEMP',
        d=>C.outsideText(o,d.outside))
    ];
  }
};
