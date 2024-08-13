const HANDLE_SCROLL=!0;function hsl_to_hex(h,s,l){l/=100;const a=s*Math.min(l,1-l)/100;function f(n){const k=(n+h/30)%12,color=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*color).toString(16).padStart(2,"0")}return`#${f(0)}${f(8)}${f(4)}`}function normalizeColor(hexCode){return[(hexCode>>16&255)/255,(hexCode>>8&255)/255,(255&hexCode)/255]}["SCREEN","LINEAR_LIGHT"].reduce((hexCode,t,n)=>Object.assign(hexCode,{[t]:n}),{});class MiniGl{constructor(canvas,width,height,debug=!1){const _miniGl=this;let debug_output=-1!==document.location.search.toLowerCase().indexOf("debug=webgl");_miniGl.canvas=canvas,_miniGl.gl=_miniGl.canvas.getContext("webgl",{antialias:!0}),_miniGl.meshes=[];const context=_miniGl.gl;width&&height&&this.setSize(width,height),_miniGl.lastDebugMsg,_miniGl.debug=debug&&debug_output?function(e){const t=new Date;t-_miniGl.lastDebugMsg>1e3&&console.log("---"),console.log(t.toLocaleTimeString()+Array(Math.max(0,32-e.length)).join(" ")+e+": ",...Array.from(arguments).slice(1)),_miniGl.lastDebugMsg=t}:()=>{},Object.defineProperties(_miniGl,{Material:{enumerable:!1,value:class{constructor(vertexShaders,fragments,uniforms={}){const material=this;function getShaderByType(type,source){const shader=context.createShader(type);return context.shaderSource(shader,source),context.compileShader(shader),context.getShaderParameter(shader,context.COMPILE_STATUS)||console.error(context.getShaderInfoLog(shader)),_miniGl.debug("Material.compileShaderSource",{source}),shader}function getUniformVariableDeclarations(uniforms,type){return Object.entries(uniforms).map(([uniform,value])=>value.getDeclaration(uniform,type)).join(`
`)}material.uniforms=uniforms,material.uniformInstances=[];const prefix=`
              precision highp float;
            `;material.vertexSource=`
              ${prefix}
              attribute vec4 position;
              attribute vec2 uv;
              attribute vec2 uvNorm;
              ${getUniformVariableDeclarations(_miniGl.commonUniforms,"vertex")}
              ${getUniformVariableDeclarations(uniforms,"vertex")}
              ${vertexShaders}
            `,material.Source=`
              ${prefix}
              ${getUniformVariableDeclarations(_miniGl.commonUniforms,"fragment")}
              ${getUniformVariableDeclarations(uniforms,"fragment")}
              ${fragments}
            `,material.vertexShader=getShaderByType(context.VERTEX_SHADER,material.vertexSource),material.fragmentShader=getShaderByType(context.FRAGMENT_SHADER,material.Source),material.program=context.createProgram(),context.attachShader(material.program,material.vertexShader),context.attachShader(material.program,material.fragmentShader),context.linkProgram(material.program),context.getProgramParameter(material.program,context.LINK_STATUS)||console.error(context.getProgramInfoLog(material.program)),context.useProgram(material.program),material.attachUniforms(void 0,_miniGl.commonUniforms),material.attachUniforms(void 0,material.uniforms)}attachUniforms(name,uniforms){const material=this;void 0===name?Object.entries(uniforms).forEach(([name,uniform])=>{material.attachUniforms(name,uniform)}):"array"==uniforms.type?uniforms.value.forEach((uniform,i)=>material.attachUniforms(`${name}[${i}]`,uniform)):"struct"==uniforms.type?Object.entries(uniforms.value).forEach(([uniform,i])=>material.attachUniforms(`${name}.${uniform}`,i)):(_miniGl.debug("Material.attachUniforms",{name,uniform:uniforms}),material.uniformInstances.push({uniform:uniforms,location:context.getUniformLocation(material.program,name)}))}}},Uniform:{enumerable:!1,value:class{constructor(e){this.type="float",Object.assign(this,e),this.typeFn={float:"1f",int:"1i",vec2:"2fv",vec3:"3fv",vec4:"4fv",mat4:"Matrix4fv"}[this.type]||"1f",this.update()}update(value){void 0!==this.value&&context[`uniform${this.typeFn}`](value,0===this.typeFn.indexOf("Matrix")?this.transpose:this.value,0===this.typeFn.indexOf("Matrix")?this.value:null)}getDeclaration(name,type,length){const uniform=this;if(uniform.excludeFrom!==type){if("array"===uniform.type)return uniform.value[0].getDeclaration(name,type,uniform.value.length)+`
const int ${name}_length = ${uniform.value.length};`;if("struct"===uniform.type){let name_no_prefix=name.replace("u_","");return name_no_prefix=name_no_prefix.charAt(0).toUpperCase()+name_no_prefix.slice(1),`uniform struct ${name_no_prefix} 
                                  {
`+Object.entries(uniform.value).map(([name,uniform])=>uniform.getDeclaration(name,type).replace(/^uniform/,"")).join("")+`
} ${name}${length>0?`[${length}]`:""};`}return`uniform ${uniform.type} ${name}${length>0?`[${length}]`:""};`}}}},PlaneGeometry:{enumerable:!1,value:class{constructor(width,height,n,i,orientation){context.createBuffer(),this.attributes={position:new _miniGl.Attribute({target:context.ARRAY_BUFFER,size:3}),uv:new _miniGl.Attribute({target:context.ARRAY_BUFFER,size:2}),uvNorm:new _miniGl.Attribute({target:context.ARRAY_BUFFER,size:2}),index:new _miniGl.Attribute({target:context.ELEMENT_ARRAY_BUFFER,size:3,type:context.UNSIGNED_SHORT})},this.setTopology(n,i),this.setSize(width,height,orientation)}setTopology(e=1,t=1){const n=this;n.xSegCount=e,n.ySegCount=t,n.vertexCount=(n.xSegCount+1)*(n.ySegCount+1),n.quadCount=n.xSegCount*n.ySegCount*2,n.attributes.uv.values=new Float32Array(2*n.vertexCount),n.attributes.uvNorm.values=new Float32Array(2*n.vertexCount),n.attributes.index.values=new Uint16Array(3*n.quadCount);for(let e=0;e<=n.ySegCount;e++)for(let t=0;t<=n.xSegCount;t++){const i=e*(n.xSegCount+1)+t;if(n.attributes.uv.values[2*i]=t/n.xSegCount,n.attributes.uv.values[2*i+1]=1-e/n.ySegCount,n.attributes.uvNorm.values[2*i]=t/n.xSegCount*2-1,n.attributes.uvNorm.values[2*i+1]=1-e/n.ySegCount*2,t<n.xSegCount&&e<n.ySegCount){const s=e*n.xSegCount+t;n.attributes.index.values[6*s]=i,n.attributes.index.values[6*s+1]=i+1+n.xSegCount,n.attributes.index.values[6*s+2]=i+1,n.attributes.index.values[6*s+3]=i+1,n.attributes.index.values[6*s+4]=i+1+n.xSegCount,n.attributes.index.values[6*s+5]=i+2+n.xSegCount}}n.attributes.uv.update(),n.attributes.uvNorm.update(),n.attributes.index.update(),_miniGl.debug("Geometry.setTopology",{uv:n.attributes.uv,uvNorm:n.attributes.uvNorm,index:n.attributes.index})}setSize(width=1,height=1,orientation="xz"){const geometry=this;geometry.width=width,geometry.height=height,geometry.orientation=orientation,geometry.attributes.position.values&&geometry.attributes.position.values.length===3*geometry.vertexCount||(geometry.attributes.position.values=new Float32Array(3*geometry.vertexCount));const o=width/-2,r=height/-2,segment_width=width/geometry.xSegCount,segment_height=height/geometry.ySegCount;for(let yIndex=0;yIndex<=geometry.ySegCount;yIndex++){const t=r+yIndex*segment_height;for(let xIndex=0;xIndex<=geometry.xSegCount;xIndex++){const r=o+xIndex*segment_width,l=yIndex*(geometry.xSegCount+1)+xIndex;geometry.attributes.position.values[3*l+"xyz".indexOf(orientation[0])]=r,geometry.attributes.position.values[3*l+"xyz".indexOf(orientation[1])]=-t}}geometry.attributes.position.update(),_miniGl.debug("Geometry.setSize",{position:geometry.attributes.position})}}},Mesh:{enumerable:!1,value:class{constructor(geometry,material){const mesh=this;mesh.geometry=geometry,mesh.material=material,mesh.wireframe=!1,mesh.attributeInstances=[],Object.entries(mesh.geometry.attributes).forEach(([e,attribute])=>{mesh.attributeInstances.push({attribute,location:attribute.attach(e,mesh.material.program)})}),_miniGl.meshes.push(mesh),_miniGl.debug("Mesh.constructor",{mesh})}draw(){context.useProgram(this.material.program),this.material.uniformInstances.forEach(({uniform:e,location:t})=>e.update(t)),this.attributeInstances.forEach(({attribute:e,location:t})=>e.use(t)),context.drawElements(this.wireframe?context.LINES:context.TRIANGLES,this.geometry.attributes.index.values.length,context.UNSIGNED_SHORT,0)}remove(){_miniGl.meshes=_miniGl.meshes.filter(e=>e!=this)}}},Attribute:{enumerable:!1,value:class{constructor(e){this.type=context.FLOAT,this.normalized=!1,this.buffer=context.createBuffer(),Object.assign(this,e),this.update()}update(){void 0!==this.values&&(context.bindBuffer(this.target,this.buffer),context.bufferData(this.target,this.values,context.STATIC_DRAW))}attach(e,t){const n=context.getAttribLocation(t,e);return this.target===context.ARRAY_BUFFER&&(context.enableVertexAttribArray(n),context.vertexAttribPointer(n,this.size,this.type,this.normalized,0,0)),n}use(e){context.bindBuffer(this.target,this.buffer),this.target===context.ARRAY_BUFFER&&(context.enableVertexAttribArray(e),context.vertexAttribPointer(e,this.size,this.type,this.normalized,0,0))}}}});const a=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];_miniGl.commonUniforms={projectionMatrix:new _miniGl.Uniform({type:"mat4",value:a}),modelViewMatrix:new _miniGl.Uniform({type:"mat4",value:a}),resolution:new _miniGl.Uniform({type:"vec2",value:[1,1]}),aspectRatio:new _miniGl.Uniform({type:"float",value:1})}}setSize(w=640,h=480){this.width=w,this.height=h,this.canvas.width=w,this.canvas.height=h,this.gl.viewport(0,0,w,h),this.commonUniforms.resolution.value=[w,h],this.commonUniforms.aspectRatio.value=w/h,this.debug("MiniGL.setSize",{width:w,height:h})}setOrthographicCamera(e=0,t=0,n=0,i=-2e3,s=2e3){this.commonUniforms.projectionMatrix.value=[2/this.width,0,0,0,0,2/this.height,0,0,0,0,2/(i-s),0,e,t,n,1],this.debug("setOrthographicCamera",this.commonUniforms.projectionMatrix.value)}render(){this.gl.clearColor(0,0,0,0),this.gl.clearDepth(1),this.meshes.forEach(e=>e.draw())}}function e(object,propertyName,val){return propertyName in object?Object.defineProperty(object,propertyName,{value:val,enumerable:!0,configurable:!0,writable:!0}):object[propertyName]=val,object}class Gradient{constructor(...t){this.el=void 0,this.cssVarRetries=0,this.maxCssVarRetries=200,this.angle=0,this.isLoadedClass=!1,this.isScrolling=!1,this.scrollingTimeout=void 0,this.scrollingRefreshDelay=200,this.isIntersecting=!1,this.shaderFiles=void 0,e(this,"vertexShader",void 0),e(this,"sectionColors",void 0),e(this,"computedCanvasStyle",void 0),e(this,"conf",void 0),e(this,"uniforms",void 0),e(this,"t",1253106),e(this,"last",0),e(this,"width",void 0),e(this,"minWidth",1111),e(this,"height",600),e(this,"xSegCount",void 0),e(this,"ySegCount",void 0),e(this,"mesh",void 0),e(this,"material",void 0),e(this,"geometry",void 0),e(this,"minigl",void 0),e(this,"scrollObserver",void 0),this.freqX=14e-5,this.freqY=29e-5,this.amp=600,this.seed=Math.random()*100,this.freqDelta=1e-5,this.activeColors=[1,1,1,1],this.isMetaKey=!1,this.isGradientLegendVisible=!1,this.isMouseDown=!1,HANDLE_SCROLL&&(this.handleScroll=()=>{clearTimeout(this.scrollingTimeout),this.scrollingTimeout=setTimeout(this.handleScrollEnd,this.scrollingRefreshDelay),this.isGradientLegendVisible&&this.hideGradientLegend(),this.conf.playing&&(this.isScrolling=!0,this.pause())},this.handleScrollEnd=()=>{this.isScrolling=!1,this.play()}),this.resize=()=>{let w=window.innerWidth,h=window.innerHeight;w=w>1200?w>>1:w,h=h>1200?h>>1:h,this.width=w,this.height=h,this.minigl.setSize(w,h),this.minigl.setOrthographicCamera(),this.xSegCount=Math.ceil(w*this.conf.density[0]),this.ySegCount=Math.ceil(h*this.conf.density[1]),this.mesh.geometry.setTopology(this.xSegCount,this.ySegCount),this.mesh.geometry.setSize(w,h),this.mesh.material.uniforms.u_shadow_power.value=w<600?5:6},this.handleMouseDown=e=>{this.isGradientLegendVisible&&(this.isMetaKey=e.metaKey,this.isMouseDown=!0,!1===this.conf.playing&&requestAnimationFrame(this.animate))},this.handleMouseUp=()=>{this.isMouseDown=!1},this.animate=e=>{if(!this.shouldSkipFrame(e)||this.isMouseDown){if(this.t+=Math.min(e-this.last,1e3/15),this.last=e,this.isMouseDown){let e=160;this.isMetaKey&&(e=-160),this.t+=e}this.mesh.material.uniforms.u_time.value=this.t,this.minigl.render()}if(0!==this.last&&this.isStatic)return this.minigl.render(),void this.disconnect();(this.conf.playing||this.isMouseDown)&&requestAnimationFrame(this.animate)},this.addIsLoadedClass=()=>{!this.isLoadedClass&&(this.isLoadedClass=!0,this.el.classList.add("isLoaded"),setTimeout(()=>{this.el.parentElement.classList.add("isLoaded")},3e3))},this.pause=()=>{this.conf.playing=!1},this.play=()=>{requestAnimationFrame(this.animate),this.conf.playing=!0},this.initGradient=selector=>(typeof selector=="string"?this.el=document.querySelector(selector):this.el=selector,this.connect(),this)}async connect(){this.shaderFiles={vertex:`varying vec3 v_color;
                
                void main() {
                    float time = u_time * u_global.noiseSpeed;
                    vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;
                    vec2 st = 1. - uvNorm.xy;
                    
                    //
                    // Tilting the plane
                    //
                    // Front-to-back tilt
                    float tilt = resolution.y / 2.0 * uvNorm.y;
                    // Left-to-right angle
                    float incline = resolution.x * uvNorm.x / 3.0 * u_vertDeform.incline;
                    // Up-down shift to offset incline
                    float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);
                    
                    //
                    // Vertex noise
                    //
                    float noise = snoise(vec3(
                        noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
                        noiseCoord.y * u_vertDeform.noiseFreq.y,
                        time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
                    )) * u_vertDeform.noiseAmp;
                    
                    // Fade noise to zero at edges
                    noise *= 1.0 - pow(abs(uvNorm.y), 2.0);
                    
                    // Clamp to 0
                    noise = max(0.0, noise);
                    
                    vec3 pos = vec3(
                        position.x,
                        position.y + tilt + incline + noise - offset,
                        position.z
                    );
                    
                    //
                    // Vertex color, to be passed to fragment shader
                    //
                    if (u_active_colors[0] == 1.) {
                        v_color = u_baseColor;
                    }
                    
                    for (int i = 0; i < u_waveLayers_length; i++) {
                        if (u_active_colors[i + 1] == 1.) {
                            WaveLayers layer = u_waveLayers[i];
                            float noise = smoothstep(
                                layer.noiseFloor,
                                layer.noiseCeil,
                                snoise(vec3(
                                    noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
                                    noiseCoord.y * layer.noiseFreq.y,
                                    time * layer.noiseSpeed + layer.noiseSeed
                                )) / 2.0 + 0.5
                            );
                            v_color = blendNormal(v_color, layer.color, pow(noise, 4.));
                        }
                    }
                    //
                    // Finish
                    //
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }`,noise:`//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}`,blend:`//
// https://github.com/jamieowen/glsl-blend
//

// Normal

vec3 blendNormal(vec3 base, vec3 blend) {
	return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
	return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}

// Screen

float blendScreen(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
	return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
	return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}

// Multiply

vec3 blendMultiply(vec3 base, vec3 blend) {
	return base*blend;
}

vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
	return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}

// Overlay

float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

// Hard light

vec3 blendHardLight(vec3 base, vec3 blend) {
	return blendOverlay(blend,base);
}

vec3 blendHardLight(vec3 base, vec3 blend, float opacity) {
	return (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Soft light

float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Color dodge

float blendColorDodge(float base, float blend) {
	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge(vec3 base, vec3 blend) {
	return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
}

vec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {
	return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));
}

// Color burn

float blendColorBurn(float base, float blend) {
	return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn(vec3 base, vec3 blend) {
	return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));
}

vec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {
	return (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));
}

// Vivid Light

float blendVividLight(float base, float blend) {
	return (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));
}

vec3 blendVividLight(vec3 base, vec3 blend) {
	return vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));
}

vec3 blendVividLight(vec3 base, vec3 blend, float opacity) {
	return (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Lighten

float blendLighten(float base, float blend) {
	return max(blend,base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
	return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}

vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
	return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear burn

float blendLinearBurn(float base, float blend) {
	// Note : Same implementation as BlendSubtractf
	return max(base+blend-1.0,0.0);
}

vec3 blendLinearBurn(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendSubtract
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {
	return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear dodge

float blendLinearDodge(float base, float blend) {
	// Note : Same implementation as BlendAddf
	return min(base+blend,1.0);
}

vec3 blendLinearDodge(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendAdd
	return min(base+blend,vec3(1.0));
}

vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {
	return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear light

float blendLinearLight(float base, float blend) {
	return blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));
}

vec3 blendLinearLight(vec3 base, vec3 blend) {
	return vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));
}

vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {
	return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));
}`,fragment:`varying vec3 v_color;

                float random (vec2 st) { // 0 to 1
                    return fract(sin(dot(st.xy,
                                         vec2(12.9898,78.233)))*
                        43758.5453123);
                }

                void main() {
                    vec3 color = v_color;
                    
                    // if (u_darken_top == 1.0) {
                    //     vec2 st = gl_FragCoord.xy/resolution.xy;
                    //     color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
                    // }

                    vec2 st = gl_FragCoord.xy/resolution.xy;
                    float rnd = 2.0 * random( st ) - 1.0;
                    gl_FragColor = vec4( color + 0.002*(vec3(rnd, rnd, rnd)) , 1.0);
                    

                    // gl_FragColor = vec4(color, 1.0);
                }`},this.conf={presetName:"",wireframe:!1,density:[.06,.16],zoom:10,rotation:0,playing:!0},this.minigl=new MiniGl(this.el,null,null,!0),requestAnimationFrame(()=>{this.el&&(this.computedCanvasStyle=getComputedStyle(this.el),this.waitForCssVars())}),HANDLE_SCROLL&&window.addEventListener("scroll",this.handleScroll)}disconnect(){HANDLE_SCROLL&&window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("resize",this.resize)}initMaterial(){this.uniforms={u_time:new this.minigl.Uniform({value:0}),u_shadow_power:new this.minigl.Uniform({value:5}),u_darken_top:new this.minigl.Uniform({value:""===this.el.dataset.jsDarkenTop?1:0}),u_active_colors:new this.minigl.Uniform({value:this.activeColors,type:"vec4"}),u_global:new this.minigl.Uniform({value:{noiseFreq:new this.minigl.Uniform({value:[this.freqX,this.freqY],type:"vec2"}),noiseSpeed:new this.minigl.Uniform({value:5e-6})},type:"struct"}),u_vertDeform:new this.minigl.Uniform({value:{incline:new this.minigl.Uniform({value:Math.sin(this.angle)/Math.cos(this.angle)}),offsetTop:new this.minigl.Uniform({value:-.5}),offsetBottom:new this.minigl.Uniform({value:-.5}),noiseFreq:new this.minigl.Uniform({value:[3,4],type:"vec2"}),noiseAmp:new this.minigl.Uniform({value:this.amp}),noiseSpeed:new this.minigl.Uniform({value:10}),noiseFlow:new this.minigl.Uniform({value:3}),noiseSeed:new this.minigl.Uniform({value:this.seed})},type:"struct",excludeFrom:"fragment"}),u_baseColor:new this.minigl.Uniform({value:this.sectionColors[0],type:"vec3",excludeFrom:"fragment"}),u_waveLayers:new this.minigl.Uniform({value:[],excludeFrom:"fragment",type:"array"})};for(let e=1;e<this.sectionColors.length;e+=1)this.uniforms.u_waveLayers.value.push(new this.minigl.Uniform({value:{color:new this.minigl.Uniform({value:this.sectionColors[e],type:"vec3"}),noiseFreq:new this.minigl.Uniform({value:[2+e/this.sectionColors.length,3+e/this.sectionColors.length],type:"vec2"}),noiseSpeed:new this.minigl.Uniform({value:11+.3*e}),noiseFlow:new this.minigl.Uniform({value:6.5+.3*e}),noiseSeed:new this.minigl.Uniform({value:this.seed+10*e}),noiseFloor:new this.minigl.Uniform({value:.1}),noiseCeil:new this.minigl.Uniform({value:.63+.07*e})},type:"struct"}));return this.vertexShader=[this.shaderFiles.noise,this.shaderFiles.blend,this.shaderFiles.vertex].join(`

`),new this.minigl.Material(this.vertexShader,this.shaderFiles.fragment,this.uniforms)}initMesh(){this.material=this.initMaterial(),this.geometry=new this.minigl.PlaneGeometry,this.mesh=new this.minigl.Mesh(this.geometry,this.material)}shouldSkipFrame(e){return!!window.document.hidden||!this.conf.playing||parseInt(e,10)%2==0||void 0}updateFrequency(e){this.freqX+=e,this.freqY+=e}toggleColor(index){this.activeColors[index]=0===this.activeColors[index]?1:0}showGradientLegend(){this.width>this.minWidth&&(this.isGradientLegendVisible=!0,document.body.classList.add("isGradientLegendVisible"))}hideGradientLegend(){this.isGradientLegendVisible=!1,document.body.classList.remove("isGradientLegendVisible")}init(){this.initGradientColors(),this.initMesh(),this.resize(),requestAnimationFrame(this.animate),window.addEventListener("resize",this.resize)}waitForCssVars(){if(this.computedCanvasStyle&&-1!==this.get_computed_hex_color("--gradient-color-1"))this.init(),this.addIsLoadedClass();else{if(this.cssVarRetries+=1,this.cssVarRetries>this.maxCssVarRetries)return this.sectionColors=[16711680,16711680,16711935,65280,255],void this.init();requestAnimationFrame(()=>this.waitForCssVars())}}initGradientColors(){this.sectionColors=["--gradient-color-1","--gradient-color-2","--gradient-color-3","--gradient-color-4"].map(cssPropertyName=>{let hex=this.get_computed_hex_color(cssPropertyName);if(4===hex.length){const hexTemp=hex.substr(1).split("").map(hexTemp=>hexTemp+hexTemp).join("");hex=`#${hexTemp}`}return hex&&`0x${hex.substr(1)}`}).filter(Boolean).map(normalizeColor)}get_computed_hex_color(varname){const val=this.computedCanvasStyle.getPropertyValue(varname).trim();let hex="";if(val[0]==="#")hex=val;else if(val.startsWith("hsl")){const a=val.split(/[\s,%hsl()]+/);hex=hsl_to_hex(Number(a[1]),Number(a[2]),Number(a[3]))}return hex}}export{Gradient}