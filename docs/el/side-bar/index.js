import*as iolet from"../iolet/index.js";import*as bp from"../bp.js";const TAG="side-bar",SHOW_DELAY=500,HIDE_DELAY=300,ROOT_SHOWN_CLASS="sidebar-shown",DEFAULT_SHOW=!1,HTML=`
<div class="sbar_header_bg"></div>
<div class="sbar_header">        
    <div class="hamburger" onclick="this.parentElement.parentElement.toggle()">
        <div class="_line _line-1"></div>
        <div class="_line _line-2"></div>
        <div class="_line _line-3"></div>
    </div>
    <div id="sbar_logo">
        <a href="/" style="display: flex;">
            <outlet- name="logo"></outlet->
        </a>
    </div>
</div>
<div id="sbar_ctas">
    <outlet- name="ctas"></outlet->
</div>
<div class="sbar_nav_bg MD:c_dark c_bg"></div>
<nav class="sbar_nav data-lenis-prevent sbar_scroller c_ui MD:c_dark">
    <outlet- name="nav"></outlet->
</nav>
`,raf=requestAnimationFrame,delay=function(ms,fn){return setTimeout(fn,ms)},undelay=clearTimeout;class Element extends HTMLElement{constructor(){super(),init(this)}connectedCallback(){connect(this)}is_shown(){return this.classList.contains("show")}toggle(){_toggle(this,!this.is_shown())}show(){this.is_shown()||_toggle(this,!0)}hide(){this.is_shown()&&_toggle(this,!1)}}customElements.define(TAG,Element);function init(el){el._onhashchange=_onhashchange.bind(null,el),el.setAttribute("data-lenis-prevent",""),el.insertAdjacentHTML("beforeend",HTML)}function connect(el){iolet.flush(el),_connect_showable(el),window.addEventListener("hashchange",el._onhashchange)}var prevURL,currentURL=window.location.href;function _onhashchange(el){prevURL=currentURL,currentURL=window.location.href,el.hide()}function _connect_scroller(el){const scroller=el.querySelector(".sbar_scroller");scroller.addEventListener("scroll",el._scroller_onscroll)}function _connect_showable(el){let show=DEFAULT_SHOW;el.hasAttribute("show")&&(show=el.getAttribute("show"),show=="false"?show=!1:show?show=!0:show=DEFAULT_SHOW),show?did_show(el):did_hide(el)}function will_show(el){el.classList.remove("hidden")}function did_show(el){el.classList.add("show"),document.documentElement.classList.add(ROOT_SHOWN_CLASS)}function will_hide(el){el.classList.remove("show")}function did_hide(el){el.classList.add("hidden"),document.documentElement.classList.remove(ROOT_SHOWN_CLASS)}function _toggle(el,show){if(el._delay)return;raf(show?function(){will_show(el),raf(function(){did_show(el)})}:function(){will_hide(el),el._delay=delay(HIDE_DELAY,function(){el._delay=0,raf(function(){did_hide(el)})})})}