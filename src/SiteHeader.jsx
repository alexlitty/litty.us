import './SiteLayout.css';
import './SiteHeader.css';

export default function Header() {
    return (
        <div className="site-row">
            <div className="site-header">
                <div className="logo">

                    <svg xmlns="http://www.w3.org/2000/svg"
                         xmlnsXlink="http://www.w3.org/1999/xlink">
                        <defs>
                            <path id="path1"
                                fill="none" stroke="black" stroke-width="1"
                                d="M 149 239 A 90 90 0 1 1 151 239">
                            </path>
                            <path id="lowerTextPath"
                                fill="none" stroke="black" stroke-width="1"
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
                        <circle cx="150" cy="150" r="100" fill="none" stroke-width="22" />
                        <text>
                            <textPath xlinkHref="#path1" text-anchor="middle" startOffset="50%">
                            <tspan dy="-0.25em">Software Engineer Extraordinaire</tspan>
                            </textPath>
                        </text>
                        <text>
                            <textPath xlinkHref="#lowerTextPath" text-anchor="middle" startOffset="50%">
                                <tspan dy="0.95em">San Francisco Bay Area + Remote</tspan>
                            </textPath>
                        </text>
                        <text>
                            <textPath xlinkHref="#leftSymbolPath" text-anchor="middle" startOffset="50%">
                                <tspan dy="-0.35em">&bull;</tspan>
                            </textPath>
                        </text>
                        <text>
                            <textPath xlinkHref="#rightSymbolPath" text-anchor="middle" startOffset="50%">
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
            </div>
        </div>
    );
};
