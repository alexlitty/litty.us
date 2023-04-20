import './SiteLayout.css';
import './SiteHeader.css';

export default function Header() {
    return (
        <div className="site-row">
            <div className="site-header">
                <div className="logo">
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
