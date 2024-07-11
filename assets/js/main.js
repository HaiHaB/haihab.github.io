(function(){

    new cookieNoticeJS({

        // Localizations of the notice message
        messageLocales: {
          en: 'We use anonymous cookies on this website to monitor and improve upon site performance.<br/> By continuing to use our site you agree to this use. You can learn more and remove these cookies at any point via our'
        },

        // Localizations of the dismiss button text
        buttonLocales: {
          en: 'I ACCEPT'
        },

        // Position for the cookie-notifier (default=bottom)
        cookieNoticePosition:'bottom',

        // Shows the "learn more button (default=false)
        learnMoreLinkEnabled: true,

        // The href of the learn more link must be applied if (learnMoreLinkEnabled=true)
        // learnMoreLinkHref:'cookie.html',
		learnMoreLinkHref:'/policy/cookie_policy.html',

        // Text for optional learn more button
        learnMoreLinkText:{
            en:'cookie page'
        },

        // The message will be shown again in X days
        expiresIn: 30,

        // Dismiss button background color
        buttonBgColor: '#d35400',

        // Dismiss button text color
        buttonTextColor: '#fff',

        // Notice background color
        noticeBgColor: '#000',

        // Notice text color
        noticeTextColor: '#fff',

        // the lernMoreLink color (default='#009fdd')
        linkColor:'#f00'

     });

})();

class MyNavigation extends HTMLElement {
	connectedCallBack () {
		this.innerHTML = `
			<div class="wrapper no-pad">
				<ul class="navigation">
					<li>
						<h1><a href="/" class="logo-small" title="Atom: A hackable text editor for the 21st Century"></a></h1>
					</li>
					<li><a href="">ProCue</a></li>
					<li><a href="consulting/consulting.html">Leadership</a></li>
					<li><a href="outsourcing/outsourcing.html">Capabilities</a></li>
				</ul>
			</div>
		 `
	}
}

customElements.define('myNavigation', MyNavigation)