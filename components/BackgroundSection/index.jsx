import React, { Component } from 'react';

import { TweenMax, Bounce, Power0, Power2 } from 'gsap';

import './styles.scss';

import SvgSpeakerOn from './svg-speaker-on.jsx';
import SvgSpeakerOff from './svg-speaker-off.jsx';

class BackgroundSection extends Component {
    constructor () {
        super();

        this.state = {
            videoURL: 'http://thenewcode.com/assets/videos/atlantic-light.mp4',
            videoType: 'video/mp4',
            isSvgSpeaker: true,
            isSoundUnmute: true,
        };

        this._scrollTween = this._scrollTween.bind(this);
        this._clickScrollingTween = this._clickScrollingTween.bind(this);
        this._soundUnmute = this._soundUnmute.bind(this);
    }

    componentWillMount() {
        if (window.pageYOffset === 0) {
            this._scrollTween();
        }
    }

    componentDidMount() {
        TweenMax.to(this.logoTitle, .5, { opacity: 1, ease: Power0.easeNone });
        TweenMax.to(this.backgroundVideo, .2, { opacity: 1, ease: Power0.easeNone });
        TweenMax.to(this.backgroundSection, 1, { scale: 1, ease: Power0.easeNone });

        window.addEventListener('scroll', () => {
            TweenMax.to(this.logoTitle, .2, { opacity: 0, ease: Power0.easeNone });

            if (window.pageYOffset === 0) {
                TweenMax.to(this.logoTitle, .3, { opacity: 1, ease: Power0.easeNone });
            }

            let scrolled = window.pageYOffset || document.documentElement.scrollTop;
            this.backgroundSection.style.top = (scrolled * 0.2) + 'px';
        });

        window.addEventListener('click', () => {
            if (window.pageYOffset === 0) {
                this._clickScrollingTween();
            }
        });
    }

    _soundUnmute () {
        this.setState({
            isSvgSpeaker: !this.state.isSvgSpeaker,
            isSoundUnmute: !this.state.isSoundUnmute,
        });
    }

    _scrollTween () {
        const scrollAnimation = { scrollTop: 0 };
        let scrollTop = 60;
        let scrollDelay = 3.5;
        if (window.matchMedia('(max-width: 980px)').matches) {
            scrollTop = 160;
            scrollDelay = 1.5;
        }

        const scrollTween = TweenLite.to(scrollAnimation, .5, {
            delay: scrollDelay,
            scrollTop: scrollTop,
            ease: Power2.easeInOut,
            onUpdate: () => {
                window.scrollTo(0, scrollAnimation.scrollTop);
            }
        });

        window.addEventListener('mousewheel', mouseHandler);
        window.addEventListener('click', mouseHandler);
        function mouseHandler() {
            scrollTween.kill();
            window.removeEventListener('mousewheel', mouseHandler);
            window.removeEventListener('click', mouseHandler);
        }
    }

    _clickScrollingTween () {
        const scrollAnimation = { scrollTop: 0 };
        const scrollTop = 60;

        const scrollTween = TweenLite.to(scrollAnimation, .5, {
            scrollTop: scrollTop,
            ease: Power2.easeInOut,
            onUpdate: () => {
                window.scrollTo(0, scrollAnimation.scrollTop);
            }
        });

        window.addEventListener('mousewheel', mouseHandler);
        function mouseHandler() {
            scrollTween.kill();
            window.removeEventListener('mousewheel', mouseHandler);
        }
    }

    render() {
        const { isSvgSpeaker, isSoundUnmute } = this.state;
        const SvgSpeaker = isSvgSpeaker ? <SvgSpeakerOff /> : <SvgSpeakerOn />;
        const videoOptions = {
            loop: true,
            autoPlay: true,
            controls: false,
            muted: isSoundUnmute,
        };
        return (
            <section className="backgroundSection">
                <div
                    ref = {backgroundSection => { this.backgroundSection = backgroundSection; } }
                    className="backgroundSection-box"
                >
                    <video
                        ref = {backgroundVideo => { this.backgroundVideo = backgroundVideo; }}
                        className="backgroundSection-video"
                        { ...videoOptions }
                    >
                        <source
                            src = { this.state.videoURL }
                            type = { this.state.videoType }
                        />
                    </video>
                </div>
                <div
                    className="backgroundSection-muted"
                    onClick = { this._soundUnmute }
                >
                    { SvgSpeaker }
                </div>
                <h1
                    ref = {logoTitle => { this.logoTitle = logoTitle; }}
                    className="logoTitle"
                >
                    ISKO<i>&trade;</i>
                </h1>

            </section>
        );
    }
}

export default BackgroundSection;
