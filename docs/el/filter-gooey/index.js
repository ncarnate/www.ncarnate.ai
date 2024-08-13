const TAG="filter-gooey";export class Filter_Gooey extends HTMLElement{constructor(){super()}connectedCallback(){this.innerHTML=`
        <style>
            .gooey {
                filter:url("#filter-gooey");
            }
        </style>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display:none;">
            <defs>
                <filter id="filter-gooey-shadowed">                    
                    <feGaussianBlur in="SourceGraphic" result="blur"
                        stdDeviation="10" />
                    <feColorMatrix in="blur" result="goo" 
                        mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"  />
                    <feGaussianBlur in="goo" result="shadow" 
                        stdDeviation="6" />
                    <feColorMatrix in="shadow" result="shadow" 
                        mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.4" />
                    <feOffset in="shadow" dx="1" dy="1" result="shadow" />
                    <feComposite in2="shadow" in="goo" result="goo" />
                    
                </filter>
                <filter id="filter-gooey">
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                    <!--
                    <feComposite in2="goo" in="SourceGraphic" result="mix" 
                        operator="atop" 
                    />
                    -->
                </filter>
            </defs>
        </svg>
        `}}customElements.define(TAG,Filter_Gooey)