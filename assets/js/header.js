class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <style>

		.top-bar {
			background-color: #584b4f;
			color: #efeae1;
			font-size: 14px;
			height: 43px;
			padding: 5px 0;
			text-align: left
		}

		.top-bar h1 {
			display: inline-block;
			font-size: inherit;
			line-height: 0;
			margin: 0
		}

		.top-bar a {
			color: #efeae1
		}

		.top-bar a:hover {
			color: #81c08b;
			text-decoration: none
		}

		.top-bar a.is-selected {
			color: #a29f99
		}

		.top-bar .navigation {
			display: inline-block
		}

		.top-bar .top-bar-right {
			float: right;
			line-height: 33px
		}

		.top-bar .top-bar-right .octicon {
			padding: 5px;
			position: relative;
			top: 1px
		}

		.top-bar .top-bar-right .tooltipped {
			margin-left: 10px;
			padding-bottom: 2px
		}

		.top-bar .top-bar-right .gravatar {
			height: 22px;
			margin-right: 5px;
			vertical-align: -7px;
			width: 22px
		}

		.top-bar .minibutton {
			margin: 4px 0
		}


		.wrapper {
			margin: 0 auto;
			overflow: hidden;
			padding-left: 40px;
			padding-right: 40px;
			width: 860px
		}

		.wrapper.wide {
			width: 1060px
		}

		.wrapper.no-pad {
			padding-left: 0;
			padding-right: 0
		}

       .navigation {
			list-style-type: none;
			margin: 0;
			padding: 0
		}

		.navigation li {
			display: inline-block;
			height: 33px;
			padding-right: 5px;
			vertical-align: top
		}

		.navigation li:last-child {
			padding-right: 0
		}

		.navigation a {
			display: inline-block;
			padding: 5px;
			transition: color .2s
		}

		.navigation a:hover {
			text-decoration: none
		}

      </style>
		<nav aria-label="Primary" class="top-bar">
			<div class="wrapper no-pad">
				<ul class="navigation">
					<li>
						<h1><a href="/" class="logo-small" title="Procue: A hackable motion cueing for the 21st Century"></a></h1>
					</li>
					<li><a href="/">ProCue</a></li>
					<li><a href="/leadership/leadership.html">Leadership</a></li>
					<li><a href="/capabilities/capabilities.html">Capabilities</a></li>
					<li><a href="/philosophy/philosophy.html">Philosophy</a></li>
					<li><a href="/services/services.html">Services</a></li>
					<li><a href="/careers/careers.html">Careers</a></li>
				</ul>

			</div>

		</nav>
    `;
  }
}

customElements.define('header-component', Header);

class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        .footer {
			background-color: #efeae1;
			height: 55px;
			padding: 15px
		}

		.footer a {
			color: #574c4f
		}

		.footer a:hover {
			text-decoration: none
		}

		.footer span {
			color: #574c4f
		}

		.footer .footer-right {
			float: right
		}

		.footer .footer-left {
			float: left;
			margin: 0;
			padding: 0
		}

		.footer .footer-left li {
			display: inline-block;
			list-style-type: none;
			margin-right: 15px
		}

		.footer .octicon {
			font-size: 20px;
			position: relative;
			top: 1px
		}

		.footer .octicon-logo-github {
			top: 2px
		}
      </style>
		<footer>
			<div class="footer">
				<div class="wrapper no-pad">
				<ul class="footer-left">
					<li><a
							href="/policy/privacy_policy.html">Privacy Policy</a></li>
					<li><a
							href="/policy/cookie_policy.html">Cookie Policy</a>
					</li>
				</ul>

				<div class="footer-right">
					<a> <font size="-1"> BrownSim Ltd, Company number 14540342, Lytchett House, Freeland Park, Unit 13 Wareham Road, Lytchett Matravers, Poole, Dorset, United Kingdom, BH16 6FA
					</font> </a>
				</div>
				</div>
			</div>
		</footer>
    `;
  }
}

customElements.define('footer-component', Footer);


class Careers extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
				<p><b>Top 3 reasons to join us?</b></p>
					<li>Exceptional professional growth opportunities in a tech-focused company, allowing you to enhance your skills at an accelerated pace.</li>
					<li>Flat structure, simple processes & transparency</li>
					<li>Fully remote working experience</li>

				</ul>

				<p>If you wish to discuss this role further, then please send us an email at <a href= "mailto: craig.brown@brownsim.io"> craig.brown@brownsim.io</a></p>
				</div>
    `;
  }
}

customElements.define('careers-component', Careers);
