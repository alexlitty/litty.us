import './SiteLayout.css';
import './SiteHeader.css';

import HeaderCanvas from './HeaderCanvas.jsx';

// Set up the logo as the "velocity stick" input.
/*document.addEventListener('', () => {
    let velocityStick = document.getElementById("site-logo");
    console.log(velocityStick);
    velocityStick.ondragstart = () => { return false; };

    function onVelocityStickDown(event) {
        event.preventDefault();

        let rect = velocityStick.getBoundingClientRect();
        let origin = {
            x: rect.left + (rect.width / 2),
            y: rect.top + (rect.height / 2)
        };

        console.log(origin);

        function onVelocityStickMove(event) {

        }
    }

    velocityStick.addEventListener('mousedown', onVelocityStickDown);
});*/

export default function Header() {
    return (
        <div className="site-row">
            <div className="site-header">
                <HeaderCanvas />
                <div className="logo" id="site-logo">

                    <svg xmlns="http://www.w3.org/2000/svg"
                         xmlnsXlink="http://www.w3.org/1999/xlink">
                        <defs>
                            <path id="path1"
                                fill="none" stroke="black" strokeWidth="1"
                                d="M 149 239 A 90 90 0 1 1 151 239">
                            </path>
                            <path id="lowerTextPath"
                                fill="none" stroke="black" strokeWidth="1"
                                d="M 60 150 A 90 90 0 0 0 240 150">
                            </path>
                            <path id="leftSymbolPath"
                                fill="none" stroke="none"
                                d="M 145 240 A 90 90 0 0 1 155 60">
                            </path>
                            <path id="rightSymbolPath"
                                fill="none" stroke="none"
                                d="M 145 60 A 90 90 0 0 1 155 240">
                            </path>
                        </defs>
                        <circle cx="150" cy="150" r="100" strokeWidth="22" />
                        <text>
                            <textPath xlinkHref="#path1" textAnchor="middle" startOffset="50%">
                            <tspan dy="-0.25em">Software Engineer Extraordinaire</tspan>
                            </textPath>
                        </text>
                        <text>
                            <textPath xlinkHref="#lowerTextPath" textAnchor="middle" startOffset="50%">
                                <tspan dy="0.95em">San Francisco Bay Area + Remote</tspan>
                            </textPath>
                        </text>
                        <text>
                            <textPath xlinkHref="#leftSymbolPath" textAnchor="middle" startOffset="50%">
                                <tspan dy="-0.35em">&bull;</tspan>
                            </textPath>
                        </text>
                        <text>
                            <textPath xlinkHref="#rightSymbolPath" textAnchor="middle" startOffset="50%">
                                <tspan dy="-0.35em">&bull;</tspan>
                            </textPath>
                        </text>
                    </svg>

                    <div className="label-container">
                        <div className="label small">
                            <span>A</span>
                            <span>L</span>
                            <span>E</span>
                            <span>X</span>
                            <span>A</span>
                            <span>N</span>
                            <span>D</span>
                            <span>E</span>
                            <span>R</span>
                        </div>
                        <div className="label large">
                            <span>L</span>
                            <span>I</span>
                            <span>T</span>
                            <span>T</span>
                            <span>Y</span>
                        </div>
                    </div>
                </div>
                <a className="info" href="mailto:alexander@litty.us">
                    <b>Available for hire!</b>
                </a>
                <div className="info">
                    Ex-Googler and<br />prior founder.<br /><br />
                    Senior lead, fullstack and backend.<br /><br />
                    Ads, anti-evil,<br />gamedev, and<br />finance industries.
                </div>
            </div>
        </div>
    );
};
