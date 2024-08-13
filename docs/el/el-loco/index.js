export{El,define_elements};const style=document.createElement("style");style.innerText=`@property --class {
    syntax: "<custom-ident>+";
    inherits: false;
    initial-value: el;
}
* {
    --class: el;
    --prepend: none; --append: none;
    --before: none; --after: none;
}
`,document.head.prepend(style);const _computed_styles=document.documentElement.computedStyleMap!==void 0?function(){const cs=this.computedStyleMap();return{get(key){const val=cs.get(key);return val==null?"":val.constructor===CSSUnparsedValue?val[0]:val.value}}}:function(){const cs=getComputedStyle(this);return{get(key){return cs.getPropertyValue(key)}}};class El extends HTMLElement{constructor(){super(),_el_init(this)}connectedCallback(){_el_connect(this)}}El.prototype.computed_styles=_computed_styles;function define_elements(){customElements.define("el-",El),_define_element("ui-tag"),_define_element("ui-card")}function _define_element(tagname){class _El extends El{}customElements.define(tagname,_El)}function _el_init(el){_el_apply_css_vars(el)}function _el_apply_css_vars(el){const cs=el.computed_styles();let cs_class=cs.get("--class"),beforebegin=cs.get("--before"),afterbegin=cs.get("--prepend"),beforeend=cs.get("--append"),afterend=cs.get("--after");__insert_html_if_needed("beforebegin",beforebegin),__insert_html_if_needed("afterbegin",afterbegin),__insert_html_if_needed("beforeend",beforeend),__insert_html_if_needed("afterend",afterend),cs_class&&cs_class!=="el"&&(cs_class=`el ${cs_class}`);const classes=cs_class.split(/\s+/);el.classList.add(...classes);function __insert_html_if_needed(pos,html){html&&html!=="none"&&el.insertAdjacentHTML(pos,html.replace(/<\s+/g,"<"))}}function _el_connect(){}